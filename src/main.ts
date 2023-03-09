import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { retrieveGhosts } from "./ghosts";
import { handleCharacterMovement } from "./handle-character-movement";
import { handleGhosts } from "./handle-ghosts";
import { handleKeydown } from "./handle-keydown";
import { handleKeyup } from "./handle-keyup";
import { handlePellets } from "./handle-pellets";
import { handlePowerUps } from "./handle-power-ups";
import { initGameArea } from "./init-game-area";
import { levelTwoMap } from "./level-maps";
import { Pellet } from "./pellet-class";
import { Player } from "./player-class";
import { PowerUp } from "./power-up-class";
import { Sound } from "./sound-class";
import type { KeysRegisterType, KeyType } from "./types";

const activeSec = 10;
const expireWarningSec = 3;

export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const scoreElement = document.getElementById("score");

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Context is undefined");
}
if (!scoreElement) {
  throw new Error("Score element is undefined");
}

let keys: KeysRegisterType = {
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};
let paused = true;
let pellets: Pellet[] = [];
let boundaries: Boundary[] = [];
let gates: Boundary[] = [];
let powerUps: PowerUp[] = [];
let animationId = 0;
let config = { score: 0 };
let lastKey: { value: KeyType } = { value: "" };
let ghosts = retrieveGhosts({ context, map: "levelTwoMap" });
let pacmanLives = { value: 2 };

let loseGameSound = new Sound({ src: "./src/audio/death.mp3" });
// let eatPelletSound = new Sound({ src: "./src/audio/eat1.mp3" });
let eatPelletSound = new Sound({ src: "./src/audio/waka.wav" });
let eatGhostSound = new Sound({ src: "./src/audio/kill.mp3" });
let eatPowerUpSound = new Sound({ src: "./src/audio/power_dot.wav" });
let player = new Player({
  context,
  position: {
    x: Boundary.cellWidth + Boundary.cellWidth / 2,
    y: Boundary.cellHeight + Boundary.cellHeight / 2,
  },
  velocity: { x: 0, y: 0 },
});

// const trigger = document.querySelector(".trigger");
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function toggleModal() {
  if (modal) {
    modal.classList.toggle("show-modal");
  }
}

function windowOnClick(event: MouseEvent) {
  if (event.target === modal) {
    toggleModal();
  }
}

// let powerDotTimer = new Timer(function () {
//   player.powerUpActive = false;
//   player.powerUpAboutToExpire = false;
//   ghosts.forEach((ghost) => {
//     ghost.blinking = false;
//     ghost.scared = false;
//     ghost.eaten = false;
//   });
//   console.log("TIMER!!!");
// }, 1000 * activeSec);

let powerDotTimer = setTimeout(() => {
  player.powerUpActive = false;
  player.powerUpAboutToExpire = false;
  ghosts.forEach((ghost) => {
    ghost.blinking = false;
    ghost.scared = false;
    // ghost.eaten = false;
  });
  console.log("TIMER!!!", 1000 * activeSec);
}, 1000 * activeSec);

// let powerDotAboutToExpireTimer = new Timer(() => {
//   player.powerUpAboutToExpire = true;
// }, 1000 * expireWarningSec);

let powerDotAboutToExpireTimer = setTimeout(() => {
  player.powerUpAboutToExpire = true;
}, 1000 * expireWarningSec);

// TILE_SIZE is a square so width / height is the
// same.
// Set the width to the number of colums * tileSize
canvas.width = levelTwoMap[0].length * TILE_SIZE;
// Set the height to the number rows * tileSize
canvas.height = levelTwoMap.length * TILE_SIZE;

const restartButton = document.getElementById("reset-button");
const pauseButton = document.getElementById("pause-button");

// BEG animation fn
function animate() {
  if (!context) {
    throw new Error("Context is undefined!");
  }
  // Clear the canvas so our last player position is not shown.
  // Only the updated player position
  context.clearRect(0, 0, canvas.width, canvas.height);

  animationId = requestAnimationFrame(animate);

  // BEGIN Character movement
  handleCharacterMovement({ keys, gates, boundaries, lastKey, player });
  // END Character movement

  // Draw powerUps Detect power ups collison
  handlePowerUps({
    player,
    powerUps,
    eatPowerUpSound,
    ghosts,
    powerDotAboutToExpireTimer,
    powerDotTimer,
    config,
    scoreElement,
  });

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
      if (ghost.scared && !ghost.eaten) {
        ghost.eaten = true;
        config.score += 30;
        eatGhostSound.play();
      } else if (ghost.scared && ghost.eaten) {
        // DO NOTHING
      } else {
        toggleModal();
        loseGameSound.play();
        cancelAnimationFrame(animationId);
      }
    }
  }

  // Win level condition
  if (pellets.length === 0) {
    cancelAnimationFrame(animationId);
    // TODO: 1. Modal congratulations
    // TODO: 2. Generate game board and ghosts for next level.
    // TODO: 3. If it's the final level, end the game.
  }

  // Draw pellets Detect player / pellet collision (eat pellet)
  handlePellets({
    eatPelletSound,
    pellets,
    player,
    config,
    scoreElement,
  });

  // Detect player / boundary collision
  boundaries.forEach((boundary) => {
    boundary.draw();

    if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  });

  gates.forEach((gate) => {
    gate.draw();
  });

  player.draw();

  if (!paused) {
    player.update(levelTwoMap[0].length * TILE_SIZE);
  }

  // BEGIN HANDLE GHOSTS
  handleGhosts({
    animationId,
    boundaries,
    context,
    ghosts,
    paused,
    player,
    mapHeight: levelTwoMap.length * TILE_SIZE,
    mapWidth: levelTwoMap[0].length * TILE_SIZE,
  });
  // END HANDLE GHOSTS

  // Rotate player depending on which direction
  // the player is moving
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
  gates,
  pellets,
  powerUps,
});

animate();

// Event Listeners

if (restartButton) {
  restartButton.addEventListener("click", () => {
    // Add restart logic here

    ghosts = [];
    pellets = [];
    ghosts = retrieveGhosts({ context, map: "levelTwoMap" });
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
      gates,
      pellets,
      powerUps,
    });

    // Prepare to restart by resetting 'pause' info
    paused = true;
    config.score = 0;

    if (pauseButton) {
      if (paused) {
        pauseButton.innerHTML = "resume";
      }
      if (!paused) {
        pauseButton.innerHTML = "pause";
      }
    }

    // Finally, animate (restart)
    animate();
  });
}

if (pauseButton) {
  pauseButton.addEventListener("click", () => {
    if (!paused) {
      // powerDotTimer.resume();
      pauseButton.innerHTML = "resume";
      paused = true;
    } else if (paused) {
      // powerDotTimer.pause();
      pauseButton.innerHTML = "pause";
      paused = false;
    }
  });
}

addEventListener("keydown", ({ key }) => {
  handleKeydown({ key, keys, lastKey, player });
});

addEventListener("keyup", ({ key }) => {
  handleKeyup({ key, keys });
});

addEventListener("click", windowOnClick);

if (closeButton) {
  closeButton.addEventListener("click", toggleModal);
}
