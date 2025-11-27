import PF from "pathfinding";
import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { convertSymbolMapToPathMatrix } from "./convert-symbol-map-to-path-matrix";
import { Ghost } from "./ghost-class";
import { Player } from "./player-class";
import { CollisionType, PathfinderResultType } from "./types";

// BEGIN types
type HandleGhostsArgsType = {
  animationId: number;
  boundaries: Boundary[];
  context: CanvasRenderingContext2D;
  gates: Boundary[];
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
  gates,
  ghosts,
  paused,
  mapHeight,
  mapWidth,
  player,
}: HandleGhostsArgsType) {
  // Level two Ghost pen coordinates
  const ghostPenPos = {
    x: 13,
    y: 13,
  };

  const matrix = convertSymbolMapToPathMatrix({ mapName: "levelTwoMap" });

  const pfGrid = new PF.Grid(matrix);

  const pathFinder = new PF.AStarFinder({
    heuristic: PF.Heuristic.manhattan,
  });

  ghosts.forEach((ghost) => {
    ghost.draw(context, player);
    if (!paused) {
      ghost.update(context, player, mapHeight, mapWidth);
    } // if

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
        } // switch

        ghost.prevCollisions = [];
      } // if
    } // if

    // Draw ghost path for new ghosts
    if (ghost.eaten && ghost.ghostPenPath.length === 0) {
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
      ghost.ghostPenPath = path;

      // END A STAR
    } // if

    // Make eaten ghosts move to the pen
    if (ghost.eaten && ghost.ghostPenPath.length > 0) {
      // cancelAnimationFrame(animationId);
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;

      /** An array of tuples of type [number, number] */
      const waypoint = ghost.ghostPenPath[ghost.ghostPenPathIndex];
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
        ghost.ghostPenPathIndex < ghost.ghostPenPath.length - 1
      ) {
        ghost.ghostPenPathIndex++;
      }
      // Ghost re-spawn condition
      if (
        ghost.position.x === xPixel &&
        ghost.position.y === yPixel &&
        ghost.ghostPenPathIndex === ghost.ghostPenPath.length - 1
      ) {
        ghost.scared = false;
        ghost.blinking = false;
        ghost.eaten = false;
        ghost.ghostPenPath = [];
        ghost.ghostPenPathIndex = 0;
        ghost.velocity.x = 0;
        ghost.velocity.y = 0;
      }

      // Boundary.cellWidth * pinky.x + Boundary.cellWidth / 2;
      // Ghost has reach the goal
      if (
        Math.floor(ghost.position.x / TILE_SIZE) ===
          Math.floor(ghostPenPos.x + TILE_SIZE / 2) &&
        Math.floor(ghost.position.y / TILE_SIZE) ===
          Math.floor(ghostPenPos.y + TILE_SIZE / 2)
      ) {
        ghost.eaten = false;
        ghost.scared = false;
        ghost.blinking = false;
        console.log("GOOOOOAAAAAAAL");
      }
    } // if
  }); // ghosts.forEach
  // END Ghost movement
}
