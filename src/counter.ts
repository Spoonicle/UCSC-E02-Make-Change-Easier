export {};

const shieldEvents = new EventTarget();
const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

interface ShieldStatus {
  charge: number;
  max: number;
  missing: number;
}

function getShieldStatus(currentCharge: number): ShieldStatus {
  const max = 10;
  const missing = max - currentCharge;
  return {
    charge: currentCharge,
    max,
    missing,
  };
}

function drawMeter(status: ShieldStatus) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < status.max; i++) {
    ctx.fillStyle = i < status.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${status.charge} / ${status.max} shield`, 12, 100);
  readout.textContent = `Shield charge: ${status.charge} / ${status.max}`;
}

function updateStats(status: ShieldStatus) {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(status);
}

function renderStats(status: ShieldStatus) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${status.charge} · Missing charge: ${status.missing}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  const status = getShieldStatus(count);
  shieldEvents.dispatchEvent(new CustomEvent("change", { detail: status }));
}

function onInspectorUpdate(event: Event) {
  const snapshot = event as CustomEvent<ShieldStatus>;
  updateStats(snapshot.detail);
}

shieldEvents.addEventListener("change", (event) => {
  const custom = event as CustomEvent<ShieldStatus>;
  drawMeter(custom.detail);
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(getShieldStatus(count));
  shieldEvents.addEventListener("change", onInspectorUpdate);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
  shieldEvents.removeEventListener("change", onInspectorUpdate);
};

const status = getShieldStatus(count);
drawMeter(status);
