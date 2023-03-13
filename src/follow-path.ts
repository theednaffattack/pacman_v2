import { TILE_SIZE } from "./constants";
import { Ghost } from "./ghost-class";

export function followPath({ ghost }: { ghost: Ghost }) {
  // First map over our path and convert values to pixels.
  // Also transform from 2d array to an array of objects.
  const waypoints = ghost.ghostPenEntryPath.map((waypoint) => {
    return {
      x: waypoint[0] * TILE_SIZE + TILE_SIZE / 2,
      y: waypoint[1] * TILE_SIZE + TILE_SIZE / 2,
    };
  });

  // Select each waypoint one-by-one to move ghost along
  // each path segment.
  const waypoint = waypoints[ghost.ghostPenEntryPathIndex];
  const xDistance = waypoint.x - ghost.position.x;
  const yDistance = waypoint.y - ghost.position.y;

  if (xDistance === 0 && yDistance < 0) {
    ghost.direction = "up";
  } else if (xDistance === 0 && yDistance > 0) {
    ghost.direction = "down";
  } else if (yDistance === 0 && xDistance < 0) {
    ghost.direction = "left";
  } else if (yDistance === 0 && xDistance > 0) {
    ghost.direction = "right";
  } else if (xDistance === 0 && yDistance === 0) {
    ghost.direction = "stationary";
  }

  switch (ghost.direction) {
    case "up":
      ghost.velocity.y = -ghost.speed;
      break;
    case "down":
      ghost.velocity.y = ghost.speed;
      break;
    case "left":
      ghost.velocity.x = -ghost.speed;
      break;
    case "right":
      ghost.velocity.x = ghost.speed;
      break;
    case "stationary":
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;
      break;
  }

  // If the ghost has reached the waypoint than move to
  // the next waypoint.
  if (
    ghost.position.x === waypoint.x &&
    ghost.position.y === waypoint.y &&
    ghost.ghostPenEntryPathIndex < waypoints.length - 1
  ) {
    ghost.ghostPenEntryPathIndex++;
  }

  // Ghost re-spawn condition at the end of the path
  if (
    ghost.direction === "stationary" &&
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
