export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

type PositionType = {
  x: number;
  y: number;
};

type VelocityType = {
  x: number;
  y: number;
};

type BoundaryConstructor = {
  position: PositionType;
};

type PlayerConstructor = {
  position: PositionType;
  velocity: VelocityType;
};

const canvasErrorString = "Canvas context is undefined or null!";

class Boundary {
  position;
  width: number;
  height: number;
  static cellWidth = 40;
  static cellHeight = 40;
  constructor({ position }: BoundaryConstructor) {
    this.position = position;
    this.width = 40;
    this.height = 40;
  }

  draw() {
    // I'm using a guard here to account for the
    // context possibly being null. Ideally
    // I'd have a custom error or function that
    // introduces a visual error state to the game.
    if (!context) {
      console.error(canvasErrorString);
      return;
    }
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Player {
  position: PositionType;
  radius: number;
  velocity: VelocityType;
  constructor({ position, velocity }: PlayerConstructor) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }
  draw() {
    if (!context) {
      console.error(canvasErrorString);
      return;
    }
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

const boundaries: Boundary[] = [];
const player = new Player({
  position: {
    x: Boundary.cellWidth + Boundary.cellWidth / 2,
    y: Boundary.cellHeight + Boundary.cellHeight / 2,
  },
  velocity: { x: 0, y: 0 },
});

const keys = {
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

type KeyType = "" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

let lastKey: KeyType = "";

const map = [
  ["-", "-", "-", "-", "-", "-", "-"],
  ["-", " ", " ", " ", " ", " ", "-"],
  ["-", " ", "-", " ", "-", " ", "-"],
  ["-", " ", " ", " ", " ", " ", "-"],
  ["-", "-", "-", "-", "-", "-", "-"],
];

map.forEach((row, rowIndex) => {
  row.forEach((symbol, columnIndex) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * columnIndex,
              y: Boundary.cellHeight * rowIndex,
            },
          })
        );
        break;

      default:
        break;
    }
  });
});

function animate() {
  requestAnimationFrame(animate);

  // Use our guard clause again
  if (!context) {
    console.error(canvasErrorString);
    return;
  }

  // Clear the canvas so our last player position is not shown.
  // Only the updated player position
  context.clearRect(0, 0, canvas.width, canvas.height);

  boundaries.forEach((boundary) => {
    boundary.draw();
  });

  player.update();
  player.velocity.y = 0;
  player.velocity.x = 0;

  if (keys.ArrowUp.pressed && lastKey === "ArrowUp") {
    player.velocity.y = -5;
  } else if (keys.ArrowDown.pressed && lastKey === "ArrowDown") {
    player.velocity.y = 5;
  } else if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    player.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    player.velocity.x = 5;
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = true;
      lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = true;
      lastKey = "ArrowDown";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      lastKey = "ArrowRight";
      break;
    default:
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;

    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;

      break;

    default:
      break;
  }
});
