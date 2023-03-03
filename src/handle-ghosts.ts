import PF from "pathfinding";
import { convertSymbolMapToPathMatrix } from "./convert-symbol-map-to-path-matrix";
import { Boundary } from "./boundary-class";
import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { TILE_SIZE } from "./constants";
import { Ghost } from "./ghost-class";
import { Player } from "./player-class";
import { CollisionType, PathfinderResultType } from "./types";

// BEGIN types
type HandleGhostsArgsType = {
  boundaries: Boundary[];
  context: CanvasRenderingContext2D;
  ghosts: Ghost[];
  paused: boolean;
  mapHeight: number;
  mapWidth: number;
  player: Player;
};

type GhostEatenPathsType = {
  inky: any[];
  pinky: any[];
  blinky: any[];
  clyde: any[];
};
// END types

export function handleGhosts({
  boundaries,
  context,
  ghosts,
  paused,
  mapHeight,
  mapWidth,
  player,
}: HandleGhostsArgsType) {
  let ghostEatenPaths: GhostEatenPathsType = {
    inky: [],
    pinky: [],
    blinky: [],
    clyde: [],
  };

  // Level two Ghost pen coordinates
  const ghostPenPos = {
    x: 13,
    y: 12,
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
      ghostEatenPaths[ghost.name] = path;
      ghost.ghostPenPath = path;

      console.log(
        "VIEW GHOST INFO",
        ghost.name.toUpperCase(),
        ghost.ghostPenPath
      );

      // END A STAR
    }
    // Make eaten ghosts move to the pen
    if (ghost.eaten && ghost.ghostPenPath.length > 0) {
      const from = ghost.ghostPenPath[0];
      const to = ghost.ghostPenPath[1];
      ghost.velocity.x = 0;
      ghost.velocity.y = 0;

      // // Path is to the right
      // if (from[0] < to[0]) {
      //   console.log(`SHOULD BE RIGHT ${ghost.name}`, from, to, from[0] < to[0]);

      //   ghost.velocity.x = ghost.speed;
      // }
      // // Path is to the left
      // if (from[0] > to[0]) {
      //   console.log(`SHOULD BE LEFT ${ghost.name}`, from, to, from[0] > to[0]);
      //   ghost.velocity.x = 0;
      //   ghost.velocity.y = 0;
      //   ghost.velocity.x = -ghost.speed;
      // }
      // // Path is to the top
      // if (from[1] > to[1]) {
      //   console.log(`SHOULD BE TOP ${ghost.name}`, from[1] > to[1]);
      //   ghost.velocity.x = 0;
      //   ghost.velocity.y = 0;
      //   ghost.velocity.y = -ghost.speed;
      // }
      // // Path is to the bottom
      // if (from[1] < to[1]) {
      //   console.log(`SHOULD BE BOTTOM ${ghost.name}`, from[1] < to[1]);
      //   ghost.velocity.x = 0;
      //   ghost.velocity.y = 0;
      //   ghost.velocity.y = ghost.speed;
      // }

      const ghostColors = {
        inky: "rgba(0, 255, 255, .5)", // cyan (#00ffff)
        pinky: "rgba(251, 116, 187, .5)", // pink (#fb74bb)
        blinky: "rgba(254, 13, 12, .5)", // red (#fe0d0c)
        clyde: "rgba(255, 165, 2, .5)", // orange (#ffa502)
      };

      // Draw the path back to the ghost pen
      for (const coords of ghost.ghostPenPath) {
        const x = coords[0] * TILE_SIZE;
        const y = coords[1] * TILE_SIZE;

        context.fillStyle = ghostColors[ghost.name];
        context.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      }

      // Ghost has reach the goal
      if (
        Math.floor(ghost.position.x / TILE_SIZE) === ghostPenPos.x &&
        Math.floor(ghost.position.y / TILE_SIZE) === ghostPenPos.y
      ) {
        ghost.eaten = false;
        ghost.scared = false;
        console.log("GOOOOOAAAAAAAL");
      }
    }
  });
  // END Ghost movement
}
