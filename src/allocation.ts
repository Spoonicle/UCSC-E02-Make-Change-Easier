export {};

type ShiftResults = {
  productionCrew: number;
  suppliesProduced: number;
  consumed: number;
  balance: number;
};

type ResourceBar = {
  title: string;
  value: number;
  color: string;
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
  ctx.font = "14px system-ui";
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Producers: ${results.productionCrew} / 6`, 18, 76);

  const rows: ResourceBar[] = [
    {
      title: "Production",
      value: results.suppliesProduced,
      color: "#27766b",
    },
    {
      title: "Consumption",
      value: results.consumed,
      color: "#a44d23",
    },
  ];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const textY = 102 + i * 52;
    const barY = textY + 8;

    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.title}: ${row.value}`, 18, textY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, barY, row.value * 14, 20);
  }
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
