import { Boundary } from "./boundary-class";
import { createImage } from "./create-image";
import { levelOneMap } from "./level-maps";
import { Pellet } from "./pellet-class";
import { PowerUp } from "./power-up-class";
import type { InitType } from "./types";

// Additional cases
export function initGameArea({ boundaries, pellets, powerUps }: InitType) {
  levelOneMap.forEach((row, rowIndex) => {
    row.forEach((symbol, cellIndex) => {
      switch (symbol) {
        case "-":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/pipeHorizontal.png"),
            })
          );
          break;
        case "|":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/pipeVertical.png"),
            })
          );
          break;
        case "1":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/pipeCorner1.png"),
            })
          );
          break;
        case "2":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/pipeCorner2.png"),
            })
          );
          break;
        case "3":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/pipeCorner3.png"),
            })
          );
          break;
        case "4":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/pipeCorner4.png"),
            })
          );
          break;
        case "b":
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.cellWidth * cellIndex,
                y: Boundary.cellHeight * rowIndex,
              },
              image: createImage("./src/image/block.png"),
            })
          );
          break;
        case "[":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              image: createImage("./src/image/capLeft.png"),
            })
          );
          break;
        case "]":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              image: createImage("./src/image/capRight.png"),
            })
          );
          break;
        case "_":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              image: createImage("./src/image/capBottom.png"),
            })
          );
          break;
        case "^":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              image: createImage("./src/image/capTop.png"),
            })
          );
          break;
        case "+":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              image: createImage("./src/image/pipeCross.png"),
            })
          );
          break;
        case "5":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              color: "blue",
              image: createImage("./src/image/pipeConnectorTop.png"),
            })
          );
          break;
        case "6":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              color: "blue",
              image: createImage("./src/image/pipeConnectorRight.png"),
            })
          );
          break;
        case "7":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              color: "blue",
              image: createImage("./src/image/pipeConnectorBottom.png"),
            })
          );
          break;
        case "8":
          boundaries.push(
            new Boundary({
              position: {
                x: cellIndex * Boundary.cellWidth,
                y: rowIndex * Boundary.cellHeight,
              },
              image: createImage("./src/image/pipeConnectorLeft.png"),
            })
          );
          break;
        case ".":
          pellets.push(
            new Pellet({
              position: {
                x: cellIndex * Boundary.cellWidth + Boundary.cellWidth / 2,
                y: rowIndex * Boundary.cellHeight + Boundary.cellHeight / 2,
              },
            })
          );
          break;

        case "p":
          powerUps.push(
            new PowerUp({
              position: {
                x: cellIndex * Boundary.cellWidth + Boundary.cellWidth / 2,
                y: rowIndex * Boundary.cellHeight + Boundary.cellHeight / 2,
              },
            })
          );
          break;
      }
    });
  });
}
