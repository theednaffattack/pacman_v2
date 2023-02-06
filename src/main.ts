import { animate } from "./animate";
import { Boundary } from "./boundary-class";
import { Ghost } from "./ghost-class";
import { ghosts } from "./ghosts";
import { init } from "./init";
import { levelOneMap } from "./level-maps";
import { Pellet } from "./pellet-class";
import { Player } from "./player-class";
import { PowerUp } from "./power-up-class";
import { Sound } from "./sound-class";
import type { KeyType } from "./types";

export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

export const scoreElement = document.getElementById("score");

export const context = canvas.getContext("2d");

export let paused = true;

const tileSize = 40;

// set the width to the number of colums * tileSize
canvas.width = levelOneMap[0].length * tileSize;
// Set the height to the number rows * tileSize
canvas.height = levelOneMap.length * tileSize;

export const canvasErrorString = "Canvas context is undefined or null!";

export let pellets: Pellet[] = [];
export let eatPelletSound = new Sound({ src: "./src/audio/eat1.mp3" });
export let boundaries: Boundary[] = [];
export let powerUps: PowerUp[] = [];
// let ghosts: Ghost[];
let score = 0;
let animationId: number = 0;

let player = new Player({
  position: {
    x: Boundary.cellWidth + Boundary.cellWidth / 2,
    y: Boundary.cellHeight + Boundary.cellHeight / 2,
  },
  velocity: { x: 0, y: 0 },
});

export const keys = {
  ArrowUp: { pressed: false },
  ArrowDown: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
};

export let lastKey: KeyType = "";

// Start game
// init({ boundaries, pellets, player, powerUps });

init({
  animationId,
  boundaries,
  // ghosts: [],
  pellets,
  // player: new Player({
  //   position: {
  //     x: Boundary.cellWidth + Boundary.cellWidth / 2,
  //     y: Boundary.cellHeight + Boundary.cellHeight / 2,
  //   },
  //   velocity: { x: 0, y: 0 },
  // }),
  powerUps,
});

animate({ animationId, ghosts, player, score });
const restartButton = document.getElementById("reset-button");

if (restartButton) {
  restartButton.addEventListener("click", () => {
    // Add restart logic here
  });
}

const pauseButton = document.getElementById("pause-button");

// Event Listeners
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
