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
 * Procedural chibi goat — the GOATTYPE mascot on the focus-mode arc.
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

function setLine(el: SVGLineElement | null, a: Vec, b: Vec) {
  if (!el) return;
  el.setAttribute("x1", a.x.toFixed(2));
  el.setAttribute("y1", a.y.toFixed(2));
  el.setAttribute("x2", b.x.toFixed(2));
  el.setAttribute("y2", b.y.toFixed(2));
}

function setPoint(el: SVGCircleElement | null, p: Vec) {
  if (!el) return;
  el.setAttribute("cx", p.x.toFixed(2));
  el.setAttribute("cy", p.y.toFixed(2));
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

  const upperRefs = useRef<(SVGLineElement | null)[]>([]);
  const lowerRefs = useRef<(SVGLineElement | null)[]>([]);
  const hoofRefs = useRef<(SVGLineElement | null)[]>([]);
  const jointRefs = useRef<(SVGCircleElement | null)[]>([]);
  const trailRefs = useRef<(SVGPathElement | null)[]>([]);

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
   * @param intensity 0..1 speed factor (stride, cadence, rock, trails)
   * @param nowMs clock for idle-only motion (tail sway)
   */
  const applyPose = useCallback(
    (phase: number, move: number, intensity: number, nowMs: number) => {
      const trotBlend = clamp((intensity - 0.28) / 0.34, 0, 1);
      const strideAmp = move * (4.5 + 7.5 * intensity);
      const liftAmp = move * (1.6 + 4 * intensity);
      const bounce = -move * (0.5 + 1.5 * intensity) * Math.abs(Math.sin(phase));
      const rockDeg = move * Math.sin(phase) * (0.8 + 3.2 * intensity * intensity);

      if (bodyRef.current) {
        bodyRef.current.setAttribute(
          "transform",
          `translate(0 ${bounce.toFixed(2)}) rotate(${rockDeg.toFixed(2)} 2 -35)`,
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
      // Tail: lazy sway when idle, happy wagging while moving.
      if (tailRef.current) {
        const wag =
          move > 0.05
            ? Math.sin(phase * 2) * (4 + 7 * intensity)
            : Math.sin(nowMs / 700) * 5;
        tailRef.current.setAttribute(
          "transform",
          `translate(13 -40) rotate(${wag.toFixed(2)} 0 0)`,
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
          y: groundYAt(hoofX) + lerp(0, -liftAmp * Math.max(0, Math.sin(legPhase)), move),
        };
        const joint = solveJoint(attach, hoof, UPPER_LEG, LOWER_LEG, cfg.pole);
        setLine(upperRefs.current[i], attach, joint);
        setLine(lowerRefs.current[i], joint, hoof);
        setLine(hoofRefs.current[i], hoof, { x: hoof.x + FWD * 3.4, y: hoof.y });
        setPoint(jointRefs.current[i], joint);
      });

      // Speed trails stream behind him (local +x, opposite the facing).
      trailRefs.current.forEach((trail, i) => {
        if (!trail) return;
        const y = -36 + bounce + i * 6.5;
        const x1 = 17;
        const len = (8 + 15 * intensity) * (1 - i * 0.22);
        trail.setAttribute("d", `M ${x1} ${y.toFixed(2)} H ${(x1 + len).toFixed(2)}`);
        trail.style.opacity = (0.5 * intensity * move).toFixed(2);
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
  const limbClass = "focus-arc-runner-outline";

  const legEls = (i: number) => (
    <>
      <line
        ref={(el) => {
          upperRefs.current[i] = el;
        }}
        className={limbClass}
        style={{ strokeWidth: 4.2 }}
        x1="0"
        y1="0"
        x2="0"
        y2="0"
      />
      <line
        ref={(el) => {
          lowerRefs.current[i] = el;
        }}
        className={limbClass}
        style={{ strokeWidth: 4.2 }}
        x1="0"
        y1="0"
        x2="0"
        y2="0"
      />
      <line
        ref={(el) => {
          hoofRefs.current[i] = el;
        }}
        className={`${limbClass} focus-arc-runner-foot`}
        style={{ strokeWidth: 4.4 }}
        x1="0"
        y1="0"
        x2="0"
        y2="0"
      />
      <circle
        ref={(el) => {
          jointRefs.current[i] = el;
        }}
        className="focus-arc-runner-joint"
        r="1.5"
        cx="0"
        cy="0"
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
        {/* Speed trails, streamed behind him. */}
        <g fill="none" stroke="var(--app-accent)" strokeWidth="2.4" strokeLinecap="round">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              ref={(el) => {
                trailRefs.current[i] = el;
              }}
              d="M 0 0 H 10"
              style={{ opacity: 0 }}
            />
          ))}
        </g>

        {/* Far-side legs, dimmed for depth. */}
        <g opacity={0.55}>
          {legEls(1)}
          {legEls(3)}
        </g>

        {/* Body, head and tail ride together on the bounce/rock group. */}
        <g ref={bodyRef}>
          {/* Tail at the rear (+x): a short curly upright wag. */}
          <g ref={tailRef} transform="translate(13 -40)">
            <path
              className={limbClass}
              style={{ strokeWidth: 3.4 }}
              d="M 0 0 Q 7 -1 8 -8 Q 8.5 -12.5 5.5 -15.5"
              fill="none"
            />
          </g>
          {/* Short, round chibi body — the head does the talking. */}
          <path
            className="focus-arc-runner-head"
            d="M -13 -33 Q -14 -44.5 -3 -45.5 L 5 -45.5 Q 14 -44.5 13.5 -34 Q 13 -23.5 4 -22.5 L -5 -22.5 Q -13 -23.5 -13 -33 Z"
          />
          {/* Head group pivots at the neck (-11, -36). The head is
              deliberately oversized (r=13 vs the body's 27 length) — at
              mascot size the silhouette has to read as a goat instantly. */}
          <g ref={headRef} transform="translate(-11 -36)">
            <g transform="translate(-9 -5)">
              {/* Horns: two big curved sweeps, thick enough to survive
                  being rendered small. */}
              <path
                className={limbClass}
                style={{ strokeWidth: 3.2 }}
                d="M 0 -12 Q -8 -19 -4 -26"
                fill="none"
              />
              <path
                className={limbClass}
                style={{ strokeWidth: 3.2 }}
                d="M 5.5 -12.5 Q -0.5 -20.5 4.5 -27"
                fill="none"
              />
              {/* Big floppy ear sticking out behind the head. */}
              <ellipse
                className="focus-arc-runner-head"
                cx="10.5"
                cy="-6"
                rx="6.5"
                ry="3"
                transform="rotate(45 10.5 -6)"
              />
              <circle className="focus-arc-runner-head-glow" r="16.5" cx="0" cy="0" />
              <circle className="focus-arc-runner-head" r="13" cx="0" cy="0" />
              {/* Muzzle bump on the front of the face. */}
              <ellipse className="focus-arc-runner-head" cx="-11.5" cy="3.5" rx="4.2" ry="3.1" />
              {/* Beard tuft hanging under the chin. */}
              <path
                className="focus-arc-runner-head"
                d="M -10 8 L -11.5 15.5 L -5.5 10.5 Z"
              />
              {/* Eye: side-facing, looking along the direction of travel. */}
              <ellipse className="focus-arc-runner-eye" rx="1.9" ry="2.6" cx="-5.5" cy="-2" />
            </g>
          </g>
        </g>

        {/* Near-side legs, full strength. */}
        {legEls(0)}
        {legEls(2)}
      </g>
    </>
  );
}
