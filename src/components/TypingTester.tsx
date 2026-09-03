import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTypingTest } from "../lib/useTypingTest";
import { useReducedMotion } from "../lib/useReducedMotion";
import { getPreferences, savePreferences } from "../lib/storage";
import { getProfileBest } from "../lib/leaderboard";
import { playTestCompleteSound } from "../lib/useTypingSounds";
import { getSoundEnabled, useSound } from "../lib/useSound";
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
const MINIMUM_RESULT_DURATION_MS = 60000;

export default function TypingTester({ locale = "en" }: { locale?: Locale }) {
  const prefs = useMemo(() => getPreferences(), []);
  const reducedMotion = useReducedMotion();
  const test = useTypingTest(prefs.difficulty, prefs.duration, locale === "es" ? "es" : "en");
  const [viewMode, setViewMode] = useState<ViewMode>("test");
  const [personalBest, setPersonalBest] = useState<PersonalBest>(null);
  const [focusMode, setFocusMode] = useState(false);
  const previousStatusRef = useRef(test.status);
  const { playSound } = useSound();

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
    if (test.status === "finished" || test.status === "idle") setFocusMode(false);
    else if (previous !== "running" && test.status === "running") setFocusMode(true);

    if (previous === "running" && test.status === "finished") {
      const finalWpm = test.result?.wpm ?? 0;
      if (!getSoundEnabled() || test.elapsedMs < MINIMUM_RESULT_DURATION_MS) return;
      if (finalWpm < SLOW_GOAT_WPM_THRESHOLD) playSound(SLOW_GOAT_SOUND, 0.5);
      else if (finalWpm >= AVERAGE_GOAT_MIN_WPM && finalWpm <= AVERAGE_GOAT_MAX_WPM) playSound(AVERAGE_GOAT_SOUND, AVERAGE_GOAT_SOUND_VOLUME);
      else if (finalWpm >= GOAT_TALKS_MIN_WPM && finalWpm <= GOAT_TALKS_MAX_WPM) playSound(GOAT_TALKS_SOUND, GOAT_TALKS_SOUND_VOLUME);
      else playTestCompleteSound();
    }
  }, [test.status, test.result, test.elapsedMs, playSound]);

  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.classList.toggle("typing-focus-active", focusMode);
    if (focusMode) body.style.overflow = "hidden";
    return () => {
      body.classList.remove("typing-focus-active");
      body.style.overflow = previousOverflow;
    };
  }, [focusMode]);

  useEffect(() => {
    if (!focusMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") exitFocusMode();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode]);

  const animateFocusState = (next: boolean) => {
    if (focusMode !== next) setFocusMode(next);
  };

  function enterFocusMode() {
    animateFocusState(true);
  }

  function exitFocusMode() {
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

  const testerShell = (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget && focusMode) exitFocusMode();
      }}
      className={cn("test-shell rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm transition-all duration-300", focusMode && "test-shell-focus")}
    >
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

      <div className={cn("mt-6", focusMode && "focus-content mt-0")}>
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
            className={cn("space-y-6", focusMode && "focus-test-stack")}
            onClick={(event) => {
              if (focusMode) event.stopPropagation();
            }}
          >
            <TypingLanguageSelector
              value={test.locale}
              onChange={test.setLocale}
              disabled={test.status === "running" || viewMode === "custom"}
            />
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

  return focusMode ? createPortal(testerShell, document.body) : <div id="tester" className="scroll-mt-20">{testerShell}</div>;
}

function SettingLabel({ text }: { text: string }) {
  return <span className="font-label text-text-muted">{text}</span>;
}
