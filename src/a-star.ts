// Adapted from: https://dev.to/codesphere/pathfinding-with-javascript-the-a-algorithm-3jlb
// TERMINOLOGY
// G-Score: Distance travelled from start to current cell
// F-Score: gScore + estimated distance to the goal
// Heuristic = proceeding to a solution by trial and error or by rules that are only loosely defined.

import { GridPointClass } from "./grid-point-class";
import { InitArgsType, SearchArgsType } from "./types";

// let columns = 5;
// let rows = 5;
// let grid: GridPointClass[][] = new Array(columns);

// An array containing unevaluated grid points
let openSet: GridPointClass[] = [];
// An array containing completely evaluated grid points
let closedSet: GridPointClass[] = [];
// The starting grid point
let start: GridPointClass;
// Ending point grid point (goal)
let end: GridPointClass;
// The path of connected Grid Points to the goal
let path: GridPointClass[] = [];

// The heuristic used is Manhattan distance
//for other heuristics visit - https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
function heuristic(position0: GridPointClass, position1: GridPointClass) {
  let d1 = Math.abs(position1.xGrid - position0.xGrid);
  let d2 = Math.abs(position1.yGrid - position0.yGrid);

  return d1 + d2;
}

// Initializing the grid
function init({ startCoords, goal, grid }: InitArgsType) {
  let columnsLen = grid[0].length;
  let rowsLen = grid.length;

  for (let colIndex = 0; colIndex < columnsLen; colIndex++) {
    for (let rowIndex = 0; rowIndex < rowsLen; rowIndex++) {
      grid[colIndex][rowIndex] = new GridPointClass({
        xGrid: colIndex,
        yGrid: rowIndex,
      });
    }
  }

  for (let colIndex = 0; colIndex < columnsLen; colIndex++) {
    for (let rowIndex = 0; rowIndex < rowsLen; rowIndex++) {
      grid[colIndex][rowIndex].updateNeighbors(grid);
    }
  }

  // Remove start and end to use as inputs "startCoords" & "goal"
  // start = grid[0][0];
  // start = startCoords;
  // end = grid[columnsLen - 1][rowsLen - 1];

  openSet.push(startCoords);

  console.log(grid);
}

// A star search implementation
// TODO: add params to implement in game
// NOTE: ghost pen center = col = 12, row = 13
// NOTE: For note above everything is zero based (row 13 becomes row 12)
export function search({ start, goal, grid }: SearchArgsType) {
  init({ startCoords: start, goal, grid });

  while (openSet.length > 0) {
    // assumption that the lowest index is the first one to begin with
    let lowestIndex = 0;
    for (let index = 0; index < openSet.length; index++) {
      if (openSet[index].fScore < openSet[lowestIndex].fScore) {
        lowestIndex = index;
      }
    }
    let currentGridPoint = openSet[lowestIndex];
    if (currentGridPoint === goal) {
      let temp = currentGridPoint;
      path.push(temp);
      // while loop below
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }
      console.log("DONE");

      // return the traced path
      return path.reverse();
    }

    // remove current from openSet
    openSet.splice(lowestIndex, 1);
    // add current to closedSet
    closedSet.push(currentGridPoint);

    let neighbors = currentGridPoint.neighbors;

    for (let index = 0; index < neighbors.length; index++) {
      const singleNeighbor = neighbors[index];

      if (!closedSet.includes(singleNeighbor)) {
        let possibleGscore = currentGridPoint.gScore + 1;

        if (!openSet.includes(singleNeighbor)) {
          openSet.push(singleNeighbor);
        } else if (possibleGscore >= singleNeighbor.gScore) {
          continue;
        }

        singleNeighbor.gScore = possibleGscore;
        singleNeighbor.heuristic = heuristic(singleNeighbor, goal);
        singleNeighbor.fScore =
          singleNeighbor.gScore + singleNeighbor.heuristic;
        singleNeighbor.parent = currentGridPoint;
      }
    }
  }

  // no solution by default
  return [];
}
