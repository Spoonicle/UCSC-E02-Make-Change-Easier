export {};

type ShiftResults = {
  productionCrew: number;
  suppliesProduced: number;
  consumed: number;
  balance: number;
};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let productionCrew = 2;

function calculateProduction(productionCrew: number): ShiftResults {
  const suppliesProduced = productionCrew * 3;
  const consumed = 6;
  const balance = suppliesProduced - consumed;
  return {
    productionCrew,
    suppliesProduced,
    consumed,
    balance,
  };
}

function renders() {
  const shiftResults = calculateProduction(productionCrew);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCrew(shiftResults.productionCrew);
  drawProduction(shiftResults);
  formatReadout(shiftResults);
}

function drawCrew(productionCrew: number) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < productionCrew ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < productionCrew ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawProduction(results: ShiftResults) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${results.productionCrew} / 6`, 18, 76);
  ctx.fillText(`Production: ${results.suppliesProduced}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, results.suppliesProduced * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${results.consumed}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, results.consumed * 14, 20);
}

function formatReadout(results: ShiftResults) {
  readout.textContent =
    `Assigned: ${results.productionCrew}/6 · Production: ${results.suppliesProduced} · Consumption: ${results.consumed} · Balance: ${
      results.balance > 0 ? "+" : ""
    }${results.balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  productionCrew = Math.max(0, productionCrew - 1);
  renders();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  productionCrew = Math.min(6, productionCrew + 1);
  renders();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    productionCrew = 2;
    renders();
  };
renders();
