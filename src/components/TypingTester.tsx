import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTypingTest } from "../lib/useTypingTest";
import { useReducedMotion } from "../lib/useReducedMotion";
import { getPreferences, savePreferences } from "../lib/storage";
import { getProfileBest } from "../lib/leaderboard";
import {
  playSoundSample,
  playTestCompleteSound,
  preloadSoundSamples,
} from "../lib/useTypingSounds";
import { getSoundEnabled } from "../lib/useSound";
import DifficultySelector from "./DifficultySelector";
import DurationSelector from "./DurationSelector";
import TypingText from "./TypingText";
import TypingLanguageSelector from "./TypingLanguageSelector";
import LiveMetrics from "./LiveMetrics";
import TestControls from "./TestControls";
import ResultPanel from "./ResultPanel";
import CustomTextPanel from "./CustomTextPanel";
import { cn } from "../utils/cn";
import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

type ViewMode = "test" | "custom";
type PersonalBest = { wpm: number; accuracy: number } | null;
type FocusOrigin = { left: number; top: number; width: number; height: number };
const SLOW_GOAT_WPM_THRESHOLD = 30;
const SLOW_GOAT_SOUND = "/fahhh_KcgAXfs.mp3";
const AVERAGE_GOAT_MIN_WPM = 32;
const AVERAGE_GOAT_MAX_WPM = 47;
const AVERAGE_GOAT_SOUND = "/vine-boom.mp3";
const AVERAGE_GOAT_SOUND_VOLUME = 1;
const GOAT_TALKS_MIN_WPM = 48;
const GOAT_TALKS_MAX_WPM = 59;
const GOAT_TALKS_SOUND = "/rizz-sound-effect.mp3";
const GOAT_TALKS_SOUND_VOLUME = 1;
const RESULT_SOUND_SAMPLES = [
  SLOW_GOAT_SOUND,
  AVERAGE_GOAT_SOUND,
  GOAT_TALKS_SOUND,
] as const;
const MINIMUM_RESULT_DURATION_MS = 60000;
const FOCUS_TRANSITION_MS = 760;
const FOCUS_TRANSITION_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function TypingTester({ locale = "en" }: { locale?: Locale }) {
  const prefs = useMemo(() => getPreferences(), []);
  const reducedMotion = useReducedMotion();
  const test = useTypingTest(prefs.difficulty, prefs.duration, locale);
  const [viewMode, setViewMode] = useState<ViewMode>("test");
  const [personalBest, setPersonalBest] = useState<PersonalBest>(null);
  const [focusMode, setFocusMode] = useState(false);
  const previousStatusRef = useRef(test.status);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const focusOriginRef = useRef<FocusOrigin | null>(null);
  const focusAnimationRef = useRef<Animation | null>(null);
  const scrollToTesterAfterExitRef = useRef(false);
  const focusExitRequestedRef = useRef(false);
  const bodyOverflowBeforeFocusRef = useRef<string | null>(null);

  useEffect(() => {
    preloadSoundSamples(RESULT_SOUND_SAMPLES);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (test.isCustom) {
        setPersonalBest(null);
        return;
      }
      const best = await getProfileBest(test.difficulty, test.duration);
      if (!cancelled) setPersonalBest(best);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [test.difficulty, test.duration, test.isCustom, test.status]);

  useEffect(() => {
    const previous = previousStatusRef.current;
    previousStatusRef.current = test.status;
    if (test.status === "idle") {
      focusExitRequestedRef.current = false;
      setFocusMode(false);
    } else if (
      previous !== "running" &&
      test.status === "running" &&
      !focusExitRequestedRef.current
    ) {
      setFocusMode(true);
    }

    if (previous === "running" && test.status === "finished") {
      const finalWpm = test.result?.wpm ?? 0;
      if (!getSoundEnabled() || test.elapsedMs < MINIMUM_RESULT_DURATION_MS) return;
      if (finalWpm < SLOW_GOAT_WPM_THRESHOLD) playSoundSample(SLOW_GOAT_SOUND, 0.5);
      else if (finalWpm >= AVERAGE_GOAT_MIN_WPM && finalWpm <= AVERAGE_GOAT_MAX_WPM) playSoundSample(AVERAGE_GOAT_SOUND, AVERAGE_GOAT_SOUND_VOLUME);
      else if (finalWpm >= GOAT_TALKS_MIN_WPM && finalWpm <= GOAT_TALKS_MAX_WPM) playSoundSample(GOAT_TALKS_SOUND, GOAT_TALKS_SOUND_VOLUME);
      else playTestCompleteSound();
    }
  }, [test.status, test.result, test.elapsedMs]);

  useEffect(() => {
    const body = document.body;

    if (!focusMode) {
      body.classList.remove("typing-focus-active");
      if (bodyOverflowBeforeFocusRef.current !== null) {
        body.style.overflow = bodyOverflowBeforeFocusRef.current;
        bodyOverflowBeforeFocusRef.current = null;
      }
      return;
    }

    if (bodyOverflowBeforeFocusRef.current === null) {
      bodyOverflowBeforeFocusRef.current = body.style.overflow;
    }
    body.classList.add("typing-focus-active");
    body.style.overflow = "hidden";

    return () => {
      body.classList.remove("typing-focus-active");
      if (bodyOverflowBeforeFocusRef.current !== null) {
        body.style.overflow = bodyOverflowBeforeFocusRef.current;
        bodyOverflowBeforeFocusRef.current = null;
      }
    };
  }, [focusMode]);

  // FLIP-style transition: the full-screen shell begins at the exact screen
  // bounds of the clicked card, then expands to the viewport. useLayoutEffect
  // starts it before paint, eliminating the one-frame full-screen jump.
  useLayoutEffect(() => {
    if (!focusMode || reducedMotion) return;
    const shell = shellRef.current;
    const origin = focusOriginRef.current;
    if (!shell || !origin) return;

    focusAnimationRef.current?.cancel();
    const viewportWidth = Math.max(1, window.innerWidth);
    const viewportHeight = Math.max(1, window.innerHeight);
    const scaleX = Math.max(0.01, origin.width / viewportWidth);
    const scaleY = Math.max(0.01, origin.height / viewportHeight);

    const animation = shell.animate(
      [
        {
          transform: `translate3d(${origin.left}px, ${origin.top}px, 0) scale(${scaleX}, ${scaleY})`,
          borderRadius: "24px",
          boxShadow: "0 30px 80px -36px rgba(0,0,0,.48)",
        },
        {
          transform: "translate3d(0, 0, 0) scale(1, 1)",
          borderRadius: "0px",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        },
      ],
      {
        duration: FOCUS_TRANSITION_MS,
        easing: FOCUS_TRANSITION_EASING,
        fill: "both",
      },
    );
    focusAnimationRef.current = animation;
    animation.finished.catch(() => {}).finally(() => {
      if (focusAnimationRef.current === animation) focusAnimationRef.current = null;
    });
    return () => animation.cancel();
  }, [focusMode, reducedMotion]);

  useEffect(() => {
    if (!focusMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();

      // Prevent a running test's status effect from reopening focus mode.
      focusExitRequestedRef.current = true;
      scrollToTesterAfterExitRef.current = true;

      // Release the page lock synchronously; don't wait for React's effect cleanup.
      releaseFocusScrollLock();
      exitFocusMode();
    };
    // Capture phase makes Escape reliable even when the transparent typing
    // input or another focused control would otherwise consume the key.
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [focusMode]);

  useEffect(() => {
    if (focusMode || !scrollToTesterAfterExitRef.current) return;
    scrollToTesterAfterExitRef.current = false;

    // Wait for the normal in-page tester shell to be restored from the portal.
    const frame = window.requestAnimationFrame(() => {
      const testerElement = document.getElementById("tester");
      if (!testerElement) return;
      const targetTop = Math.max(
        0,
        window.scrollY + testerElement.getBoundingClientRect().top - 24,
      );
      window.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusMode, reducedMotion]);

  const animateFocusState = (next: boolean) => {
    if (focusMode !== next) setFocusMode(next);
  };

  function enterFocusMode() {
    const rect = shellRef.current?.getBoundingClientRect();
    if (rect) {
      focusOriginRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
    animateFocusState(true);
  }

  function releaseFocusScrollLock() {
    const body = document.body;
    body.classList.remove("typing-focus-active");

    if (bodyOverflowBeforeFocusRef.current !== null) {
      body.style.overflow = bodyOverflowBeforeFocusRef.current;
      bodyOverflowBeforeFocusRef.current = null;
    } else if (body.style.overflow === "hidden") {
      body.style.overflow = "";
    }
  }

  function exitFocusMode() {
    focusAnimationRef.current?.cancel();
    releaseFocusScrollLock();
    animateFocusState(false);
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  const handleDifficultyChange = (difficulty: typeof test.difficulty) => {
    animateFocusState(false);
    test.setDifficulty(difficulty);
    savePreferences(difficulty, test.duration);
  };

  const handleDurationChange = (seconds: number) => {
    animateFocusState(false);
    test.setDuration(seconds);
    savePreferences(test.difficulty, seconds);
  };

  const resetShortTest = () => {
    animateFocusState(false);
    test.reset();
  };

  const controlsDisabled = test.status === "running" || viewMode === "custom";
  const showTypingLanguageSelector = viewMode === "test" && test.status !== "finished";
  const focusedShellStyle = focusMode
    ? ({ animation: "none", transformOrigin: "top left" } as CSSProperties)
    : undefined;

  const testerShell = (
    <div
      ref={shellRef}
      style={focusedShellStyle}
      className={cn("test-shell rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm transition-all duration-300", focusMode && "test-shell-focus")}
    >
      {focusMode && (
        <svg
          className="focus-controls-arc"
          viewBox="0 0 1600 360"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="focus-controls-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--app-accent)" stopOpacity="0" />
              <stop offset="12%" stopColor="var(--app-accent)" stopOpacity="0.2" />
              <stop offset="30%" stopColor="var(--app-primary)" stopOpacity="0.48" />
              <stop offset="50%" stopColor="var(--app-primary)" stopOpacity="0.78" />
              <stop offset="70%" stopColor="var(--app-primary)" stopOpacity="0.48" />
              <stop offset="88%" stopColor="var(--app-accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--app-accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="focus-controls-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--app-accent)" stopOpacity="0.10" />
              <stop offset="38%" stopColor="var(--app-canvas)" stopOpacity="0.055" />
              <stop offset="76%" stopColor="var(--app-canvas)" stopOpacity="0.018" />
              <stop offset="100%" stopColor="var(--app-canvas)" stopOpacity="0" />
            </linearGradient>
            <filter id="focus-controls-glow" x="-10%" y="-35%" width="120%" height="190%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          <path
            d="M -50 350 Q 800 -160 1650 350 L 1650 380 L -50 380 Z"
            fill="url(#focus-controls-fade)"
          />
          <path
            d="M -50 350 Q 800 -160 1650 350"
            fill="none"
            stroke="url(#focus-controls-stroke)"
            strokeWidth="9"
            opacity="0.82"
            filter="url(#focus-controls-glow)"
          />
          <path
            d="M -50 350 Q 800 -160 1650 350"
            fill="none"
            stroke="url(#focus-controls-stroke)"
            strokeWidth="1.4"
            opacity="0.95"
          />
        </svg>
      )}
      {!focusMode && (
        <div className="flex flex-col gap-4 border-b border-hairline pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SettingLabel text={tr(locale, "tester", "difficulty")} />
            <DifficultySelector value={test.difficulty} onChange={handleDifficultyChange} disabled={controlsDisabled} locale={locale} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SettingLabel text={tr(locale, "tester", "duration")} />
            <DurationSelector value={test.duration} onChange={handleDurationChange} disabled={controlsDisabled} locale={locale} />
          </div>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "custom" ? "test" : "custom")}
            disabled={test.status === "running"}
            className={cn(
              "rounded-full border px-5 py-2 font-link transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40",
              viewMode === "custom" ? "border-accent bg-accent/10 text-accent" : "border-hairline bg-canvas-soft text-ink hover:border-text-muted"
            )}
          >
            {tr(locale, "tester", "customTest")}
          </button>
        </div>
      )}

      {!focusMode && personalBest && viewMode === "test" && test.status !== "finished" && (
        <p className="mt-4 text-center font-caption text-text-muted sm:text-left">
          {tr(locale, "tester", "bestOnProfile")} {test.difficulty} · {test.duration / 60}min: <span className="font-semibold text-accent">{personalBest.wpm} WPM</span> {locale === "es" ? "con" : "at"} <span className="font-semibold text-ink-soft">{personalBest.accuracy}%</span>
        </p>
      )}

      <div className={cn(
        "mt-6",
        focusMode && "focus-content mt-0",
        focusMode && test.status === "finished" && "focus-content-result",
      )}>
        {viewMode === "custom" ? (
          <CustomTextPanel
            duration={test.duration}
            onStartFree={(seconds) => {
              test.startFreeTypingTest(seconds);
              setViewMode("test");
            }}
            onStartPaste={(text, seconds) => {
              test.startCustomTest(text, seconds);
              setViewMode("test");
            }}
            onCancel={() => setViewMode("test")}
            locale={locale}
          />
        ) : test.status === "finished" && test.result && test.elapsedMs < MINIMUM_RESULT_DURATION_MS ? (
          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-hairline bg-canvas-soft px-6 py-12 text-center sm:py-14">
            <p className="max-w-md font-body-lg text-ink">{tr(locale, "tester", "minStats")}</p>
            <button type="button" onClick={resetShortTest} className="rounded-full border border-hairline bg-canvas px-6 py-3 font-link text-ink hover:border-text-muted hover:bg-canvas-soft">
              {tr(locale, "tester", "startAgain")}
            </button>
          </div>
        ) : test.status === "finished" && test.result ? (
          <ResultPanel
            result={test.result}
            targetText={test.targetText}
            profileBest={personalBest}
            reducedMotion={reducedMotion}
            onRetry={() => {
              animateFocusState(false);
              test.retry();
            }}
            onNewText={() => {
              animateFocusState(false);
              test.newText();
            }}
            onChangeDifficulty={() => {
              animateFocusState(false);
              test.reset();
            }}
            onCustomTest={() => {
              animateFocusState(false);
              setViewMode("custom");
            }}
            locale={locale}
          />
        ) : (
          <div
            className={focusMode ? "focus-test-stack" : "space-y-6"}
            onClick={(event) => {
              if (focusMode) event.stopPropagation();
            }}
          >
            {showTypingLanguageSelector && (
              <TypingLanguageSelector
                value={test.locale}
                onChange={test.setLocale}
                disabled={test.status === "running"}
              />
            )}
            <LiveMetrics
              status={test.status}
              duration={test.duration}
              startTimeRef={test.startTimeRef}
              liveCharCountRef={test.liveCharCountRef}
              accuracy={test.liveStats.accuracy}
              focusMode={focusMode}
              locale={locale}
            />
            <TypingText
              target={test.targetText}
              typed={test.typed}
              status={test.status}
              resetKey={test.sessionId}
              onChange={test.handleInputChange}
              reducedMotion={reducedMotion}
              freeTyping={test.isFreeTyping}
              focusMode={focusMode}
              onFocusModeRequest={enterFocusMode}
              locale={locale}
            />
            <TestControls
              onRestart={() => {
                animateFocusState(false);
                test.retry();
              }}
              onReset={() => {
                animateFocusState(false);
                test.reset();
              }}
              onStop={test.stop}
              canStop={test.status === "running"}
              focusMode={focusMode}
              locale={locale}
            />
            {focusMode && <p className="text-center font-caption text-text-faint">{tr(locale, "tester", "focusHelp")}</p>}
          </div>
        )}
      </div>
    </div>
  );

  return focusMode
    ? createPortal(
        <>
          <div
            aria-hidden="true"
            style={{ position: "fixed", inset: 0, zIndex: 59, background: "var(--app-canvas)" }}
          />
          {testerShell}
        </>,
        document.body,
      )
    : <div id="tester" className="scroll-mt-20">{testerShell}</div>;
}

function SettingLabel({ text }: { text: string }) {
  return <span className="font-label text-text-muted">{text}</span>;
}
