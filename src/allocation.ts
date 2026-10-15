export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let productionCrew = 2;

function main() {
  const suppliesProduced = productionCrew * 3;
  const consumed = 6;
  const balance = suppliesProduced - consumed;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawCrew(productionCrew);
  drawProduction(suppliesProduced, productionCrew, consumed);
  formatReadout(suppliesProduced, productionCrew, consumed, balance);
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

function drawProduction(
  suppliesProduced: number,
  productionCrew: number,
  consumed: number,
) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${productionCrew} / 6`, 18, 76);
  ctx.fillText(`Production: ${suppliesProduced}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, suppliesProduced * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumed}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumed * 14, 20);
}

function formatReadout(
  suppliesProduced: number,
  productionCrew: number,
  consumed: number,
  balance: number,
) {
  readout.textContent =
    `Assigned: ${productionCrew}/6 · Production: ${suppliesProduced} · Consumption: ${consumed} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  productionCrew = Math.max(0, productionCrew - 1);
  main();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  productionCrew = Math.min(6, productionCrew + 1);
  main();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    productionCrew = 2;
    main();
  };
main();
