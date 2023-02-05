import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { Ghost } from "./ghost-class";
import { Pellet } from "./pellet-class";
import { Player } from "./player-class";
import { CollisionType } from "./types";

export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const scoreElement = document.getElementById("score");

export const context = canvas.getContext("2d");

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

const tileSize = 40;

// set the width to the number of colums * tileSize
canvas.width = map[0].length * tileSize;
// Set the height to the number rows * tileSize
canvas.height = map.length * tileSize;

export const canvasErrorString = "Canvas context is undefined or null!";

const pellets: Pellet[] = [];
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

let score = 0;

function createImage(src: string) {
  const image = new Image();
  image.src = src;
  return image;
}

// Additional cases (does not include the power up pellet that's inserted later in the vid)
map.forEach((row, rowIndex) => {
  row.forEach((symbol, cellIndex) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/pipeHorizontal.png"),
          })
        );
        break;
      case "|":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/pipeVertical.png"),
          })
        );
        break;
      case "1":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/pipeCorner1.png"),
          })
        );
        break;
      case "2":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/pipeCorner2.png"),
          })
        );
        break;
      case "3":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/pipeCorner3.png"),
          })
        );
        break;
      case "4":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/pipeCorner4.png"),
          })
        );
        break;
      case "b":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * cellIndex,
              y: Boundary.cellHeight * rowIndex,
            },
            image: createImage("./src/image/block.png"),
          })
        );
        break;
      case "[":
        boundaries.push(
          new Boundary({
            position: {
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
            },
            image: createImage("./src/image/capLeft.png"),
          })
        );
        break;
      case "]":
        boundaries.push(
          new Boundary({
            position: {
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
            },
            image: createImage("./src/image/capRight.png"),
          })
        );
        break;
      case "_":
        boundaries.push(
          new Boundary({
            position: {
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
            },
            image: createImage("./src/image/capBottom.png"),
          })
        );
        break;
      case "^":
        boundaries.push(
          new Boundary({
            position: {
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
            },
            image: createImage("./src/image/capTop.png"),
          })
        );
        break;
      case "+":
        boundaries.push(
          new Boundary({
            position: {
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
            },
            image: createImage("./src/image/pipeCross.png"),
          })
        );
        break;
      case "5":
        boundaries.push(
          new Boundary({
            position: {
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
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
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
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
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
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
              x: cellIndex * Boundary.cellWidth,
              y: rowIndex * Boundary.cellHeight,
            },
            image: createImage("./src/image/pipeConnectorLeft.png"),
          })
        );
        break;
      case ".":
        pellets.push(
          new Pellet({
            position: {
              x: cellIndex * Boundary.cellWidth + Boundary.cellWidth / 2,
              y: rowIndex * Boundary.cellHeight + Boundary.cellHeight / 2,
            },
          })
        );
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

  // Detect pellet collision
  for (let pelletIndex = pellets.length - 1; 0 < pelletIndex; pelletIndex--) {
    const pellet = pellets[pelletIndex];

    pellet.draw();

    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(pelletIndex, 1);
      score += 10;
      if (!scoreElement) {
        console.error("Score element is missing!");
        return;
      } else {
        scoreElement.innerHTML = score.toString();
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
