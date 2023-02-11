import { Boundary } from "./boundary-class";
import { createImage } from "./create-image";
import { Ghost } from "./ghost-class";
import { levelOneMap } from "./level-maps";
import { Coords } from "./types";

const spriteURL = "./src/image/ghost_sprite.png";
const sprite = createImage(spriteURL);

type Tile = { col: number; row: number };

export function retrieveGhosts(context: CanvasRenderingContext2D) {
  return [
    new Ghost({
      context,
      name: "pinky",
      position: {
        x: Boundary.cellWidth * 6 + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * 3 + Boundary.cellHeight / 2,
      },
      image: sprite,
      speed: 2,
      spriteIndex: [3, 0],
      velocity: { x: Ghost.speed, y: 0 },
    }),
    new Ghost({
      context,
      name: "blinky",
      image: sprite,
      spriteIndex: [0, 0],
      position: {
        x: Boundary.cellWidth * 9 + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * 7 + Boundary.cellHeight / 2,
      },
      speed: 2,
      velocity: { x: -Ghost.speed, y: 0 },
    }),
    new Ghost({
      context,
      name: "inky",
      image: sprite,
      spriteIndex: [3, 2],
      position: {
        x: Boundary.cellWidth * 8 + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * 11 + Boundary.cellHeight / 2,
      },
      speed: 2,
      velocity: { x: Ghost.speed, y: 0 },
    }),
    new Ghost({
      context,
      name: "clyde",
      image: sprite,
      spriteIndex: [2, 1],
      position: {
        x: Boundary.cellWidth * 2 + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * 11 + Boundary.cellHeight / 2,
      },
      speed: 2,
      velocity: { x: Ghost.speed, y: 0 },
    }),
  ];
}

export function spawnGhosts(
  context: CanvasRenderingContext2D,
  opts: {
    level: number;
    speed: number;
    velocity: number;
    map: "levelOneMap" | "levelTwoMap" | "levelThreeMap";
  }
) {
  const ghostNames = ["inky", "pinky", "blinky", "clyde"];
  const levelMapNames = ["levelOneMap", "levelTwoMap", "levelThreeMap"];
  const { map } = opts;
  let availableTiles: Tile[][] = [];
  let currentLevelMap: string[][];

  for (let rowIndex = 0; rowIndex < levelOneMap.length; rowIndex++) {
    // This is a row
    availableTiles.push([]);
    const row = levelOneMap[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex];
      if (cell === ".") {
        availableTiles[rowIndex][colIndex] = { col: colIndex, row: rowIndex };
      }
    }
  }
  return availableTiles;
}
