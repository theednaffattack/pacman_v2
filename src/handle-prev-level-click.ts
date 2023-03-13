import { TILE_SIZE } from "./constants";
import { Gates } from "./gates-class";
import { retrieveGhosts } from "./ghosts";
import { initGameArea } from "./init-game-area";
import { Player } from "./player-class";
import { ConfigType } from "./types";

type PrevLevelClickAgsType = {
  animate: () => void;
  animationId: number;
  canvas: HTMLCanvasElement;
  config: ConfigType;
  context: CanvasRenderingContext2D;
  gates: Gates[];
  levelElement: HTMLElement;
  pauseButton: HTMLElement;
};

export function handlePrevLevelClick({
  animate,
  animationId,
  canvas,
  config,
  context,
  gates,
  levelElement,
  pauseButton,
}: PrevLevelClickAgsType) {
  switch (config.level) {
    case "one":
      // do nothing
      break;
    case "two":
      config.map = "levelOneMap";
      config.level = "one";
      levelElement.innerHTML = "1";

      break;
    case "three":
      config.map = "levelTwoMap";
      config.level = "two";
      levelElement.innerHTML = "2";
      break;
  }

  // Add restart logic here

  config.boundaries = [];
  config.ghosts = [];
  config.pellets = [];
  config.powerUps = [];
  config.ghosts = retrieveGhosts({ context, map: config.map });
  config.player = new Player({
    context,
    position: {
      x: TILE_SIZE + TILE_SIZE / 2,
      y: TILE_SIZE + TILE_SIZE / 2,
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
}
