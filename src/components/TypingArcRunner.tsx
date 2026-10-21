import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

// The arc is inset from the SVG edges so the entire runner stays on-screen.
export const FOCUS_ARC_PATH = "M 70 350 Q 800 -160 1530 350";
export const FOCUS_ARC_FILL_PATH = FOCUS_ARC_PATH + " L 1530 380 L 70 380 Z";

interface TypingArcRunnerProps {
  /** Normalized progress through the current passage/lap, from 0 to 1. */
  progress: number;
  /** Live average typing speed, smoothed again before driving the gait. */
  wpm: number;
  active: boolean;
  reducedMotion: boolean;
}

function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

function placeRunner(
  path: SVGPathElement,
  runner: SVGGElement,
  totalLength: number,
  progress: number,
) {
  // The SVG path is defined left-to-right, but the runner travels right-to-left.
  // Inset both ends so the head, hands, and feet never begin outside the screen.
  const distance = totalLength * (0.99 - 0.98 * clampProgress(progress));
  const point = path.getPointAtLength(distance);
  runner.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
}

function rotateAtJoint(element: SVGGElement | null, degrees: number) {
  if (!element) return;
  element.setAttribute("transform", `rotate(${degrees.toFixed(2)} 0 0)`);
}

export default function TypingArcRunner({
  progress,
  wpm,
  active,
  reducedMotion,
}: TypingArcRunnerProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const runnerRef = useRef<SVGGElement | null>(null);
  const bobRef = useRef<SVGGElement | null>(null);
  const bodyRef = useRef<SVGGElement | null>(null);
  const armBackRef = useRef<SVGGElement | null>(null);
  const armFrontRef = useRef<SVGGElement | null>(null);
  const forearmBackRef = useRef<SVGGElement | null>(null);
  const forearmFrontRef = useRef<SVGGElement | null>(null);
  const thighBackRef = useRef<SVGGElement | null>(null);
  const thighFrontRef = useRef<SVGGElement | null>(null);
  const calfBackRef = useRef<SVGGElement | null>(null);
  const calfFrontRef = useRef<SVGGElement | null>(null);

  const targetProgressRef = useRef(clampProgress(progress));
  const targetWpmRef = useRef(Math.max(0, wpm));
  const activeRef = useRef(active);
  const displayedProgressRef = useRef(0);
  const smoothedWpmRef = useRef(0);
  const phaseRef = useRef(0);

  // Keep the RAF loop stable while typing. React only updates its targets.
  targetProgressRef.current = clampProgress(progress);
  targetWpmRef.current = Math.max(0, Math.min(140, Number.isFinite(wpm) ? wpm : 0));
  activeRef.current = active;

  const resetPose = () => {
    rotateAtJoint(armBackRef.current, 0);
    rotateAtJoint(armFrontRef.current, 0);
    rotateAtJoint(forearmBackRef.current, 0);
    rotateAtJoint(forearmFrontRef.current, 0);
    rotateAtJoint(thighBackRef.current, 0);
    rotateAtJoint(thighFrontRef.current, 0);
    rotateAtJoint(calfBackRef.current, 0);
    rotateAtJoint(calfFrontRef.current, 0);
    if (bobRef.current) bobRef.current.setAttribute("transform", "translate(0 0)");
    if (bodyRef.current) bodyRef.current.setAttribute("transform", "rotate(-3 0 -21)");
  };

  // Set the first frame before paint so the runner never flashes on the left
  // before being moved to the right-hand starting point.
  useLayoutEffect(() => {
    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;
    const totalLength = path.getTotalLength();
    const initialProgress = clampProgress(targetProgressRef.current);
    displayedProgressRef.current = initialProgress;
    placeRunner(path, runner, totalLength, initialProgress);
    resetPose();
  }, []);

  // Reduced motion still keeps position synchronized with typing progress, but
  // removes the gait and spring-follow animation.
  useLayoutEffect(() => {
    if (!reducedMotion) return;
    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;
    const totalLength = path.getTotalLength();
    const next = clampProgress(progress);
    displayedProgressRef.current = next;
    placeRunner(path, runner, totalLength, next);
    resetPose();
  }, [progress, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;

    const totalLength = path.getTotalLength();
    let frame = 0;
    let lastFrameTime = 0;

    const tick = (now: number) => {
      const target = targetProgressRef.current;
      const current = displayedProgressRef.current;

      // When a long passage loops, jump back to the right endpoint intentionally
      // instead of letting the runner race backwards across the whole arc.
      if (target < current - 0.55) {
        runner.style.opacity = "0";
        displayedProgressRef.current = target;
        placeRunner(path, runner, totalLength, target);
        frame = requestAnimationFrame(() => {
          const currentRunner = runnerRef.current;
          if (currentRunner) currentRunner.style.opacity = activeRef.current ? "1" : "0.92";
          lastFrameTime = 0;
          frame = requestAnimationFrame(tick);
        });
        return;
      }

      const deltaSeconds = lastFrameTime
        ? Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000))
        : 1 / 60;
      lastFrameTime = now;

      // Exponential smoothing keeps progress fluid between discrete keystrokes.
      const follow = 1 - Math.exp(-deltaSeconds * 18);
      let nextProgress = current + (target - current) * follow;
      if (Math.abs(target - nextProgress) < 0.00035) nextProgress = target;
      displayedProgressRef.current = nextProgress;
      placeRunner(path, runner, totalLength, nextProgress);

      // Smooth WPM too, so typing bursts don't make the stride twitch or snap
      // between walk/jog/run modes. Cadence and stride length rise continuously.
      const targetWpm = activeRef.current ? targetWpmRef.current : 0;
      const wpmFollow = 1 - Math.exp(-deltaSeconds * 2.8);
      smoothedWpmRef.current += (targetWpm - smoothedWpmRef.current) * wpmFollow;
      const speed = smoothedWpmRef.current;
      const intensity = Math.min(1, speed / 85);
      const cycleSeconds = Math.max(0.32, Math.min(1.15, 1.12 - speed * 0.0097));
      const phase = phaseRef.current;
      const swing = Math.sin(phase);
      const strideDegrees = 14 + intensity * 30;
      const armDegrees = 8 + intensity * 22;
      const kneeDegrees = 8 + intensity * 38;

      runner.setAttribute("data-gait", speed < 18 ? "walk" : speed < 42 ? "jog" : "run");
      runner.style.opacity = activeRef.current ? "1" : "0.92";

      if (activeRef.current && speed > 1.2) {
        // Opposing arm/leg swings and articulated knees create a true running
        // cycle. Upper limbs rotate at their shoulder/hip; lower limbs rotate
        // around translated knee/elbow pivots instead of flailing from mid-air.
        rotateAtJoint(thighFrontRef.current, swing * strideDegrees);
        rotateAtJoint(thighBackRef.current, -swing * strideDegrees);
        rotateAtJoint(calfFrontRef.current, -Math.max(0, swing) * kneeDegrees);
        rotateAtJoint(calfBackRef.current, Math.max(0, -swing) * kneeDegrees);

        rotateAtJoint(armFrontRef.current, -swing * armDegrees);
        rotateAtJoint(armBackRef.current, swing * armDegrees);
        rotateAtJoint(forearmFrontRef.current, -14 - Math.max(0, -swing) * 22);
        rotateAtJoint(forearmBackRef.current, -14 + Math.max(0, swing) * 22);

        const bounce = Math.max(0, Math.sin(phase * 2)) * (0.25 + intensity * 1.5);
        if (bobRef.current) bobRef.current.setAttribute("transform", `translate(0 ${(-bounce).toFixed(2)})`);
        if (bodyRef.current) {
          bodyRef.current.setAttribute("transform", `rotate(${(-3 - intensity * 5).toFixed(2)} 0 -21)`);
        }
        phaseRef.current = (phase + (deltaSeconds * Math.PI * 2) / cycleSeconds) % (Math.PI * 2);
      } else {
        resetPose();
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const runnerStyle = { opacity: active ? 1 : 0.92 } as CSSProperties;

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
        transform="translate(1530 350)"
        style={runnerStyle}
        aria-hidden="true"
        focusable="false"
      >
        <g ref={bobRef} className="focus-arc-runner-bob">
          <g ref={bodyRef} className="focus-arc-runner-body" transform="rotate(-3 0 -21)">
            {/* Trails sit behind the runner in the direction he came from (right). */}
            <g className="focus-arc-runner-trail" fill="none" stroke="var(--app-accent)" strokeWidth="2.4" strokeLinecap="round">
              <path d="M 20 -27 H 31" />
              <path d="M 24 -20 H 37" />
              <path d="M 20 -13 H 30" />
            </g>

            {/* Back arm: bent at the elbow and pumped opposite the front leg. */}
            <g transform="translate(-1 -35)">
              <g ref={armBackRef}>
                <path className="focus-arc-runner-outline" d="M 0 0 L -4 7" />
                <g transform="translate(-4 7)">
                  <g ref={forearmBackRef}>
                    <path className="focus-arc-runner-outline" d="M 0 0 L -2 5 L 0 8" />
                    <circle cx="0" cy="8" r="1.8" className="focus-arc-runner-joint" />
                  </g>
                </g>
              </g>
            </g>

            {/* Back leg with a separate knee pivot. */}
            <g transform="translate(-1 -21)">
              <g ref={thighBackRef}>
                <path className="focus-arc-runner-outline" d="M 0 0 L -4 10" />
                <circle cx="-4" cy="10" r="1.7" className="focus-arc-runner-joint" />
                <g transform="translate(-4 10)">
                  <g ref={calfBackRef}>
                    <path className="focus-arc-runner-outline" d="M 0 0 L -2 9 L -7 10" />
                    <path className="focus-arc-runner-outline focus-arc-runner-foot" d="M -6 10 L -12 10" />
                  </g>
                </g>
              </g>
            </g>

            <path className="focus-arc-runner-outline focus-arc-runner-torso" d="M -1 -37 L 0 -21" />

            {/* Front leg. The bent calf follows the moving thigh at the knee. */}
            <g transform="translate(1 -21)">
              <g ref={thighFrontRef}>
                <path className="focus-arc-runner-outline" d="M 0 0 L 4 10" />
                <circle cx="4" cy="10" r="1.7" className="focus-arc-runner-joint" />
                <g transform="translate(4 10)">
                  <g ref={calfFrontRef}>
                    <path className="focus-arc-runner-outline" d="M 0 0 L 1 9 L 6 10" />
                    <path className="focus-arc-runner-outline focus-arc-runner-foot" d="M 5 10 L 11 10" />
                  </g>
                </g>
              </g>
            </g>

            {/* Front arm: a distinct elbow bend keeps the silhouette athletic. */}
            <g transform="translate(1 -35)">
              <g ref={armFrontRef}>
                <path className="focus-arc-runner-outline" d="M 0 0 L 4 7" />
                <g transform="translate(4 7)">
                  <g ref={forearmFrontRef}>
                    <path className="focus-arc-runner-outline" d="M 0 0 L 2 5 L 4 7" />
                    <circle cx="4" cy="7" r="1.8" className="focus-arc-runner-joint" />
                  </g>
                </g>
              </g>
            </g>

            <circle className="focus-arc-runner-head-glow" cx="0" cy="-48" r="12.5" />
            <circle className="focus-arc-runner-head" cx="0" cy="-48" r="9.5" />
            {/* Side-facing profile, looking left along the direction of travel.
                No smile or front-facing expression. */}
            <ellipse className="focus-arc-runner-eye" cx="-3.8" cy="-49.5" rx="1.05" ry="1.6" />
          </g>
        </g>
      </g>
    </>
  );
}
