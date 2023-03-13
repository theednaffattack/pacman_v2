import { TILE_SIZE } from "./constants";
import { Ghost } from "./ghost-class";

export function followPathOLD({ ghost }: { ghost: Ghost }) {
  if (ghost.behavior === "eaten" && ghost.ghostPenEntryPath.length > 0) {
    // cancelAnimationFrame(animationId);

    /** An array of tuples of type [number, number] */
    const waypoint = ghost.ghostPenEntryPath[ghost.ghostPenEntryPathIndex];
    const xPixel = waypoint[0] * TILE_SIZE + TILE_SIZE / 2;
    const yPixel = waypoint[1] * TILE_SIZE + TILE_SIZE / 2;

    // Go left
    if (ghost.position.y === yPixel && ghost.position.x > xPixel) {
      ghost.velocity.y = 0;
      ghost.velocity.x = -ghost.speed;
      console.log("WHAT IS THIS", {
        xPixel,
        x: ghost.position.x,
        yPixel,
        y: ghost.position.y,
      });

      // Go right
    } else if (ghost.position.y === yPixel && ghost.position.x < xPixel) {
      ghost.velocity.y = 0;
      ghost.velocity.x = ghost.speed;
      // Go up
    } else if (ghost.position.x === xPixel && ghost.position.y > yPixel) {
      ghost.velocity.x = 0;
      ghost.velocity.y = -ghost.speed;
      // Go down
    } else if (ghost.position.x === xPixel && ghost.position.y < yPixel) {
      ghost.velocity.x = 0;
      ghost.velocity.y = ghost.speed;
    }
    // else {
    //   ghost.velocity.x = 0;
    //   ghost.velocity.y = 0;
    // }

    // If the ghost is exactly on the grid square described
    // by the waypoint and if there's a next waypoint on
    // our list of waypoints, iterate to the next waypoint set.
    if (
      ghost.position.x === xPixel &&
      ghost.position.y === yPixel &&
      ghost.ghostPenEntryPathIndex < ghost.ghostPenEntryPath.length - 1
    ) {
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;
      ghost.ghostPenEntryPathIndex++;
    }
    // Ghost re-spawn condition
    if (
      ghost.position.x === xPixel &&
      ghost.position.y === yPixel &&
      ghost.ghostPenEntryPathIndex === ghost.ghostPenEntryPath.length - 1
    ) {
      // ghost.scared = false;
      // ghost.blinking = false;
      // ghost.eaten = false;
      ghost.behavior = "default";
      ghost.ghostPenEntryPath = [];
      ghost.ghostPenEntryPathIndex = 0;
      ghost.exitingPen = true;
    }
  }
}
