import { TILE_SIZE } from "./constants";
import { createImage } from "./create-image";
import { spritePositionToImagePosition } from "./sprite-position-to-image-position";
import { BoundaryConstructor } from "./types";

const spriteURL = "./src/image/sprite_all_items.png";
const sprite = createImage(spriteURL);

export class Gates {
  context: CanvasRenderingContext2D;
  position;
  width: number;
  height: number;
  spriteIndex: [number, number];
  static cellWidth = 40;
  static cellHeight = 40;
  constructor({ context, position, spriteIndex }: BoundaryConstructor) {
    this.context = context;
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.spriteIndex = spriteIndex;
  }

  draw() {
    let [x, y] = this.spriteIndex;
    let pixelCoords = spritePositionToImagePosition({ col: x, row: y });

    this.context.drawImage(
      sprite,
      pixelCoords.x,
      pixelCoords.y,
      TILE_SIZE,
      TILE_SIZE,
      this.position.x,
      this.position.y,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}
