import PF from "pathfinding";
import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { convertSymbolMapToPathMatrix } from "./convert-symbol-map-to-path-matrix";
import { Ghost } from "./ghost-class";
import { ghostExitPen } from "./ghost-exit-pen";
import { Player } from "./player-class";
import { CollisionType, PathfinderResultType } from "./types";

// Level two Ghost pen coordinates
const ghostPenPos = {
  x: 13,
  y: 13,
};

// BEGIN types

type HandleGhostsArgsType = {
  animationId: number;
  boundaries: Boundary[];
  context: CanvasRenderingContext2D;
  ghosts: Ghost[];
  paused: boolean;
  mapHeight: number;
  mapWidth: number;
  player: Player;
};

// END types

export function handleGhosts({
  animationId,
  boundaries,
  context,
  ghosts,
  paused,
  mapHeight,
  mapWidth,
  player,
}: HandleGhostsArgsType) {
  const matrix = convertSymbolMapToPathMatrix({ mapName: "levelTwoMap" });

  const pfGrid = new PF.Grid(matrix);

  const pathFinder = new PF.AStarFinder({
    heuristic: PF.Heuristic.manhattan,
  });

  ghosts.forEach((ghost) => {
    ghost.draw(context, player);
    if (!paused) {
      ghost.update(context, player, mapHeight, mapWidth);
    }

    const collisions: CollisionType[] = [];

    // BEGIN Ghost movement
    if (!ghost.eaten) {
      boundaries.forEach((boundary) => {
        // Test if our ghost will collide to the top
        if (
          !collisions.includes("top") &&
          circleCollidesWithRectangle({
            circle: {
              ...ghost,
              velocity: {
                x: 0,
                y: -ghost.speed,
              },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("top");
        }
        // Test if our ghost will collide to the right
        if (
          !collisions.includes("right") &&
          circleCollidesWithRectangle({
            circle: {
              ...ghost,
              velocity: {
                x: ghost.speed,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("right");
        }

        // Test if our ghost will collide to the bottom
        if (
          !collisions.includes("bottom") &&
          circleCollidesWithRectangle({
            circle: {
              ...ghost,
              velocity: {
                x: 0,
                y: ghost.speed,
              },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("bottom");
        }

        // Test if our ghost will collide to the left
        if (
          !collisions.includes("left") &&
          circleCollidesWithRectangle({
            circle: {
              ...ghost,
              velocity: {
                x: -ghost.speed,
                y: 0,
              },
            },
            rectangle: boundary,
          })
        ) {
          collisions.push("left");
        }
      });

      if (collisions.length > ghost.prevCollisions.length) {
        ghost.prevCollisions = collisions;
      }

      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        if (ghost.velocity.y < 0) {
          ghost.prevCollisions.push("top");
        } else if (ghost.velocity.x > 0) {
          ghost.prevCollisions.push("right");
        } else if (ghost.velocity.y > 0) {
          ghost.prevCollisions.push("bottom");
        } else if (ghost.velocity.x < 0) {
          ghost.prevCollisions.push("left");
        }

        const pathways = ghost.prevCollisions.filter((collision) => {
          return !collisions.includes(collision);
        });

        const direction = pathways[Math.floor(Math.random() * pathways.length)];

        switch (direction) {
          case "top":
            ghost.velocity.y = -ghost.speed;
            ghost.velocity.x = 0;
            break;

          case "right":
            ghost.velocity.y = 0;
            ghost.velocity.x = ghost.speed;
            break;

          case "bottom":
            ghost.velocity.y = ghost.speed;
            ghost.velocity.x = 0;

            break;

          case "left":
            ghost.velocity.y = 0;
            ghost.velocity.x = -ghost.speed;
            break;
        }

        ghost.prevCollisions = [];
      }
    }

    // Draw ghost path for new ghosts
    if (ghost.eaten && ghost.ghostPenEntryPath.length === 0) {
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;

      // Convert pixel position to grid position
      const xGrid = Math.floor(ghost.position.x / TILE_SIZE);
      const yGrid = Math.floor(ghost.position.y / TILE_SIZE);

      // BEGIN A* (STAR)
      // If the ghost is eaten then find the shortest
      // path to the ghost pen

      const path: PathfinderResultType = pathFinder.findPath(
        xGrid,
        yGrid,
        ghostPenPos.x,
        ghostPenPos.y,
        pfGrid
      );

      // Set the ghost's return path to the
      // ghost pen
      // ghostEatenPaths[ghost.name] = path;
      ghost.ghostPenEntryPath = path;

      // END A STAR
    }
    // Make eaten ghosts move to the pen
    if (ghost.eaten && ghost.ghostPenEntryPath.length > 0) {
      // cancelAnimationFrame(animationId);
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;

      /** An array of tuples of type [number, number] */
      const waypoint = ghost.ghostPenEntryPath[ghost.ghostPenEntryPathIndex];
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
        ghost.ghostPenEntryPathIndex < ghost.ghostPenEntryPath.length - 1
      ) {
        ghost.ghostPenEntryPathIndex++;
      }
      // Ghost re-spawn condition
      if (
        ghost.position.x === xPixel &&
        ghost.position.y === yPixel &&
        ghost.ghostPenEntryPathIndex === ghost.ghostPenEntryPath.length - 1
      ) {
        ghost.scared = false;
        ghost.blinking = false;
        ghost.eaten = false;
        ghost.ghostPenEntryPath = [];
        ghost.ghostPenEntryPathIndex = 0;
        ghost.exitingPen = true;
      }
    }

    // Make recovered ghosts exit the pen (otherwise there are
    // pathfinding bugs)
    if (ghost.exitingPen) {
      ghostExitPen({ ghost, pathFinder, pfGrid });
    }
  });
  // END Ghost movement
}
