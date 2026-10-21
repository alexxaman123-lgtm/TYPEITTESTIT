import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";

export const FOCUS_ARC_PATH = "M -50 350 Q 800 -160 1650 350";
export const FOCUS_ARC_FILL_PATH = FOCUS_ARC_PATH + " L 1650 380 L -50 380 Z";

interface TypingArcRunnerProps {
  /** Normalized position along one passage/lap, from 0 to 1. */
  progress: number;
  /** Smoothed display WPM used only to choose the runner's gait. */
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
  // Keep a small inset so the mascot stays fully visible at either end.
  const distance = totalLength * (0.035 + 0.93 * clampProgress(progress));
  const point = path.getPointAtLength(distance);
  runner.setAttribute(
    "transform",
    "translate(" + point.x.toFixed(2) + " " + point.y.toFixed(2) + ")",
  );
}

export default function TypingArcRunner({
  progress,
  wpm,
  active,
  reducedMotion,
}: TypingArcRunnerProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const runnerRef = useRef<SVGGElement | null>(null);
  const targetProgressRef = useRef(clampProgress(progress));
  const displayedProgressRef = useRef(0);
  const activeRef = useRef(active);

  // Keep the animation loop stable between keystrokes; only its target changes.
  targetProgressRef.current = clampProgress(progress);
  activeRef.current = active;

  const gait = wpm < 18 ? "walk" : wpm < 42 ? "jog" : "run";
  const strideDuration = wpm < 18 ? 1.05 : wpm < 42 ? 0.72 : wpm < 70 ? 0.48 : 0.34;
  const runnerStyle = {
    "--runner-stride-duration": strideDuration + "s",
    opacity: active ? 1 : 0.92,
  } as CSSProperties;

  // Respect reduced-motion immediately: position still reflects typing progress,
  // but no spring-following loop or limb animation is run.
  useLayoutEffect(() => {
    if (!reducedMotion) return;
    const path = pathRef.current;
    const runner = runnerRef.current;
    if (!path || !runner) return;
    const totalLength = path.getTotalLength();
    const next = clampProgress(progress);
    placeRunner(path, runner, totalLength, next);
    displayedProgressRef.current = next;
  }, [progress, reducedMotion]);

  // A small damped follow keeps the character moving continuously between
  // discrete keystrokes. If a lap wraps, fade out for one frame before resetting
  // to the arc's start instead of visibly running backwards across the screen.
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
      const follow = 1 - Math.exp(-deltaSeconds * 18);
      let next = current + (target - current) * follow;
      if (Math.abs(target - next) < 0.00035) next = target;

      displayedProgressRef.current = next;
      placeRunner(path, runner, totalLength, next);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

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
        data-gait={gait}
        data-reduced-motion={reducedMotion ? "true" : "false"}
        transform="translate(-50 350)"
        style={runnerStyle}
        aria-hidden="true"
        focusable="false"
      >
        <g className="focus-arc-runner-bob">
          <g className="focus-arc-runner-trail" fill="none" stroke="var(--app-accent)" strokeWidth="2.4" strokeLinecap="round">
            <path d="M -29 -27 H -18" />
            <path d="M -34 -20 H -21" />
            <path d="M -27 -13 H -18" />
          </g>

          <g className="focus-arc-runner-limb focus-arc-runner-arm focus-arc-runner-arm-back" transform="translate(0 -35)">
            <path className="focus-arc-runner-outline" d="M 0 0 L -7 7 L -9 15" />
          </g>
          <g className="focus-arc-runner-limb focus-arc-runner-arm focus-arc-runner-arm-front" transform="translate(0 -35)">
            <path className="focus-arc-runner-outline" d="M 0 0 L 7 7 L 10 14" />
          </g>

          <g className="focus-arc-runner-limb focus-arc-runner-leg focus-arc-runner-leg-back" transform="translate(0 -21)">
            <path className="focus-arc-runner-outline" d="M 0 0 L -6 8 L -10 21" />
          </g>
          <g className="focus-arc-runner-limb focus-arc-runner-leg focus-arc-runner-leg-front" transform="translate(0 -21)">
            <path className="focus-arc-runner-outline" d="M 0 0 L 6 8 L 10 21" />
          </g>

          <path className="focus-arc-runner-outline focus-arc-runner-torso" d="M 0 -37 L 0 -21" />

          <circle className="focus-arc-runner-head-glow" cx="0" cy="-48" r="13" />
          <circle className="focus-arc-runner-head" cx="0" cy="-48" r="9.5" />
          <g className="focus-arc-runner-face">
            <circle cx="-3.2" cy="-50" r="1.05" fill="var(--app-on-primary, #fff)" stroke="none" />
            <circle cx="3.2" cy="-50" r="1.05" fill="var(--app-on-primary, #fff)" stroke="none" />
            <path d="M -4 -46 Q 0 -42 4 -46" />
          </g>
        </g>
      </g>
    </>
  );
}
