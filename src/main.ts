import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { retrieveGhosts } from "./ghosts";
import { handleCharacterMovement } from "./handle-character-movement";
import { handleGhosts } from "./handle-ghosts";
import { handleKeydown } from "./handle-keydown";
import { handleKeyup } from "./handle-keyup";
import { handleNextLevelClick } from "./handle-next-level-click";
import { handlePellets } from "./handle-pellets";
import { handlePowerUps } from "./handle-power-ups";
import { handlePrevLevelClick } from "./handle-prev-level-click";
import { initGameArea } from "./init-game-area";
import { pacMaps } from "./level-maps";
import { Player } from "./player-class";
import { Sound } from "./sound-class";
import { Timer } from "./timer-class";
import type { ConfigType, KeyType } from "./types";

// const activeSec = 10;
// const expireWarningSec = 3;

export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level-info");
const timeoutButton = document.getElementById("timeout-button");

const context = canvas.getContext("2d");
if (!context) {
  throw new Error("Context is undefined");
}
if (!scoreElement) {
  throw new Error("Score element is undefined");
}

// let pellets: Pellet[] = [];
// let boundaries: Boundary[] = [];
let gates: Boundary[] = [];
let animationId = 0;
let config: ConfigType = {
  boundaries: [],
  ghosts: [],
  keys: {
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
  },
  level: "one",
  map: "levelOneMap",
  pacmanLives: 2,
  paused: true,
  pellets: [],
  player: new Player({
    context,
    position: {
      x: TILE_SIZE + TILE_SIZE / 2,
      y: TILE_SIZE + TILE_SIZE / 2,
    },
    velocity: { x: 0, y: 0 },
  }),
  powerUps: [],
  powerDotActiveSeconds: 10,
  powerDotExpireWarningSec: 3,
  score: 0,
};
config.ghosts = retrieveGhosts({ context, map: config.map });

let lastKey: { value: KeyType } = { value: "" };
let loseGameSound = new Sound({ src: "./src/audio/death.mp3" });
let eatPelletSound = new Sound({ src: "./src/audio/waka.wav" });
let eatGhostSound = new Sound({ src: "./src/audio/kill.mp3" });
let eatPowerUpSound = new Sound({ src: "./src/audio/power_dot.wav" });

const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");

function handleToggleModal() {
  if (modal) {
    modal.classList.toggle("show-modal");
  }
}

function handleWindowOnClick(event: MouseEvent) {
  if (event.target === modal) {
    handleToggleModal();
  }
}

const restartButton = document.getElementById("reset-button");
const pauseButton = document.getElementById("pause-button");
const nextLevelButton = document.getElementById("next-level-button");
const prevLevelButton = document.getElementById("prev-level-button");

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
  handleCharacterMovement({
    config,
    gates,
    lastKey,
  });
  // END Character movement

  // Draw powerUps Detect power ups collison
  handlePowerUps({
    eatPowerUpSound,
    config,
    scoreElement,
  });

  // Ghost & player collision
  config.ghosts.forEach((ghost) => {
    // Lose game scenario
    if (
      Math.hypot(
        ghost.position.x - config.player.position.x,
        ghost.position.y - config.player.position.y
      ) <
        ghost.radius + config.player.radius &&
      ghost.behavior === "default"
      // !ghost.scared &&
      // !ghost.eaten
    ) {
      handleToggleModal();
      loseGameSound.play();
      cancelAnimationFrame(animationId);
    } else if (
      // Eat ghost scenario
      Math.hypot(
        ghost.position.x - config.player.position.x,
        ghost.position.y - config.player.position.y
      ) <
        ghost.radius + config.player.radius &&
      (ghost.behavior === "scared" || ghost.behavior === "blinking")
    ) {
      ghost.behavior = "eaten";
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;
      config.score += 30;
      eatGhostSound.play();
    }
  });

  // Win level condition
  if (config.pellets.length === 0) {
    // cancelAnimationFrame(animationId);
    switch (config.level) {
      case "one":
        config.paused = true;
        initGameArea({
          canvas,
          config: { ...config, level: "two" },
          context,
          gates,
        });

        config.paused = false;
        break;
      case "two":
        config.paused = true;
        initGameArea({
          canvas,
          config: { ...config, level: "three" },
          context,
          gates,
        });

        config.paused = false;
        break;
      case "three":
        let modalTitle = document.getElementById("modal-title");
        if (modalTitle) {
          modalTitle.innerHTML = "Congrats you WIN!!!";

          handleToggleModal();
        }
        break;
    }

    // TODO: 1. Modal congratulations
    // TODO: 2. Generate game board and ghosts for next level.
    // TODO: 3. If it's the final level, end the game.
  }

  // Draw pellets Detect player / pellet collision (eat pellet)
  handlePellets({
    eatPelletSound,
    config,
    scoreElement,
  });

  // Detect player / boundary collision
  config.boundaries.forEach((boundary) => {
    boundary.draw();

    if (
      circleCollidesWithRectangle({
        circle: config.player,
        rectangle: boundary,
      })
    ) {
      config.player.velocity.x = 0;
      config.player.velocity.y = 0;
    }
  });

  gates.forEach((gate) => {
    gate.draw();
  });

  config.player.draw();

  if (!config.paused) {
    config.player.update(pacMaps[config.map][0].length * TILE_SIZE);
  }

  // BEGIN HANDLE GHOSTS
  handleGhosts({
    animationId,
    config,
    context,
    mapHeight: pacMaps[config.map].length * TILE_SIZE,
    mapWidth: pacMaps[config.map][0].length * TILE_SIZE,
  });
  // END HANDLE GHOSTS

  // Rotate player depending on which direction
  // the player is moving
  if (config.player.velocity.x > 0) {
    config.player.rotation = 0;
  } else if (config.player.velocity.x < 0) {
    config.player.rotation = Math.PI;
  } else if (config.player.velocity.y > 0) {
    config.player.rotation = Math.PI / 2;
  } else if (config.player.velocity.y < 0) {
    config.player.rotation = Math.PI * 1.5;
  }
}
// END animation fn

// Start game

initGameArea({
  canvas,
  config,
  context,
  gates,
});

animate();

// Event Listeners

if (restartButton) {
  restartButton.addEventListener("click", () => {
    // Add restart logic here
    config.ghosts = [];
    config.pellets = [];
    config.powerUps = [];
    config.ghosts = retrieveGhosts({ context, map: config.map });
    config.player = new Player({
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
      canvas,
      config,
      context,
      gates,
    });

    // Prepare to restart by resetting 'pause' info
    config.paused = true;
    config.score = 0;

    // Switch pause button text based on state
    if (pauseButton) {
      if (config.paused) {
        pauseButton.innerHTML = "resume";
      }
      if (!config.paused) {
        pauseButton.innerHTML = "pause";
      }
    }

    // Finally, animate (restart)
    animate();
  });
}
if (pauseButton) {
  pauseButton.addEventListener("click", () => {
    if (!config.paused) {
      // powerDotTimer.resume();
      pauseButton.innerHTML = "resume";
      config.paused = true;
    } else if (config.paused) {
      // powerDotTimer.pause();
      pauseButton.innerHTML = "pause";
      config.paused = false;
    }
  });
}
if (nextLevelButton && pauseButton && levelElement) {
  nextLevelButton.addEventListener("click", () => {
    handleNextLevelClick({
      animate,
      animationId,
      canvas,
      config,
      context,
      gates,
      levelElement,
      pauseButton,
    });
  });
}

if (prevLevelButton && pauseButton && levelElement) {
  prevLevelButton.addEventListener("click", () => {
    handlePrevLevelClick({
      animate,
      animationId,
      canvas,
      config,
      context,
      gates,
      levelElement,
      pauseButton,
    });
  });
}

if (timeoutButton) {
  timeoutButton.addEventListener("click", () => {
    config.ghosts.forEach((ghost) => {
      ghost.behavior = "scared";
    });
    const timer = new Timer(() => {
      config.player.powerUpActive = false;
      config.player.powerUpAboutToExpire = false;
      config.ghosts.forEach((ghost) => {
        // ghost.blinking = false;
        // ghost.scared = false;
        ghost.behavior = "default";
      });
      console.log("TIMER!!!", 1000 * config.powerDotActiveSeconds);
    }, 1000 * config.powerDotActiveSeconds);

    timer.resume();
  });
}

addEventListener("keydown", ({ key }) => {
  handleKeydown({ config, key, lastKey });
});

addEventListener("keyup", ({ key }) => {
  handleKeyup({ config, key });
});

addEventListener("click", handleWindowOnClick);

if (closeButton) {
  closeButton.addEventListener("click", handleToggleModal);
}
