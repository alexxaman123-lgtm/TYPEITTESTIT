import type { TestResult } from "./useTypingTest";

export function buildShareText(result: TestResult): string {
  const mode = result.isCustom ? "CUSTOM" : result.difficulty.toUpperCase();
  return `I just scored ${result.wpm.toFixed(1)} actual WPM with ${result.accuracy}% accuracy on TippyType (${mode} mode, ${result.targetDurationSec}s test). Can you beat my score?\n\nTry it: https://typeittestit.com`;
}

function drawShareCard(result: TestResult): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#050706";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createRadialGradient(600, 180, 50, 600, 180, 700);
  grad.addColorStop(0, "rgba(0,255,102,0.18)");
  grad.addColorStop(1, "rgba(0,255,102,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.textBaseline = "alphabetic";
  ctx.font = "700 34px 'JetBrains Mono', monospace";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("TIPPY", 80, 100);
  const tippyWidth = ctx.measureText("TIPPY").width;
  ctx.fillStyle = "#00ff66";
  ctx.fillText("TYPE", 80 + tippyWidth, 100);

  ctx.font = "600 22px Inter, sans-serif";
  ctx.fillStyle = "#a7aea9";
  ctx.fillText("TIPPYTYPE TYPING TEST", 80, 140);

  ctx.font = "800 190px Inter, sans-serif";
  ctx.fillStyle = "#00ff66";
  ctx.fillText(`${result.wpm}`, 80, 400);
  ctx.font = "700 46px Inter, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("WPM", 80, 450);

  ctx.font = "600 40px Inter, sans-serif";
  ctx.fillStyle = "#e8ece9";
  ctx.fillText(`${result.accuracy}% ACCURACY`, 80, 510);

  const mode = result.isCustom ? "CUSTOM TEXT" : `${result.difficulty.toUpperCase()} MODE`;
  ctx.font = "600 28px Inter, sans-serif";
  ctx.fillStyle = "#6e7771";
  ctx.fillText(`${mode}  ·  ${result.targetDurationSec}s TEST`, 80, 560);

  ctx.font = "700 30px Inter, sans-serif";
  ctx.fillStyle = "#00d95a";
  ctx.textAlign = "right";
  ctx.fillText("CAN YOU BEAT THIS? — TIPPYTYPE", canvas.width - 80, 590);
  ctx.textAlign = "left";

  return canvas;
}

export async function shareResult(result: TestResult): Promise<"shared" | "copied" | "downloaded" | "failed"> {
  const text = buildShareText(result);

  try {
    const canvas = drawShareCard(result);
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

    if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], "tippytype-result.png", { type: "image/png" })] })) {
      const file = new File([blob], "tippytype-result.png", { type: "image/png" });
      await navigator.share({
        title: "TippyType — Typing Test Result",
        text,
        files: [file],
      });
      return "shared";
    }

    if (navigator.share) {
      await navigator.share({ title: "TippyType — Typing Test Result", text });
      return "shared";
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      if (blob) downloadBlob(blob, "tippytype-result.png");
      return "copied";
    }

    if (blob) {
      downloadBlob(blob, "tippytype-result.png");
      return "downloaded";
    }

    return "failed";
  } catch (err) {
    if ((err as Error)?.name === "AbortError") return "failed";
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
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
