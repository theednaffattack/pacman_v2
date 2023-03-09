import { TILE_SIZE } from "./constants";
import { Ghost } from "./ghost-class";
import { PathfinderResultType } from "./types";

// BEGIN TYPES

type GhostPenEscapePathsType = {
  left: PathfinderResultType;
  right: PathfinderResultType;
};

// END TYPES

const ghostPenEscapePaths: GhostPenEscapePathsType = {
  left: [
    [13, 13], // start
    [13, 12],
    [13, 11],
    [13, 10],
    [12, 10],
    [11, 10], // finish
  ],
  right: [
    [13, 13], // start
    [13, 12],
    [13, 11],
    [13, 10],
    [14, 10],
    [15, 10], // finish
  ],
};

type GhostExitPenArgsType = {
  ghost: Ghost;
  pathFinder: any;
  pfGrid: any;
};

export function ghostExitPen({
  ghost,
}: // pathFinder,
// pfGrid,
GhostExitPenArgsType) {
  ghost.velocity.x = 0;
  ghost.velocity.y = 0;

  ghost.ghostPenExitPath = ghostPenEscapePaths.left;

  /** An array of tuples of type [number, number] */
  const waypoint = ghost.ghostPenExitPath[ghost.ghostPenExitPathIndex];
  const xPixel = waypoint[0] * TILE_SIZE + TILE_SIZE / 2;
  const yPixel = waypoint[1] * TILE_SIZE + TILE_SIZE / 2;

  // Go left
  if (ghost.position.y === yPixel && ghost.position.x > xPixel) {
    ghost.velocity.y = 0;
    ghost.velocity.x = -ghost.speed;
  }
  // Go right
  if (ghost.position.y === yPixel && ghost.position.x < xPixel) {
    ghost.velocity.y = 0;
    ghost.velocity.x = ghost.speed;
  }
  // Go up
  if (ghost.position.x === xPixel && ghost.position.y > yPixel) {
    ghost.velocity.x = 0;
    ghost.velocity.y = -ghost.speed;
  }
  // Go down
  if (ghost.position.x === xPixel && ghost.position.y < yPixel) {
    ghost.velocity.x = 0;
    ghost.velocity.y = ghost.speed;
  }

  // If the ghost is exactly on the grid square described
  // by the waypoint and if there's a next waypoint on
  // our list of waypoints, iterate to the next waypoint set.
  if (
    ghost.position.x === xPixel &&
    ghost.position.y === yPixel &&
    ghost.ghostPenExitPathIndex < ghost.ghostPenExitPath.length - 1
  ) {
    ghost.ghostPenExitPathIndex++;
  }
  // Ghost re-spawn condition
  if (
    ghost.position.x === xPixel &&
    ghost.position.y === yPixel &&
    ghost.ghostPenExitPathIndex === ghost.ghostPenExitPath.length - 1
  ) {
    ghost.exitingPen = false;
    ghost.ghostPenExitPath = [];
    ghost.ghostPenExitPathIndex = 0;
    ghost.velocity.x = -ghost.speed;
  }
}
