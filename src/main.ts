export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

type Position = {
  x: number;
  y: number;
};
type BoundaryConstructor = {
  position: Position;
};

class Boundary {
  position;
  width: number;
  height: number;
  static cellWidth = 40;
  static cellHeight = 40;
  constructor({ position }: BoundaryConstructor) {
    this.position = position;
    this.width = 40;
    this.height = 40;
  }

  draw() {
    // I'm using a guard here to account for the
    // context possibly being null. Ideally
    // I'd have a custom error or function that
    // introduces a visual error state to the game.
    if (!context) {
      console.error("Context is undefined or null!");
      return;
    }
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const map = [
  ["-", "-", "-", "-", "-", "-"],
  ["-", " ", " ", " ", " ", "-"],
  ["-", " ", "-", "-", " ", "-"],
  ["-", " ", " ", " ", " ", "-"],
  ["-", "-", "-", "-", "-", "-"],
];

const boundaries: Boundary[] = [];

map.forEach((row, rowIndex) => {
  row.forEach((symbol, columnIndex) => {
    switch (symbol) {
      case "-":
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.cellWidth * columnIndex,
              y: Boundary.cellHeight * rowIndex,
            },
          })
        );
        break;

      default:
        break;
    }
  });
});

boundaries.forEach((boundary) => {
  boundary.draw();
});
