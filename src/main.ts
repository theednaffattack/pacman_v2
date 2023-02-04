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
  image: HTMLImageElement;
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
  image;
  constructor({ position, image }: BoundaryConstructor) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image;
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
    // context.fillStyle = "blue";
    // context.fillRect(this.position.x, this.position.y, this.width, this.height);
    context.drawImage(this.image, this.position.x, this.position.y);
  }
}

type PlayerType = {
  position: PositionType;
  radius: number;
  velocity: VelocityType;
};

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

function createImage(src: string) {
  const image = new Image();
  image.src = src;
  return image;
}

const map = [
  ["1", "-", "-", "-", "-", "-", "-", "-", "-", "-", "2"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "7", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "+", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", "_", ".", ".", ".", ".", "|"],
  ["|", ".", "[", "]", ".", ".", ".", "[", "]", ".", "|"],
  ["|", ".", ".", ".", ".", "^", ".", ".", ".", ".", "|"],
  ["|", ".", "b", ".", "[", "5", "]", ".", "b", ".", "|"],
  ["|", ".", ".", ".", ".", ".", ".", ".", ".", "p", "|"],
  ["4", "-", "-", "-", "-", "-", "-", "-", "-", "-", "3"],
];

// Additional cases (does not include the power up pellet that's inserted later in the vid)
map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * j,
              y: Boundary.cellHeight * i,
            },
            image: createImage("./src/image/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            image: createImage("./src/image/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            image: createImage("./src/image/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            image: createImage("./src/image/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            image: createImage("./src/image/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            image: createImage("./src/image/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            color: "blue",
            image: createImage("./src/image/pipeConnectorTop.png"),
          })
        );
        break;
      case "6":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            color: "blue",
            image: createImage("./src/image/pipeConnectorRight.png"),
          })
        );
        break;
      case "7":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            color: "blue",
            image: createImage("./src/image/pipeConnectorBottom.png"),
          })
        );
        break;
      case "8":
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.cellWidth,
              y: i * Boundary.cellHeight,
            },
            image: createImage("./src/image/pipeConnectorLeft.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.cellWidth + Boundary.cellWidth / 2,
              y: i * Boundary.cellHeight + Boundary.cellHeight / 2,
            },
          })
        );
        break;
    }
  });
});
function circleCollidesWithRectangle({
  circle,
  rectangle,
}: {
  rectangle: Boundary;
  circle: PlayerType;
}) {
  return (
    // top of circle
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height &&
    // right side of circle
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    // bottom of circle
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    // left side of circle
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width
  );
}

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

  // Character movement
  if (keys.ArrowUp.pressed && lastKey === "ArrowUp") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...player, velocity: { x: 0, y: -5 } },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = -5;
      }
    }
  } else if (keys.ArrowDown.pressed && lastKey === "ArrowDown") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...player, velocity: { x: 0, y: 5 } },
          rectangle: boundary,
        })
      ) {
        player.velocity.y = 0;
        break;
      } else {
        player.velocity.y = 5;
      }
    }
  } else if (keys.ArrowLeft.pressed && lastKey === "ArrowLeft") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...player, velocity: { x: -5, y: 0 } },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = -5;
      }
    }
  } else if (keys.ArrowRight.pressed && lastKey === "ArrowRight") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...player, velocity: { x: 5, y: 0 } },
          rectangle: boundary,
        })
      ) {
        player.velocity.x = 0;
        break;
      } else {
        player.velocity.x = 5;
      }
    }
  }

  boundaries.forEach((boundary) => {
    boundary.draw();

    // collision detector
    if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });

  player.update();
  // player.velocity.y = 0;
  // player.velocity.x = 0;
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
