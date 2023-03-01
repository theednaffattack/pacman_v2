import PF from "pathfinding";

import { convertSymbolMapToPathMatrix } from "../convert-symbol-map-to-path-matrix";

// Sample Ghost coordinates
const ghost = { x: 12, y: 5 };

// Level two Ghost pen coordinates
const gp = {
  x: 14,
  y: 12,
};

// Convert our map to something the pathfinding module
// understands. '0' is a walkable path '1' is a barrier.
const matrix = convertSymbolMapToPathMatrix({ mapName: "levelTwoMap" });

const grid = new PF.Grid(matrix);

const finder = new PF.AStarFinder({
  heuristic: PF.Heuristic.manhattan,
});

const path = finder.findPath(ghost.x, ghost.y, gp.x, gp.y, grid);

console.log("VIEW RESULTS", {
  path,
});
