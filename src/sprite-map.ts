import { ObstacleType, SpriteEntityTypes as SpriteGhostTypes } from "./types";

export const spriteGhosts: SpriteGhostTypes = {
  blinky: {
    top: [0, 0] as const,
    right: [1, 0] as const,
    bottom: [1, 1] as const,
    left: [0, 1] as const,
  },
  inky: {
    top: [2, 2] as const,
    right: [3, 2] as const,
    bottom: [3, 3] as const,
    left: [2, 3] as const,
  },
  pinky: {
    top: [0, 2] as const,
    right: [3, 0] as const,
    bottom: [3, 1] as const,
    left: [2, 1] as const,
  },
  clyde: {
    top: [2, 0] as const,
    right: [1, 2] as const,
    bottom: [1, 3] as const,
    left: [0, 3] as const,
  },
  eaten: {
    top: [4, 2] as const,
    right: [5, 2] as const,
    bottom: [5, 3] as const,
    left: [4, 3] as const,
  },
  scared: {
    top: [9, 0] as const,
    right: [9, 0] as const,
    bottom: [9, 0] as const,
    left: [9, 0] as const,
  },
  flash: {
    top: [8, 0] as const,
    right: [8, 0] as const,
    bottom: [8, 0] as const,
    left: [8, 0] as const,
  },
};

const obstacles: ObstacleType = {
  pipeHorizontal: [6, 4] as const,
  pipeVertical: [7, 5] as const,
  pipeCorner1: [9, 3] as const,
  pipeCorner2: [9, 4] as const,
  pipeCorner3: [7, 4] as const,
  pipeCorner4: [8, 4] as const,
  block: [9, 5] as const,
  capLeft: [4, 4] as const,
  capRight: [5, 4] as const,
  capBottom: [3, 4] as const,
  capTop: [8, 5] as const,
  pipeCross: [6, 5] as const,
  pipeConnectorTop: [8, 3] as const,
  pipeConnectorRight: [5, 5] as const,
  pipeConnectorBottom: [6, 3] as const,
  pipeConnectorLeft: [7, 3] as const,
  pipeConnectorDownward: [6, 3] as const,
  upperLeftHalfBlock: [9, 1] as const,
  upperRighttHalfBlock: [8, 1] as const,
  bottomLeftHalfBlock: [9, 2] as const,
  bottomRightHalfBlock: [8, 2] as const,
  topOnlyBar: [6, 2] as const,
  bottomOnlyBar: [7, 2] as const,
  leftOnlyBar: [4, 5] as const,
  rightOnlyBar: [3, 5] as const,
};

export const spriteEntities = {
  ...obstacles,
  ...spriteGhosts,
};
