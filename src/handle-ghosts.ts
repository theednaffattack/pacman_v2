import PF from "pathfinding";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { convertSymbolMapToPathMatrix } from "./convert-symbol-map-to-path-matrix";
import { followPath } from "./follow-path";
import { ghostExitPen } from "./ghost-exit-pen";
import { CollisionType, ConfigType, PathfinderResultType } from "./types";

// Level two Ghost pen coordinates
const ghostPenPos = {
  x: 13,
  y: 13,
};

// BEGIN types

type HandleGhostsArgsType = {
  animationId: number;
  config: ConfigType;
  context: CanvasRenderingContext2D;
  mapHeight: number;
  mapWidth: number;
};

// END types

export function handleGhosts({
  config,
  context,
  mapHeight,
  mapWidth,
}: HandleGhostsArgsType) {
  const matrix = convertSymbolMapToPathMatrix({ mapName: config.map });

  const pfGrid = new PF.Grid(matrix);

  const pathFinder = new PF.AStarFinder({
    heuristic: PF.Heuristic.manhattan,
  });

  config.ghosts.forEach((ghost) => {
    ghost.draw(context, config.player);
    if (!config.paused) {
      ghost.update(context, config.player, mapHeight, mapWidth);
    }

    const collisions: CollisionType[] = [];

    // BEGIN Ghost movement
    // !ghost.eaten
    if (ghost.behavior !== "eaten") {
      config.boundaries.forEach((boundary) => {
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
            ghost.direction = "up";
            break;

          case "right":
            ghost.velocity.y = 0;
            ghost.velocity.x = ghost.speed;
            ghost.direction = "right";
            break;

          case "bottom":
            ghost.velocity.y = ghost.speed;
            ghost.velocity.x = 0;
            ghost.direction = "down";
            break;

          case "left":
            ghost.velocity.y = 0;
            ghost.velocity.x = -ghost.speed;
            ghost.direction = "left";
            break;
        }

        ghost.prevCollisions = [];
      }
    }

    // Create ghost path for newly eaten ghosts
    if (ghost.behavior === "eaten" && ghost.ghostPenEntryPath.length === 0) {
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
    if (
      ghost.behavior === "eaten" &&
      ghost.ghostPenEntryPath.length > 0 &&
      !config.paused
    ) {
      followPath({ ghost });
    }

    // Make recovered ghosts exit the pen (otherwise there are
    // pathfinding bugs)
    if (ghost.exitingPen) {
      ghostExitPen({ ghost, pathFinder, pfGrid });
    }
  });
  // END Ghost movement
}
