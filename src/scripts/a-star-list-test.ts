import { GridNode, AStarList } from "../a-star-list";

const graph: GridNode[][] = [
  [1, 1, 1, 1],
  [0, 1, 1, 0],
  [0, 0, 1, 1],
].map((row, rowIndex) => {
  return row.map((_, colIndex) => {
    return {
      fScore: 0,
      gScore: 0,
      isBoundary: false,
      neighbors: [],
      parent: null,
      pos: { x: colIndex, y: rowIndex },
      debug: "hello",
      heuristic: 0,
    };
  });
});

const start: GridNode = {
  fScore: 0,
  gScore: 0,
  isBoundary: false,
  neighbors: [],
  parent: null,
  pos: { x: 0, y: 0 },
  debug: "hello",
  heuristic: 0,
};

const end: GridNode = {
  fScore: 0,
  gScore: 0,
  isBoundary: false,
  neighbors: [],
  parent: null,
  pos: { x: 1, y: 2 },
  debug: "hello",
  heuristic: 0,
};

export const result = AStarList.search({ grid: graph, start, end });

console.log("VIEW A STAR RESULT", graph);
