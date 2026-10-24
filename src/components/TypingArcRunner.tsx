import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

// The arc is inset from the SVG edges so the entire runner stays on-screen.
export const FOCUS_ARC_PATH = "M 70 350 Q 800 -160 1530 350";
export const FOCUS_ARC_FILL_PATH = FOCUS_ARC_PATH + " L 1530 380 L 70 380 Z";

interface TypingArcRunnerProps {
  /** Normalized progress through the current passage/lap, from 0 to 1. */
  progress: number;
  /** Recent typing speed in WPM (trailing window, not a test-long average). */
  wpm: number;
  active: boolean;
  reducedMotion: boolean;
}

function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/*
 * Procedural chibi goat with a forward-looking profile — the GOATTYPE mascot on the focus-mode arc.
 *
 * The goat faces LEFT (the direction of travel): forward is local -x, the
 * ground is local y = 0, up is local -y. All four legs are placed from a
 * quadruped gait cycle and solved with two-bone IK every frame, so hooves
 * genuinely plant on the arc during stance instead of the body hovering.
 * Slow typing walks (lateral 4-beat sequence), faster typing blends into a
 * diagonal trot, and sprinting adds body rock and bounce. When typing
 * stops he settles into a standing pose and dips his head. The whole goat
 * is rotated to the arc's tangent, and hoof targets follow the curve's own
 * deviation from that tangent, so he stays grounded even at the steep ends.
 */
const FWD = -1;
const UPPER_LEG = 13;
const LOWER_LEG = 13;
const BODY_Y = -22; // leg attach height (belly line)
const FRONT_X = -8; // front leg attach x
const BACK_X = 9; // back leg attach x
const GOAT_SCALE = 1.22;

interface Vec {
  x: number;
  y: number;
}

/** Two-bone IK: returns the joint (knee/hock) for start -> target. */
function solveJoint(
  start: Vec,
  target: Vec,
  l1: number,
  l2: number,
  poleSign: 1 | -1,
): Vec {
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const rawDist = Math.hypot(dx, dy) || 0.0001;
  const dist = clamp(rawDist, Math.abs(l1 - l2) + 0.05, l1 + l2 - 0.05);
  const ux = dx / rawDist;
  const uy = dy / rawDist;
  const along = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
  const height = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  const px = -uy;
  const py = ux;
  return {
    x: start.x + ux * along + px * height * poleSign,
    y: start.y + uy * along + py * height * poleSign,
  };
}

/** Tapered, softly capped coat shape, driven by the existing IK endpoints. */
function setLimb(el: SVGPathElement | null, a: Vec, b: Vec, width: number, taper: number) {
  if (!el) return;
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const ux = (b.x - a.x) / length;
  const uy = (b.y - a.y) / length;
  const nx = -uy;
  const ny = ux;
  const r1 = width / 2;
  const r2 = r1 * taper;
  const point = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  el.setAttribute("d", [
    `M ${point(a.x + nx * r1, a.y + ny * r1)}`,
    `L ${point(b.x + nx * r2, b.y + ny * r2)}`,
    `Q ${point(b.x + ux * r2, b.y + uy * r2)} ${point(b.x - nx * r2, b.y - ny * r2)}`,
    `L ${point(a.x - nx * r1, a.y - ny * r1)}`,
    `Q ${point(a.x - ux * r1, a.y - uy * r1)} ${point(a.x + nx * r1, a.y + ny * r1)} Z`,
  ].join(" "));
}

/** Small rounded cloven hoof; its bottom remains at the solved ground target. */
function setHoof(el: SVGPathElement | null, hoof: Vec) {
  if (!el) return;
  const { x, y } = hoof;
  el.setAttribute("d", `M ${x} ${y} L ${x - 2} ${y} L ${x - 2.5} ${y - 0.7} L ${x - 2.9} ${y} L ${x - 4.1} ${y} Q ${x - 4.8} ${y - 0.8} ${x - 3.8} ${y - 2.3} L ${x - 1} ${y - 3.1} Q ${x + 1.3} ${y - 3.2} ${x + 1.3} ${y - 1.2} Q ${x + 1.3} ${y} ${x} ${y} Z`);
}

/** Per-leg gait configuration. Walk = lateral sequence, trot = diagonal pairs. */
interface LegConfig {
  attachX: number;
  /** Phase offset (fraction of a cycle) in a walk. */
  walkOffset: number;
  /** Phase offset (fraction of a cycle) in a trot. */
  trotOffset: number;
  /** Front legs fold forward (+1), hind legs fold at the hock (-1). */
  pole: 1 | -1;
  idleOffset: number;
}

const LEG_CONFIGS: LegConfig[] = [
  // Order matches the ref arrays / JSX: frontNear, frontFar, backNear, backFar.
  { attachX: FRONT_X, walkOffset: 0.25, trotOffset: 0.0, pole: 1, idleOffset: 1 },
  { attachX: FRONT_X, walkOffset: 0.75, trotOffset: 0.5, pole: 1, idleOffset: -1.5 },
  { attachX: BACK_X, walkOffset: 0.0, trotOffset: 0.5, pole: -1, idleOffset: -1 },
  { attachX: BACK_X, walkOffset: 0.5, trotOffset: 0.0, pole: -1, idleOffset: 1.5 },
];

export default function TypingArcRunner({
  progress,
  wpm,
  active,
  reducedMotion,
}: TypingArcRunnerProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const runnerRef = useRef<SVGGElement | null>(null);
  const bodyRef = useRef<SVGGElement | null>(null);
  const headRef = useRef<SVGGElement | null>(null);
  const tailRef = useRef<SVGGElement | null>(null);
  const eyeRef = useRef<SVGGElement | null>(null);
  const hopRef = useRef<{ t0: number; done: boolean }>({ t0: -1, done: false });

  const upperRefs = useRef<(SVGPathElement | null)[]>([]);
  const lowerRefs = useRef<(SVGPathElement | null)[]>([]);
  const hoofRefs = useRef<(SVGPathElement | null)[]>([]);

  const targetProgressRef = useRef(clampProgress(progress));
  const targetWpmRef = useRef(Math.max(0, wpm));
  const activeRef = useRef(active);
  const displayedProgressRef = useRef(0);
  const smoothedWpmRef = useRef(0);
  const moveBlendRef = useRef(0);
  const phaseRef = useRef(0);
  const lastTargetRef = useRef(clampProgress(progress));
  const lastProgressChangeAtRef = useRef(0);
  // How far the arc's curve sits from its tangent line 26 path-units to
  // either side of the goat (in the goat's rotated frame). Hooves follow
  // this so a planted hoof touches the curve itself, not the tangent line.
  const groundCurveRef = useRef({ plus: 0, minus: 0 });

  // Keep the RAF loop stable while typing. React only updates its targets.
  targetProgressRef.current = clampProgress(progress);
  targetWpmRef.current = clamp(Math.max(0, Number.isFinite(wpm) ? wpm : 0), 0, 160);
  activeRef.current = active;

  /** Places the goat on the arc, rotated to the arc's tangent there. */
  const placeRunner = useCallback((runnerProgress: number) => {
    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;
    const totalLength = path.getTotalLength();
    // Travel is right-to-left: progress 0 sits at the right-hand end.
    const distance = totalLength * (0.985 - 0.97 * clampProgress(runnerProgress));
    const point = path.getPointAtLength(distance);
    const before = path.getPointAtLength(Math.max(0, distance - 10));
    const after = path.getPointAtLength(Math.min(totalLength, distance + 10));
    const slopeDeg = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
    runner.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${slopeDeg.toFixed(2)}) scale(${GOAT_SCALE})`,
    );
    // Measure the curve's deviation from the tangent at +/-26 path units,
    // expressed in the goat's rotated frame, for hoof grounding.
    const slopeRad = (slopeDeg * Math.PI) / 180;
    const cos = Math.cos(slopeRad);
    const sin = Math.sin(slopeRad);
    const deviationAt = (offset: number) => {
      const q = path.getPointAtLength(Math.min(totalLength, Math.max(0, distance + offset)));
      const vx = q.x - point.x;
      const vy = q.y - point.y;
      return -sin * vx + cos * vy;
    };
    groundCurveRef.current = { plus: deviationAt(26), minus: deviationAt(-26) };
  }, []);

  /** Ground height of the curve itself under a hoof at local x. */
  const groundYAt = useCallback((localX: number) => {
    const u = localX * GOAT_SCALE;
    const dev = u >= 0 ? groundCurveRef.current.plus : groundCurveRef.current.minus;
    const t = Math.min(1, Math.abs(u) / 26);
    return (dev * t * t) / GOAT_SCALE;
  }, []);

  /**
   * Draws one goat frame.
   * @param phase gait cycle phase in radians
   * @param move  0 = standing idle, 1 = fully moving (blends every hoof
   *              target so starting/stopping never freezes a hoof mid-air)
   * @param intensity 0..1 speed factor (stride, cadence, rock)
   * @param nowMs clock for idle-only motion (tail sway)
   */
  const applyPose = useCallback(
    (phase: number, move: number, intensity: number, nowMs: number) => {
      const trotBlend = clamp((intensity - 0.28) / 0.34, 0, 1);
      const strideAmp = move * (4.5 + 7.5 * intensity);
      const liftAmp = move * (1.6 + 4 * intensity);

      // Celebration hop when the text is finished: two little jumps,
      // lifting the whole goat (hooves included) off the curve.
      const prog = targetProgressRef.current;
      if (prog >= 0.995 && !hopRef.current.done && hopRef.current.t0 < 0) {
        hopRef.current.t0 = nowMs;
      }
      if (prog < 0.9) {
        hopRef.current.done = false;
        hopRef.current.t0 = -1;
      }
      let hopLift = 0;
      if (hopRef.current.t0 >= 0) {
        const elapsed = nowMs - hopRef.current.t0;
        if (elapsed < 950) {
          hopLift = -Math.abs(Math.sin((elapsed / 950) * Math.PI * 2)) * 6.5;
        } else {
          hopRef.current.t0 = -1;
          hopRef.current.done = true;
        }
      }

      const bounce =
        -move * (0.5 + 1.5 * intensity) * Math.abs(Math.sin(phase)) + hopLift;
      const rockDeg = move * Math.sin(phase) * (0.8 + 3.2 * intensity * intensity);

      if (bodyRef.current) {
        // Idle breathing: a barely-there chest swell while standing.
        const breathe = 1 + (1 - move) * 0.012 * Math.sin(nowMs / 620);
        bodyRef.current.setAttribute(
          "transform",
          `translate(0 ${bounce.toFixed(2)}) rotate(${rockDeg.toFixed(2)} 2 -35) scale(1 ${breathe.toFixed(3)})`,
        );
      }
      // Head: up and eager while running; dips down curiously when idle.
      if (headRef.current) {
        const headBob = move * Math.sin(phase * 2 + 0.6) * 0.7;
        const tilt = lerp(6, -4 - 3 * intensity, move);
        headRef.current.setAttribute(
          "transform",
          `translate(-11 ${(-36 + headBob).toFixed(2)}) rotate(${tilt.toFixed(2)} 0 0)`,
        );
      }
      // Blink: a soft 200ms blink every ~4.3s (ported detail).
      if (eyeRef.current) {
        const bp = nowMs % 4300;
        const blinkAmt =
          bp > 4050 && bp < 4250 ? Math.sin(((bp - 4050) / 200) * Math.PI) : 0;
        const scaleY = 1 - 0.88 * blinkAmt;
        eyeRef.current.setAttribute(
          "transform",
          `translate(-21 -15.2) scale(1 ${scaleY.toFixed(3)}) translate(21 15.2)`,
        );
      }
      // Tail: lazy sway when idle, happy wagging while moving.
      if (tailRef.current) {
        const wag =
          move > 0.05
            ? Math.sin(phase * 2) * (4 + 7 * intensity)
            : Math.sin(nowMs / 700) * 5;
        tailRef.current.setAttribute(
          "transform",
          `translate(14 -43) rotate(${wag.toFixed(2)} 0 0)`,
        );
      }

      LEG_CONFIGS.forEach((cfg, i) => {
        const offset = lerp(cfg.walkOffset, cfg.trotOffset, trotBlend) * Math.PI * 2;
        const legPhase = phase + offset;
        const attach: Vec = { x: cfg.attachX, y: BODY_Y + bounce };
        const hoofX = lerp(
          cfg.attachX + cfg.idleOffset,
          cfg.attachX + FWD * strideAmp * -Math.cos(legPhase),
          move,
        );
        const hoof: Vec = {
          x: hoofX,
          y:
            groundYAt(hoofX) +
            lerp(0, -liftAmp * Math.max(0, Math.sin(legPhase)), move) +
            hopLift,
        };
        const joint = solveJoint(attach, hoof, UPPER_LEG, LOWER_LEG, cfg.pole);
        setLimb(upperRefs.current[i], attach, joint, 4.6, 0.68);
        // End the rounded shank inside the hoof, not below the ground.
        setLimb(lowerRefs.current[i], joint, { x: hoof.x, y: hoof.y - 1.5 }, 3.0, 0.65);
        setHoof(hoofRefs.current[i], hoof);
      });


    },
    [groundYAt],
  );

  // Set the first frame before paint so the goat never flashes on the left
  // before being moved to the right-hand starting point.
  useLayoutEffect(() => {
    const initialProgress = clampProgress(targetProgressRef.current);
    displayedProgressRef.current = initialProgress;
    lastTargetRef.current = initialProgress;
    placeRunner(initialProgress);
    applyPose(0, 0, 0, 0);
  }, [applyPose, placeRunner]);

  // Reduced motion still keeps position synchronized with typing progress,
  // but removes the gait entirely.
  useLayoutEffect(() => {
    if (!reducedMotion) return;
    const next = clampProgress(progress);
    displayedProgressRef.current = next;
    placeRunner(next);
    applyPose(0, 0, 0, 0);
  }, [progress, reducedMotion, applyPose, placeRunner]);

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;
    let lastFrameTime = 0;

    const tick = (now: number) => {
      const target = targetProgressRef.current;

      // When a long passage loops, jump back to the right endpoint
      // intentionally instead of racing backwards across the whole arc.
      if (target < displayedProgressRef.current - 0.55) {
        displayedProgressRef.current = target;
        placeRunner(target);
        frame = requestAnimationFrame(tick);
        return;
      }

      const deltaSeconds = lastFrameTime
        ? Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000))
        : 1 / 60;
      lastFrameTime = now;

      // Exponential smoothing keeps progress fluid between keystrokes.
      const follow = 1 - Math.exp(-deltaSeconds * 18);
      let nextProgress = displayedProgressRef.current + (target - displayedProgressRef.current) * follow;
      if (Math.abs(target - nextProgress) < 0.00035) nextProgress = target;
      displayedProgressRef.current = nextProgress;
      placeRunner(nextProgress);

      /*
       * Speed comes from recent typing, never from a test-long average:
       * - the prop is already a trailing-window WPM from TypingTester;
       * - if progress has not changed for ~650ms the typist has paused,
       *   so the target speed drops to zero no matter what the prop says;
       * - attack is fast (he answers a burst of typing immediately) and
       *   decay is a touch slower (he coasts to a stop instead of freezing).
       */
      if (target !== lastTargetRef.current) {
        lastTargetRef.current = target;
        lastProgressChangeAtRef.current = now;
      }
      const sinceLastKeystroke = now - lastProgressChangeAtRef.current;
      const targetSpeed =
        activeRef.current && sinceLastKeystroke < 650 ? targetWpmRef.current : 0;
      const tau = targetSpeed > smoothedWpmRef.current ? 0.18 : 0.45;
      smoothedWpmRef.current +=
        (targetSpeed - smoothedWpmRef.current) * (1 - Math.exp(-deltaSeconds / tau));
      if (smoothedWpmRef.current < 0.05) smoothedWpmRef.current = 0;
      const speed = smoothedWpmRef.current;

      // Move blend follows speed so stopping plants all four hooves in a
      // standing pose instead of freezing mid-stride.
      const targetMove = clamp(speed / 10, 0, 1);
      moveBlendRef.current +=
        (targetMove - moveBlendRef.current) * (1 - Math.exp(-deltaSeconds / 0.22));
      const move = moveBlendRef.current;
      const intensity = clamp(speed / 95, 0, 1);

      // Cadence rises with speed: a stately walk up to a quick trot/gallop.
      const cadenceHz = 0.85 + 1.75 * intensity;
      if (move > 0.02) {
        phaseRef.current =
          (phaseRef.current + deltaSeconds * Math.PI * 2 * cadenceHz * Math.min(1, speed / 8)) %
          (Math.PI * 2);
      }

      const runner = runnerRef.current;
      if (runner) {
        runner.setAttribute("data-gait", speed < 18 ? "walk" : speed < 42 ? "jog" : "run");
        runner.style.opacity = activeRef.current ? "1" : "0.92";
      }
      applyPose(phaseRef.current, move, intensity, now);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, applyPose, placeRunner]);

  const runnerStyle = { opacity: active ? 1 : 0.92 } as CSSProperties;

  const legEls = (i: number) => (
    <>
      <path
        ref={(el) => {
          upperRefs.current[i] = el;
        }}
        className="focus-arc-runner-limb"
        d="M 0 0 L 0 0"
      />
      <path
        ref={(el) => {
          lowerRefs.current[i] = el;
        }}
        className="focus-arc-runner-limb"
        d="M 0 0 L 0 0"
      />
      <path
        ref={(el) => {
          hoofRefs.current[i] = el;
        }}
        className="focus-arc-runner-dark focus-arc-runner-foot"
        d="M 0 0 Z"
      />
    </>
  );

  return (
    <>
      <path
        ref={pathRef}
        d={FOCUS_ARC_PATH}
        fill="none"
        stroke="none"
        aria-hidden="true"
      />
      <g
        ref={runnerRef}
        className="focus-arc-runner"
        data-running={active ? "true" : "false"}
        data-gait="walk"
        data-reduced-motion={reducedMotion ? "true" : "false"}
        transform={`translate(1507 337) scale(${GOAT_SCALE})`}
        style={runnerStyle}
        aria-hidden="true"
        focusable="false"
      >
        {/* Far-side legs, dimmed for depth. */}
        <g opacity={0.55}>
          {legEls(1)}
          {legEls(3)}
        </g>

        {/* Body, head and tail ride together on the bounce/rock group. */}
        <g ref={bodyRef}>
          {/* A short, upturned goat tail, not a stack of voxel cubes. */}
          <g ref={tailRef} transform="translate(14 -43)">
            <path className="focus-arc-runner-head" d="M -2 4 C 2 2 4 -2 3 -8 C 8 -6 8 1 3 6 Z" />
            <path className="focus-arc-runner-patch" d="M 3 -8 Q 8 -6 6 -1 Q 4 -2 3 -8 Z" />
          </g>
          {/* Rounded ribcage, tucked belly, soft haunch and raised chest.
              The footprint and leg attachment points are unchanged. */}
          <path className="focus-arc-runner-head" d="M -14 -39 C -12 -46 -5 -47 4 -45 C 12 -45 17 -40 17 -34 C 18 -27 12 -22 6 -22 L -5 -22 C -12 -23 -16 -28 -16 -34 Z" />
          <path className="focus-arc-runner-patch" opacity="0.6" d="M -12 -39 C -7 -44 3 -44 10 -41 C 4 -42 -3 -40 -8 -37 Q -11 -35 -12 -39 Z" />
          <path className="focus-arc-runner-shade" opacity="0.34" d="M -12 -28 Q 1 -22 14 -30 Q 11 -21 2 -22 L -5 -22 Q -10 -23 -12 -28 Z" />
          {/* The neck grows into the head instead of a box sitting on a box. */}
          <path className="focus-arc-runner-coat" d="M -15 -25 C -22 -28 -24 -38 -21 -45 Q -18 -50 -13 -47 C -9 -42 -9 -35 -4 -29 Q -8 -24 -15 -25 Z" />
          <path className="focus-arc-runner-patch" opacity="0.4" d="M -21 -42 Q -22 -33 -15 -28 Q -19 -34 -18 -42 Z" />
          {/* Side profile looks along local -x, the direction of travel.
              Retain the mascot's swept horns, leaf ears, muzzle and beard. */}
          <g ref={headRef} transform="translate(-11 -36)">
            {/* The farther horn and ear sit behind the visible cheek. */}
            <path className="focus-arc-runner-horn" opacity="0.65" d="M -9 -23 Q -10 -30 0 -34 Q -4 -29 -4 -22 Z" />
            <path className="focus-arc-runner-shade" d="M -8 -20 Q -1 -26 6 -21 Q 1 -17 -5 -17 Z" />
            {/* Swept-back near horn: one organic curve, not voxel steps. */}
            <path className="focus-arc-runner-patch" d="M -17 -22 Q -19 -31 -5 -34 Q -13 -29 -12 -22 Z" />
            <path className="focus-arc-runner-head" d="M -12 -23 C -19 -25 -24 -22 -25 -16 L -27 -12 Q -32 -10 -30 -6 Q -28 -3 -23 -4 L -19 -1 Q -13 0 -9 -6 Q -6 -11 -6 -17 Q -6 -22 -12 -23 Z" />
            <path className="focus-arc-runner-patch" opacity="0.75" d="M -27 -12 Q -32 -10 -30 -6 Q -27 -3 -23 -4 L -21 -8 Q -24 -11 -27 -12 Z" />
            {/* A small pointed chin tuft makes the silhouette unmistakably goat. */}
            <path className="focus-arc-runner-patch" d="M -23 -4 Q -20 -2 -17 -3 L -20 3 L -20.5 0 L -22 2 Z" />
            <path className="focus-arc-runner-head" d="M -9 -20 Q -2 -25 6 -21 Q 2 -15 -7 -16 Z" />
            <path className="focus-arc-runner-shade" opacity="0.6" d="M -6 -19 Q -1 -22 3 -21 Q 0 -18 -5 -17 Z" />
            <g ref={eyeRef}>
              <ellipse className="focus-arc-runner-dark" cx="-21" cy="-15.2" rx="1.85" ry="2.1" />
              <circle className="focus-arc-runner-eye" cx="-21.65" cy="-15.9" r="0.6" />
            </g>
            <ellipse className="focus-arc-runner-dark" cx="-28.4" cy="-7.9" rx="0.8" ry="0.6" />
            <path className="focus-arc-runner-smile" d="M -28 -5.6 Q -25.8 -4.4 -24 -5.4" />
          </g>
        </g>

        {/* Near-side legs, full strength. */}
        {legEls(0)}
        {legEls(2)}
      </g>
    </>
  );
}
