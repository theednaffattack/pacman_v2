import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { Ghost } from "./ghost-class";
import { Pellet } from "./pellet-class";
import { Player } from "./player-class";
import { PowerUp } from "./power-up-class";
import { Sound } from "./sound-class";
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
const pinky = "";
const inky = "";
const blinky = "";
const clyde = "";
const spriteURL = "./src/image/ghost_sprite.png";
const sprite = createImage(spriteURL);
const pellets: Pellet[] = [];
let eatPelletSound = new Sound({ src: "./src/audio/eat1.mp3" });
const boundaries: Boundary[] = [];
const powerUps: PowerUp[] = [];
const ghosts: Ghost[] = [
  new Ghost({
    name: "pinky",
    position: {
      // x = column, y = row
      x: Boundary.cellWidth * 6 + Boundary.cellWidth / 2,
      y: Boundary.cellHeight * 3 + Boundary.cellHeight / 2,
    },
    image: sprite,
    speed: 2,
    spriteIndex: [3, 0],
    velocity: { x: Ghost.speed, y: 0 },
  }),
  new Ghost({
    name: "blinky",
    image: sprite,
    spriteIndex: [0, 0],
    position: {
      x: Boundary.cellWidth * 9 + Boundary.cellWidth / 2,
      y: Boundary.cellHeight * 7 + Boundary.cellHeight / 2,
    },
    speed: 2,
    velocity: { x: Ghost.speed, y: 0 },
  }),
  new Ghost({
    name: "inky",
    image: sprite,
    spriteIndex: [3, 2],
    position: {
      x: Boundary.cellWidth * 8 + Boundary.cellWidth / 2,
      y: Boundary.cellHeight * 11 + Boundary.cellHeight / 2,
    },
    speed: 2,
    velocity: { x: Ghost.speed, y: 0 },
  }),
  new Ghost({
    name: "clyde",
    image: sprite,
    spriteIndex: [2, 1],
    position: {
      x: Boundary.cellWidth * 2 + Boundary.cellWidth / 2,
      y: Boundary.cellHeight * 11 + Boundary.cellHeight / 2,
    },
    speed: 2,
    velocity: { x: Ghost.speed, y: 0 },
  }),
];
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

export function createImage(src: string) {
  const image = new Image();
  image.src = src;
  // image.onload = function () {
  //   console.log("LOADED: ", src);
  // };
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

      case "p":
        powerUps.push(
          new PowerUp({
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

let animationId: number;

function animate() {
  animationId = requestAnimationFrame(animate);

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

  // Detect power ups collison
  for (
    let powerUpIndex = powerUps.length - 1;
    0 <= powerUpIndex;
    powerUpIndex--
  ) {
    const powerUp = powerUps[powerUpIndex];
    powerUp.draw();

    // Player collides with power up
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(powerUpIndex, 1);
      ghosts.forEach((ghost) => {
        // const originalColor = ghost.color;
        ghost.scared = true;

        setInterval(() => {
          ghost.blinking = true;
        }, 500);

        // End ghost being scared altogether
        setTimeout(() => {
          ghost.scared = false;
        }, 5000);
      });
      score += 20;
      if (!scoreElement) {
        console.error("Score element is missing!");
        return;
      } else {
        scoreElement.innerHTML = score.toString();
      }
    }
  }

  // Lose game scenario (ghost & player collision)
  for (let ghostIndex = ghosts.length - 1; 0 <= ghostIndex; ghostIndex--) {
    const ghost = ghosts[ghostIndex];
    if (
      Math.hypot(
        ghost.position.x - player.position.x,
        ghost.position.y - player.position.y
      ) <
      ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(ghostIndex, 1);
      } else {
        let loseGameSound = new Sound({ src: "./src/audio/death.mp3" });
        loseGameSound.play();
        cancelAnimationFrame(animationId);
      }
    }
  }

  // Win condition
  if (pellets.length === 0) {
    console.log("You win");
    cancelAnimationFrame(animationId);
  }

  // Detect player / pellet collision
  for (let pelletIndex = pellets.length - 1; 0 <= pelletIndex; pelletIndex--) {
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
      eatPelletSound.play();
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
  ghosts.forEach((ghost) => {
    ghost.update();
    const collisions: CollisionType[] = [];

    boundaries.forEach((boundary) => {
      // Test if our ghost will collide to the top
      if (
        !collisions.includes("top") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: -ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("top");
      }
      // Test if our ghost will collide to the right
      if (
        !collisions.includes("right") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("right");
      }

      // Test if our ghost will collide to the bottom
      if (
        !collisions.includes("bottom") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: 0,
              y: ghost.speed,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("bottom");
      }

      // Test if our ghost will collide to the left
      if (
        !collisions.includes("left") &&
        circleCollidesWithRectangle({
          circle: {
            ...ghost,
            velocity: {
              x: -ghost.speed,
              y: 0,
            },
          },
          rectangle: boundary,
        })
      ) {
        collisions.push("left");
      }
    });
    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.y < 0) {
        ghost.prevCollisions.push("top");
      } else if (ghost.velocity.x > 0) {
        ghost.prevCollisions.push("right");
      } else if (ghost.velocity.y > 0) {
        ghost.prevCollisions.push("bottom");
      } else if (ghost.velocity.x < 0) {
        ghost.prevCollisions.push("left");
      }

      const pathways = ghost.prevCollisions.filter((collision) => {
        return !collisions.includes(collision);
      });

      const direction = pathways[Math.floor(Math.random() * pathways.length)];

      switch (direction) {
        case "top":
          ghost.velocity.y = -ghost.speed;
          ghost.velocity.x = 0;
          break;

        case "right":
          ghost.velocity.y = 0;
          ghost.velocity.x = ghost.speed;
          break;

        case "bottom":
          ghost.velocity.y = ghost.speed;
          ghost.velocity.x = 0;
          break;

        case "left":
          ghost.velocity.y = 0;
          ghost.velocity.x = -ghost.speed;
          break;
        default:
          break;
      }

      ghost.prevCollisions = [];
    }
  });
  if (player.velocity.x > 0) {
    player.rotation = 0;
  } else if (player.velocity.x < 0) {
    player.rotation = Math.PI;
  } else if (player.velocity.y > 0) {
    player.rotation = Math.PI / 2;
  } else if (player.velocity.y < 0) {
    player.rotation = Math.PI * 1.5;
  }
  // The commented code below allows the
  // player to stop but it breaks turning
  // player.velocity.y = 0;
  // player.velocity.x = 0;
}
// End of animate()

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
