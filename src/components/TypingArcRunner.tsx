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
 * Procedural stick-runner skeleton.
 *
 * The figure is drawn facing LEFT (the direction of travel along the arc):
 * forward is local -x, the ground is local y = 0, and up is local -y.
 * Feet are placed from a run-cycle trajectory and the knees/elbows are
 * solved with two-bone IK every frame, so a foot is genuinely planted on
 * the arc during its stance phase instead of the whole figure hovering or
 * "flying" on a fixed bob. The whole runner is rotated to the arc's local
 * tangent so the feet stay flush with the slope at the steep ends.
 */
const FWD = -1;
const THIGH = 23;
const CALF = 23;
const HIP_HEIGHT = 43; // < THIGH + CALF, so the knees always keep a slight bend
const TORSO = 25;
const HEAD_R = 8.5;
const HEAD_LIFT = 11; // shoulder -> head centre distance along the torso line
const UPPER_ARM = 15;
const FOREARM = 14.5;
const RUNNER_SCALE = 1.18;

interface Vec {
  x: number;
  y: number;
}

/** Two-bone IK: returns the joint (knee/elbow) for start -> target. */
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
  // Perpendicular (rotated +90deg in screen space). With poleSign +1 the
  // knees land on the forward side of the hip->foot line; elbows use -1 so
  // they bend backwards, the way a runner's arms actually fold.
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

function setPoint(el: SVGCircleElement | SVGEllipseElement | null, p: Vec) {
  if (!el) return;
  el.setAttribute("cx", p.x.toFixed(2));
  el.setAttribute("cy", p.y.toFixed(2));
}

export default function TypingArcRunner({
  progress,
  wpm,
  active,
  reducedMotion,
}: TypingArcRunnerProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const runnerRef = useRef<SVGGElement | null>(null);

  const torsoRef = useRef<SVGLineElement | null>(null);
  const thighFrontRef = useRef<SVGLineElement | null>(null);
  const calfFrontRef = useRef<SVGLineElement | null>(null);
  const thighBackRef = useRef<SVGLineElement | null>(null);
  const calfBackRef = useRef<SVGLineElement | null>(null);
  const upperArmFrontRef = useRef<SVGLineElement | null>(null);
  const forearmFrontRef = useRef<SVGLineElement | null>(null);
  const upperArmBackRef = useRef<SVGLineElement | null>(null);
  const forearmBackRef = useRef<SVGLineElement | null>(null);
  const footFrontRef = useRef<SVGLineElement | null>(null);
  const footBackRef = useRef<SVGLineElement | null>(null);
  const kneeFrontRef = useRef<SVGCircleElement | null>(null);
  const kneeBackRef = useRef<SVGCircleElement | null>(null);
  const elbowFrontRef = useRef<SVGCircleElement | null>(null);
  const elbowBackRef = useRef<SVGCircleElement | null>(null);
  const handFrontRef = useRef<SVGCircleElement | null>(null);
  const handBackRef = useRef<SVGCircleElement | null>(null);
  const headRef = useRef<SVGCircleElement | null>(null);
  const headGlowRef = useRef<SVGCircleElement | null>(null);
  const eyeRef = useRef<SVGEllipseElement | null>(null);
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
  // either side of the runner (in the runner's rotated frame). Feet follow
  // this so a planted foot touches the curve itself, not the tangent line
  // floating above/below it — most visible at the steep ends of the arc.
  const groundCurveRef = useRef({ plus: 0, minus: 0 });

  // Keep the RAF loop stable while typing. React only updates its targets.
  targetProgressRef.current = clampProgress(progress);
  targetWpmRef.current = clamp(Math.max(0, Number.isFinite(wpm) ? wpm : 0), 0, 160);
  activeRef.current = active;

  /** Places the runner on the arc, rotated to the arc's tangent there. */
  const placeRunner = useCallback((runnerProgress: number) => {
    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;
    const totalLength = path.getTotalLength();
    // Travel is right-to-left: progress 0 sits at the right-hand end.
    const distance = totalLength * (0.985 - 0.97 * clampProgress(runnerProgress));
    const point = path.getPointAtLength(distance);
    // Tangent of the ground line (path direction), used only as a slope:
    // the figure faces left natively, so we rotate by the slope angle and
    // never flip him upside down.
    const before = path.getPointAtLength(Math.max(0, distance - 10));
    const after = path.getPointAtLength(Math.min(totalLength, distance + 10));
    const slopeDeg = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
    runner.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${slopeDeg.toFixed(2)}) scale(${RUNNER_SCALE})`,
    );
    // Measure the curve's deviation from the tangent at +/-26 path units,
    // expressed in the runner's rotated frame, for the foot-grounding above.
    const slopeRad = (slopeDeg * Math.PI) / 180;
    const cos = Math.cos(slopeRad);
    const sin = Math.sin(slopeRad);
    const deviationAt = (offset: number) => {
      const q = path.getPointAtLength(Math.min(totalLength, Math.max(0, distance + offset)));
      const vx = q.x - point.x;
      const vy = q.y - point.y;
      return -sin * vx + cos * vy; // y of the curve point in the rotated frame
    };
    groundCurveRef.current = { plus: deviationAt(26), minus: deviationAt(-26) };
  }, []);

  /**
   * Draws one skeleton frame.
   * @param phase run-cycle phase in radians
   * @param move  0 = standing idle, 1 = fully running (blends every joint
   *              target, so starting and stopping never snap or freeze a
   *              foot in mid-air)
   * @param intensity 0..1 speed factor (stride, lean, cadence, trails)
   */
  const applyPose = useCallback((phase: number, move: number, intensity: number) => {
    const strideAmp = move * (7 + 14 * intensity);
    const liftAmp = move * (2.5 + 6.5 * intensity);
    const armAmp = move * (5 + 9 * intensity);
    const bob = -move * (0.6 + 1.7 * intensity) * Math.abs(Math.sin(phase));
    const leanRad = ((2 + move * (4 + 9 * intensity)) * Math.PI) / 180;

    const hip: Vec = { x: 0, y: -HIP_HEIGHT + bob };
    const torsoDir: Vec = { x: FWD * Math.sin(leanRad), y: -Math.cos(leanRad) };
    const shoulder: Vec = {
      x: hip.x + torsoDir.x * TORSO,
      y: hip.y + torsoDir.y * TORSO,
    };
    const head: Vec = {
      x: shoulder.x + torsoDir.x * HEAD_LIFT + FWD * 1.1,
      y: shoulder.y + torsoDir.y * HEAD_LIFT,
    };

    setLine(torsoRef.current, hip, shoulder);
    setPoint(headGlowRef.current, head);
    setPoint(headRef.current, head);
    if (eyeRef.current) {
      eyeRef.current.setAttribute("cx", (head.x + FWD * HEAD_R * 0.42).toFixed(2));
      eyeRef.current.setAttribute("cy", (head.y - 1.4).toFixed(2));
    }

    // Legs: front leg runs at `phase`, back leg half a cycle later.
    const legs = [
      {
        phase,
        idleOffset: 4,
        thigh: thighFrontRef.current,
        calf: calfFrontRef.current,
        foot: footFrontRef.current,
        knee: kneeFrontRef.current,
      },
      {
        phase: phase + Math.PI,
        idleOffset: -4,
        thigh: thighBackRef.current,
        calf: calfBackRef.current,
        foot: footBackRef.current,
        knee: kneeBackRef.current,
      },
    ];
    for (const leg of legs) {
      // Run-cycle foot path: swings forward through the air for half the
      // cycle (sin > 0 lifts it), then plants and pushes back along the
      // ground for the other half (y stays exactly 0 = on the arc).
      const footX = lerp(FWD * leg.idleOffset, FWD * strideAmp * -Math.cos(leg.phase), move);
      // Ground height of the curve itself under this foot (see
      // groundCurveRef): on the steep ends the arc bends away from its
      // tangent, and a foot planted at y=0 would hover off the line.
      const u = footX * RUNNER_SCALE;
      const dev = u >= 0 ? groundCurveRef.current.plus : groundCurveRef.current.minus;
      const tt = Math.min(1, Math.abs(u) / 26);
      const groundY = (dev * tt * tt) / RUNNER_SCALE;
      const foot: Vec = {
        x: footX,
        y: groundY + lerp(0, -liftAmp * Math.max(0, Math.sin(leg.phase)), move),
      };
      const knee = solveJoint(hip, foot, THIGH, CALF, 1);
      setLine(leg.thigh, hip, knee);
      setLine(leg.calf, knee, foot);
      setLine(leg.foot, foot, { x: foot.x + FWD * 5.5, y: foot.y });
      setPoint(leg.knee, knee);
    }

    // Arms swing opposite to the leg on the same side.
    const arms = [
      {
        phase: phase + Math.PI,
        upper: upperArmFrontRef.current,
        fore: forearmFrontRef.current,
        elbow: elbowFrontRef.current,
        hand: handFrontRef.current,
      },
      {
        phase,
        upper: upperArmBackRef.current,
        fore: forearmBackRef.current,
        elbow: elbowBackRef.current,
        hand: handBackRef.current,
      },
    ];
    for (const arm of arms) {
      const gaitHand: Vec = {
        x: shoulder.x + FWD * armAmp * -Math.cos(arm.phase) + FWD * 2,
        y: shoulder.y + 16.5 - move * 2.5 * Math.max(0, Math.sin(arm.phase)),
      };
      const hand: Vec = {
        x: lerp(shoulder.x + FWD * 1.5, gaitHand.x, move),
        y: lerp(shoulder.y + 18, gaitHand.y, move),
      };
      const elbow = solveJoint(shoulder, hand, UPPER_ARM, FOREARM, -1);
      setLine(arm.upper, shoulder, elbow);
      setLine(arm.fore, elbow, hand);
      setPoint(arm.elbow, elbow);
      setPoint(arm.hand, hand);
    }

    // Speed trails stream behind him (local +x, opposite the facing).
    trailRefs.current.forEach((trail, i) => {
      if (!trail) return;
      const y = shoulder.y + 3 + i * 6.5;
      const x1 = shoulder.x - FWD * 7.5;
      const len = (9 + 17 * intensity) * (1 - i * 0.22);
      trail.setAttribute("d", `M ${x1.toFixed(2)} ${y.toFixed(2)} H ${(x1 - FWD * len).toFixed(2)}`);
      trail.style.opacity = (0.55 * intensity * move).toFixed(2);
    });
  }, []);

  // Set the first frame before paint so the runner never flashes on the left
  // before being moved to the right-hand starting point.
  useLayoutEffect(() => {
    const initialProgress = clampProgress(targetProgressRef.current);
    displayedProgressRef.current = initialProgress;
    lastTargetRef.current = initialProgress;
    placeRunner(initialProgress);
    applyPose(0, 0, 0);
  }, [applyPose, placeRunner]);

  // Reduced motion still keeps position synchronized with typing progress,
  // but removes the gait entirely.
  useLayoutEffect(() => {
    if (!reducedMotion) return;
    const next = clampProgress(progress);
    displayedProgressRef.current = next;
    placeRunner(next);
    applyPose(0, 0, 0);
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

      // Move blend follows speed so stopping plants both feet in an idle
      // stance instead of freezing mid-stride.
      const targetMove = clamp(speed / 10, 0, 1);
      moveBlendRef.current +=
        (targetMove - moveBlendRef.current) * (1 - Math.exp(-deltaSeconds / 0.22));
      const move = moveBlendRef.current;
      const intensity = clamp(speed / 95, 0, 1);

      // Cadence rises continuously with speed: ~1 cycle/s at a slow jog,
      // ~3 cycles/s at a sprint. Phase only advances while he is moving.
      const cadenceHz = 1.0 + 2.0 * intensity;
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
      applyPose(phaseRef.current, move, intensity);

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion, applyPose, placeRunner]);

  const runnerStyle = { opacity: active ? 1 : 0.92 } as CSSProperties;
  const limbClass = "focus-arc-runner-outline";

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
        transform={`translate(1507 337) scale(${RUNNER_SCALE})`}
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

        {/* Back arm and back leg (far side of the body). */}
        <line ref={upperArmBackRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={forearmBackRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={thighBackRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={calfBackRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={footBackRef} className={`${limbClass} focus-arc-runner-foot`} x1="0" y1="0" x2="0" y2="0" />
        <circle ref={kneeBackRef} className="focus-arc-runner-joint" r="1.7" cx="0" cy="0" />
        <circle ref={elbowBackRef} className="focus-arc-runner-joint" r="1.7" cx="0" cy="0" />
        <circle ref={handBackRef} className="focus-arc-runner-joint" r="1.8" cx="0" cy="0" />

        {/* Torso and head. */}
        <line ref={torsoRef} className={`${limbClass} focus-arc-runner-torso`} x1="0" y1="0" x2="0" y2="0" />
        <circle ref={headGlowRef} className="focus-arc-runner-head-glow" r={HEAD_R + 3} cx="0" cy="0" />
        <circle ref={headRef} className="focus-arc-runner-head" r={HEAD_R} cx="0" cy="0" />
        {/* Side-facing profile, looking left along the direction of travel. */}
        <ellipse ref={eyeRef} className="focus-arc-runner-eye" rx="1.05" ry="1.6" cx="0" cy="0" />

        {/* Front leg and front arm (near side of the body). */}
        <line ref={thighFrontRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={calfFrontRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={footFrontRef} className={`${limbClass} focus-arc-runner-foot`} x1="0" y1="0" x2="0" y2="0" />
        <line ref={upperArmFrontRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <line ref={forearmFrontRef} className={limbClass} x1="0" y1="0" x2="0" y2="0" />
        <circle ref={kneeFrontRef} className="focus-arc-runner-joint" r="1.7" cx="0" cy="0" />
        <circle ref={elbowFrontRef} className="focus-arc-runner-joint" r="1.7" cx="0" cy="0" />
        <circle ref={handFrontRef} className="focus-arc-runner-joint" r="1.8" cx="0" cy="0" />
      </g>
    </>
  );
}
