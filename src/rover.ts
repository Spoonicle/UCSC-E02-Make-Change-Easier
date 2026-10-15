export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const pending = document.querySelector<HTMLOListElement>("#rover-pending")!;
const roverQueueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const roverRun = document.querySelector<HTMLButtonElement>("#rover-run")!;
const roverClear = document.querySelector<HTMLButtonElement>("#rover-clear")!;

const queue: Command[] = [];

interface Directions {
  name: string;
  dx: number;
  dy: number;
}

const directionInfo: Directions[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directionInfo[direction].name
  }`;
}

interface Command {
  readonly name: string;
  execute(): void;
}

const forwardCommand: Command = {
  name: "Forward",
  execute(): void {
    x = Math.max(0, Math.min(4, x + directionInfo[direction].dx));
    y = Math.max(0, Math.min(4, y + directionInfo[direction].dy));
  },
};

const rightCommand: Command = {
  name: "Right",
  execute(): void {
    direction = (direction + 1) % directionInfo.length;
  },
};

function updateQueueUI(): void {
  pending.innerHTML = "";

  if (queue.length === 0) {
    roverQueueStatus.textContent = "Empty";
    roverRun.disabled = true;
    roverClear.disabled = true;
    pending.innerHTML = "";
    return;
  }

  roverRun.disabled = false;
  roverClear.disabled = false;

  for (let i = 0; i < queue.length; i++) {
    const command = queue[i];
    const item = document.createElement("li");
    item.textContent = command.name;
    pending.appendChild(item);
  }
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  queue.push(forwardCommand);
  updateQueueUI();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  queue.push(rightCommand);
  updateQueueUI();
};

function runCommand() {
  updateQueueUI();

  for (const command of queue) {
    command.execute();
  }

  queue.length = 0;
  updateQueueUI();
  drawRover();
}

function clear() {
  queue.length = 0;
  updateQueueUI();
}

function reset() {
  x = 2;
  y = 2;
  direction = 0;
  queue.length = 0;
  updateQueueUI();
  drawRover();
}

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  reset();
};

document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  clear();
};

document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  runCommand();
};

drawRover();
updateQueueUI();
