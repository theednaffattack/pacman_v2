import { Boundary } from "./boundary-class";
import { levelTwoMap } from "./level-maps";
import { Pellet } from "./pellet-class";
import { PowerUp } from "./power-up-class";
import type { InitType } from "./types";

// Additional cases
export function initGameArea({
  boundaries,
  context,
  pellets,
  powerUps,
}: InitType) {
  levelTwoMap.forEach((row, rowIndex) => {
    row.forEach((symbol, columnIndex) => {
      switch (symbol) {
        // pipe horizontal
        case "-":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              spriteIndex: [6, 4],
            })
          );
          break;

        // pipe vertical
        case "|":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              spriteIndex: [7, 5],
            })
          );
          break;
        case "1":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              // image: createImage("./src/image/pipeCorner1.png"),
              spriteIndex: [9, 3],
            })
          );
          break;
        case "2":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              // image: createImage("./src/image/pipeCorner2.png"),
              spriteIndex: [9, 4],
            })
          );
          break;
        case "3":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              // image: createImage("./src/image/pipeCorner3.png"),
              spriteIndex: [7, 4],
            })
          );
          break;
        case "4":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              // image: createImage("./src/image/pipeCorner4.png"),
              spriteIndex: [8, 4],
            })
          );
          break;
        case "b":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: Boundary.cellWidth * columnIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              // image: createImage("./src/image/block.png"),
              spriteIndex: [9, 5],
            })
          );
          break;
        case "[":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/capLeft.png"),
              spriteIndex: [4, 4],
            })
          );
          break;
        case "]":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/capRight.png"),
              spriteIndex: [4, 5],
            })
          );
          break;
        case "_":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/capBottom.png"),
              spriteIndex: [3, 4],
            })
          );
          break;
        case "^":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/capTop.png"),
              spriteIndex: [8, 5],
            })
          );
          break;
        case "+":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/pipeCross.png"),
              spriteIndex: [6, 5],
            })
          );
          break;
        case "5":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              spriteIndex: [8, 3],
            })
          );
          break;
        case "6":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/pipeConnectorRight.png"),
              spriteIndex: [5, 5],
            })
          );
          break;
        case "7":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/pipeConnectorBottom.png"),
              spriteIndex: [6, 3],
            })
          );
          break;
        case "8":
          boundaries.push(
            new Boundary({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              // image: createImage("./src/image/pipeConnectorLeft.png"),
              spriteIndex: [7, 3],
            })
          );
          break;
        case ".":
          pellets.push(
            new Pellet({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth + Boundary.cellWidth / 2,
                y: rowIndex * Boundary.cellHeight + Boundary.cellHeight / 2,
              },
            })
          );
          break;

        case "p":
          powerUps.push(
            new PowerUp({
              context,
              position: {
                x: columnIndex * Boundary.cellWidth + Boundary.cellWidth / 2,
                y: rowIndex * Boundary.cellHeight + Boundary.cellHeight / 2,
              },
            })
          );
          break;
      }
    });
  });
}
