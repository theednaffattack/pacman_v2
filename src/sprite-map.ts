import { ObstacleType, GhostEntityTypes as SpriteGhostTypes } from "./types";

export const spriteGhosts: SpriteGhostTypes = {
  blinky: {
    up: [0, 0],
    right: [1, 0],
    down: [1, 1],
    left: [0, 1],
    stationary: [1, 0],
  },
  inky: {
    up: [2, 2],
    right: [3, 2],
    down: [3, 3],
    left: [2, 3],
    stationary: [3, 2],
  },
  pinky: {
    up: [2, 0],
    right: [3, 0],
    down: [3, 1],
    left: [2, 1],
    stationary: [3, 0],
  },
  clyde: {
    up: [0, 2],
    right: [1, 2],
    down: [1, 3],
    left: [0, 3],
    stationary: [1, 2],
  },
  eaten: {
    up: [4, 2],
    right: [5, 2],
    down: [5, 3],
    left: [4, 3],
    stationary: [5, 2],
  },
  scared: {
    up: [9, 0],
    right: [9, 0],
    down: [9, 0],
    left: [9, 0],
    stationary: [9, 0],
  },
  blinking: {
    up: [8, 0],
    right: [8, 0],
    down: [8, 0],
    left: [8, 0],
    stationary: [8, 0],
  },
};

const obstacles: ObstacleType = {
  pipeHorizontal: [6, 4],
  pipeVertical: [7, 5],
  pipeCorner1: [9, 3],
  pipeCorner2: [9, 4],
  pipeCorner3: [7, 4],
  pipeCorner4: [8, 4],
  block: [9, 5],
  capLeft: [4, 4],
  capRight: [5, 4],
  capBottom: [3, 4],
  capTop: [8, 5],
  pipeCross: [6, 5],
  pipeConnectorTop: [8, 3],
  pipeConnectorRight: [5, 5],
  pipeConnectorBottom: [6, 3],
  pipeConnectorLeft: [7, 3],
  pipeConnectorDownward: [6, 3],
  upperLeftHalfBlock: [9, 1],
  upperRightHalfBlock: [8, 1],
  bottomLeftHalfBlock: [9, 2],
  bottomRightHalfBlock: [8, 2],
  topOnlyBar: [6, 2],
  bottomOnlyBar: [7, 2],
  leftOnlyBar: [4, 5],
  rightOnlyBar: [3, 5],
  ghostGate: [2, 4],
};

export const spriteEntities = {
  ...obstacles,
  ...spriteGhosts,
};

export const otherEntities = {
  pellet: [50, 50],
  powerUp: [50, 50],
  space: [50, 50],
};

export const mapEntities = { ...spriteEntities, ...otherEntities };
