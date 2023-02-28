import { Boundary } from "./boundary-class";
import { createImage } from "./create-image";
import { Ghost } from "./ghost-class";
import { RetrieveGhostsArgsType } from "./types";

const spriteURL = "./src/image/sprite_all_items.png";
const sprite = createImage(spriteURL);

export function retrieveGhosts({ context, map }: RetrieveGhostsArgsType) {
  const ghostGridPosition = {
    levelOneMap: {
      pinky: { x: 6, y: 3 },
      blinky: { x: 9, y: 7 },
      inky: { x: 8, y: 11 },
      clyde: { x: 2, y: 11 },
    },
    levelTwoMap: {
      pinky: { x: 12, y: 5 },
      blinky: { x: 25, y: 3 },
      inky: { x: 6, y: 22 },
      clyde: { x: 20, y: 22 },
    },
    levelThreeMap: {
      pinky: { x: 12, y: 5 },
      blinky: { x: 25, y: 3 },
      inky: { x: 6, y: 22 },
      clyde: { x: 20, y: 22 },
    },
  };

  const { blinky, clyde, inky, pinky } = ghostGridPosition[map];

  return [
    new Ghost({
      context,
      name: "pinky",
      position: {
        x: Boundary.cellWidth * pinky.x + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * pinky.y + Boundary.cellHeight / 2,
      },
      image: sprite,
      speed: 2,
      spriteIndex: [3, 0],
      velocity: { y: -Ghost.speed, x: 0 },
    }),
    new Ghost({
      context,
      name: "blinky",
      image: sprite,
      spriteIndex: [0, 0],
      position: {
        x: Boundary.cellWidth * blinky.x + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * blinky.y + Boundary.cellHeight / 2,
      },
      speed: 2,
      velocity: { y: -Ghost.speed, x: 0 },
    }),
    new Ghost({
      context,
      name: "inky",
      image: sprite,
      spriteIndex: [3, 2],
      position: {
        x: Boundary.cellWidth * inky.x + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * inky.y + Boundary.cellHeight / 2,
      },
      speed: 2,
      velocity: { y: -Ghost.speed, x: 0 },
    }),
    new Ghost({
      context,
      name: "clyde",
      image: sprite,
      spriteIndex: [2, 1],
      position: {
        x: Boundary.cellWidth * clyde.x + Boundary.cellWidth / 2,
        y: Boundary.cellHeight * clyde.y + Boundary.cellHeight / 2,
      },
      speed: 2,
      velocity: { y: -Ghost.speed, x: 0 },
    }),
  ];
}
