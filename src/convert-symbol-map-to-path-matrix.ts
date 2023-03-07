import { levelOneMap, levelThreeMap, levelTwoMap } from "./level-maps";
import { ConvertSymbolMapToPathMatrixArgs } from "./types";

export function convertSymbolMapToPathMatrix({
  mapName,
  walkableValues = ["", " ", ".", "p", "gg"],
}: ConvertSymbolMapToPathMatrixArgs) {
  const maps = { levelOneMap, levelTwoMap, levelThreeMap };
  const mapToUse = maps[mapName];

  // Convert our map to something the pathfinding module
  // understands. '0' is a walkable path '1' is a barrier.
  const matrix = mapToUse.map((row) => {
    return row.map((cell) => {
      if (walkableValues.includes(cell)) {
        return 0;
      } else {
        return 1;
      }
    });
  });

  return matrix;
}
