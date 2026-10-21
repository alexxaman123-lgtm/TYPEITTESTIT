import type { TestResult } from "./useTypingTest";

export function buildShareText(result: TestResult): string {
  const mode = result.isCustom ? "CUSTOM" : result.difficulty.toUpperCase();
  return `I just scored ${result.wpm.toFixed(1)} actual WPM with ${result.accuracy}% accuracy on GOATTYPE (${mode} mode, ${result.targetDurationSec}s test). Can you beat my score?\n\nTYPE LIKE A GOAT: https://typeittestit.com`;
}

function drawShareCard(result: TestResult): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d")!;
  const root = window.getComputedStyle(document.documentElement);
  const themeColor = (name: string, fallback: string) =>
    root.getPropertyValue(name).trim() || fallback;
  const canvasColor = themeColor("--app-canvas", "#000000");
  const ink = themeColor("--app-ink", "#ffffff");
  const inkSoft = themeColor("--app-ink-soft", ink);
  const muted = themeColor("--app-text-muted", inkSoft);
  const accent = themeColor("--app-accent", "#ff2548");
  const rgba = (color: string, alpha: number) => {
    const match = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/iu);
    if (!match) return color;
    let hex = match[1];
    if (hex.length === 3) hex = hex.split("").map((part) => part + part).join("");
    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  };

  ctx.fillStyle = canvasColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const grad = ctx.createRadialGradient(600, 180, 50, 600, 180, 700);
  grad.addColorStop(0, rgba(accent, 0.18));
  grad.addColorStop(1, rgba(accent, 0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = rgba(ink, 0.08);
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
  for (let y = 0; y < canvas.height; y += 48) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
  ctx.textBaseline = "alphabetic";
  ctx.font = "700 34px 'JetBrains Mono', monospace";
  ctx.fillStyle = ink;
  ctx.fillText("GOAT", 80, 100);
  const goatWidth = ctx.measureText("GOAT").width;
  ctx.fillStyle = accent;
  ctx.fillText("TYPE", 80 + goatWidth, 100);
  ctx.font = "600 22px Inter, sans-serif";
  ctx.fillStyle = muted;
  ctx.fillText("TYPE LIKE A GOAT", 80, 140);
  ctx.font = "800 190px Inter, sans-serif";
  ctx.fillStyle = accent;
  ctx.fillText(`${result.wpm}`, 80, 400);
  ctx.font = "700 46px Inter, sans-serif";
  ctx.fillStyle = ink;
  ctx.fillText("WPM", 80, 450);
  ctx.font = "600 40px Inter, sans-serif";
  ctx.fillStyle = inkSoft;
  ctx.fillText(`${result.accuracy}% ACCURACY`, 80, 510);
  const mode = result.isCustom ? "CUSTOM TEXT" : `${result.difficulty.toUpperCase()} MODE`;
  ctx.font = "600 28px Inter, sans-serif";
  ctx.fillStyle = muted;
  ctx.fillText(`${mode}  ·  ${result.targetDurationSec}s TEST`, 80, 560);
  ctx.font = "700 30px Inter, sans-serif";
  ctx.fillStyle = accent;
  ctx.textAlign = "right";
  ctx.fillText("TYPE LIKE A GOAT — GOATTYPE", canvas.width - 80, 590);
  ctx.textAlign = "left";
  return canvas;
}

export async function shareResult(result: TestResult): Promise<"shared" | "copied" | "downloaded" | "failed"> {
  const text = buildShareText(result);
  try {
    const canvas = drawShareCard(result);
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], "goattype-result.png", { type: "image/png" })] })) {
      const file = new File([blob], "goattype-result.png", { type: "image/png" });
      await navigator.share({ title: "GOATTYPE — Typing Test Result", text, files: [file] });
      return "shared";
    }
    if (navigator.share) { await navigator.share({ title: "GOATTYPE — Typing Test Result", text }); return "shared"; }
    if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); if (blob) downloadBlob(blob, "goattype-result.png"); return "copied"; }
    if (blob) { downloadBlob(blob, "goattype-result.png"); return "downloaded"; }
    return "failed";
  } catch (err) {
    if ((err as Error)?.name === "AbortError") return "failed";
    try { await navigator.clipboard.writeText(text); return "copied"; } catch { return "failed"; }
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
