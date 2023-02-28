import { TILE_SIZE } from "./constants";
import { createImage } from "./create-image";
import { spritePositionToImagePosition } from "./sprite-position-to-image-position";
import { MapEntityTypes } from "./types";

const spriteURL = "./src/image/sprite_all_items.png";
const sprite = createImage(spriteURL);

export class GridPointClass {
  context?: CanvasRenderingContext2D;
  xGrid: number;
  yGrid: number;
  xPixel: number;
  yPixel: number;
  fScore: number;
  gScore: number;
  heuristic: number;
  neighbors: GridPointClass[];
  parent: GridPointClass | undefined;
  width: number;
  height: number;
  spriteIndex: [number, number];
  spriteName: MapEntityTypes;
  static cellWidth = 40;
  static cellHeight = 40;

  constructor({
    context,
    spriteIndex,
    spriteName = "space",
    xGrid: x,
    yGrid: y,
  }: {
    context?: CanvasRenderingContext2D;
    spriteIndex: [number, number];
    spriteName: MapEntityTypes;
    xGrid: number;
    yGrid: number;
  }) {
    this.context = context;
    this.xGrid = x; // x location (column) of the grid point
    this.yGrid = y; // y location (row) of the grid point
    this.xPixel = this.xGrid * TILE_SIZE;
    this.yPixel = this.yGrid * TILE_SIZE;
    this.fScore = 0; // total cost function
    this.gScore = 0; // cost function from start to the current grid point
    this.heuristic = 0; // heuristic estimated cost function from current grid point to the goal
    this.neighbors = []; // neighbors of the current grid point
    this.parent = undefined;
    this.width = 40;
    this.height = 40;
    this.spriteIndex = spriteIndex;
    this.spriteName = spriteName;
  }

  draw() {
    let [x, y] = this.spriteIndex;
    let pixelCoords = spritePositionToImagePosition({ col: x, row: y });

    if (this.context) {
      this.context.drawImage(
        sprite,
        pixelCoords.x,
        pixelCoords.y,
        TILE_SIZE,
        TILE_SIZE,
        this.xPixel,
        this.yPixel,
        TILE_SIZE,
        TILE_SIZE
      );
    }
  }

  // update neighbors array for a given grid point
  updateNeighbors(grid: GridPointClass[][]) {
    // console.log("INSIDE UPDATE NEIGHBORS", { grid });

    let myX = this.xGrid;
    let myY = this.yGrid;
    let columnsLen = grid[0].length;
    let rowsLen = grid.length;

    if (myX < columnsLen - 1) {
      this.neighbors.push(grid[myX + 1][myY]);
    }

    if (myX > 0) {
      this.neighbors.push(grid[myX - 1][myY]);
    }

    if (myY < rowsLen - 1) {
      this.neighbors.push(grid[myX][myY + 1]);
    }

    if (myY > 0) {
      this.neighbors.push(grid[myX][myY - 1]);
    }
  }
}
