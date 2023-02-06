import { Boundary } from "./boundary-class";
import { createImage } from "./create-image";
import { Ghost } from "./ghost-class";

const spriteURL = "./src/image/ghost_sprite.png";
const sprite = createImage(spriteURL);
export const ghosts: Ghost[] = [
  new Ghost({
    name: "pinky",
    position: {
      // x = column, y = row
      x: Boundary.cellWidth * 6 + Boundary.cellWidth / 2,
      y: Boundary.cellHeight * 3 + Boundary.cellHeight / 2,
    },
    image: sprite,
    speed: 2,
    spriteIndex: [3, 0],
    velocity: { x: Ghost.speed, y: 0 },
  }),
  new Ghost({
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
