import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { retrieveGhosts } from "./ghosts";
import { initGameArea } from "./init-game-area";
import { levelOneMap } from "./level-maps";
import { Pellet } from "./pellet-class";
import { Player } from "./player-class";
import { PowerUp } from "./power-up-class";
import { Sound } from "./sound-class";
import { CollisionType, KeysRegisterType, KeyType } from "./types";

let keys: KeysRegisterType = {
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const scoreElement = document.getElementById("score");

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Context is undefined");
}
if (!scoreElement) {
  throw new Error("Score element is undefined");
}

let paused = false;
let pellets: Pellet[] = [];
let boundaries: Boundary[] = [];
let powerUps: PowerUp[] = [];
let animationId = 0;
let score = 0;
let lastKey: KeyType = "";
let ghosts = retrieveGhosts(context);
let loseGameSound = new Sound({ src: "./src/audio/death.mp3" });
let eatPelletSound = new Sound({ src: "./src/audio/eat1.mp3" });
let eatGhostSound = new Sound({ src: "./src/audio/kill.mp3" });
let player = new Player({
  context,
  position: {
    x: Boundary.cellWidth + Boundary.cellWidth / 2,
    y: Boundary.cellHeight + Boundary.cellHeight / 2,
  },
  velocity: { x: 0, y: 0 },
});

// TILE_SIZE is a square so width / height is the
// same.
// Set the width to the number of colums * tileSize
canvas.width = levelOneMap[0].length * TILE_SIZE;
// Set the height to the number rows * tileSize
canvas.height = levelOneMap.length * TILE_SIZE;

// BEG animation fn
function animate() {
  if (!context) {
    throw new Error("Context is undefined!");
  }
  // Clear the canvas so our last player position is not shown.
  // Only the updated player position
  context.clearRect(0, 0, canvas.width, canvas.height);

  animationId = requestAnimationFrame(animate);

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
        ghost.scared = true;

        setTimeout(() => {
          ghost.blinking = true;
        }, 5000);

        // End ghost being scared altogether
        setTimeout(() => {
          ghost.scared = false;
        }, 10000);
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
      // Eat ghost scenario
      if (ghost.scared) {
        // ghosts.splice(ghostIndex, 1);
        ghost.eaten = true;
        eatGhostSound.play();
      } else {
        loseGameSound.play();
        cancelAnimationFrame(animationId);
      }
    }
  }

  // Win condition
  if (pellets.length === 0) {
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
      if (player.madeTheFirstMove) {
        eatPelletSound.play();
      }
      if (!scoreElement) {
        console.error("Score element is missing!");
        return;
      } else {
        scoreElement.innerHTML = score.toString();
      }
    }
  }

  // Detect player / boundary collision
  boundaries.forEach((boundary) => {
    boundary.draw();

    if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });

  player.draw();

  if (!paused) {
    player.update();
  }

  ghosts.forEach((ghost) => {
    ghost.draw();
    if (!paused) {
      ghost.update();
    }
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
}
// END animation fn

// Start game

initGameArea({
  boundaries,
  context,
  pellets,
  powerUps,
});

animate();

// Event Listeners
const restartButton = document.getElementById("reset-button");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    // Add restart logic here
    paused = true;
    ghosts = [];
    pellets = [];
    ghosts = retrieveGhosts(context);
    player = new Player({
      context,
      position: {
        x: Boundary.cellWidth + Boundary.cellWidth / 2,
        y: Boundary.cellHeight + Boundary.cellHeight / 2,
      },
      velocity: { x: 0, y: 0 },
    });
    // End the animation
    cancelAnimationFrame(animationId);

    // Reset the game board

    initGameArea({
      boundaries,
      context,
      pellets,
      powerUps,
    });

    // Prepare to restart by resetting 'pause' info
    restartButton.innerHTML = "pause";
    paused = false;

    // Finally, animate (restart)
    animate();
  });
}

const pauseButton = document.getElementById("pause-button");

if (pauseButton) {
  pauseButton.addEventListener("click", () => {
    if (!paused) {
      pauseButton.innerHTML = "resume";
      paused = true;
    } else if (paused) {
      pauseButton.innerHTML = "pause";
      paused = false;
    }
  });
}

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowUp":
      if (!player.madeTheFirstMove) {
        player.madeTheFirstMove = true;
      }
      keys.ArrowUp.pressed = true;
      lastKey = "ArrowUp";
      break;
    case "ArrowDown":
      if (!player.madeTheFirstMove) {
        player.madeTheFirstMove = true;
      }
      keys.ArrowDown.pressed = true;
      lastKey = "ArrowDown";
      break;
    case "ArrowLeft":
      if (!player.madeTheFirstMove) {
        player.madeTheFirstMove = true;
      }
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
