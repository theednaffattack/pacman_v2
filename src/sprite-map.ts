import { ObstacleType, GhostEntityTypes as SpriteGhostTypes } from "./types";

export const spriteGhosts: SpriteGhostTypes = {
  blinky: {
    top: [0, 0],
    right: [1, 0],
    bottom: [1, 1],
    left: [0, 1],
  },
  inky: {
    top: [2, 2],
    right: [3, 2],
    bottom: [3, 3],
    left: [2, 3],
  },
  pinky: {
    top: [0, 2],
    right: [3, 0],
    bottom: [3, 1],
    left: [2, 1],
  },
  clyde: {
    top: [2, 0],
    right: [1, 2],
    bottom: [1, 3],
    left: [0, 3],
  },
  eaten: {
    top: [4, 2],
    right: [5, 2],
    bottom: [5, 3],
    left: [4, 3],
  },
  scared: {
    top: [9, 0],
    right: [9, 0],
    bottom: [9, 0],
    left: [9, 0],
  },
  flash: {
    top: [8, 0],
    right: [8, 0],
    bottom: [8, 0],
    left: [8, 0],
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
