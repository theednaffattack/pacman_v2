import { spriteEntities } from "./sprite-map";
import { MapEntityTypes, MapTileEntityKeys, MapTileSymbolType } from "./types";

type MapSymbolSwitcherType = {
  name: MapEntityTypes;
  spriteIndex: [number, number];
};

export function mapSymbolSwitcher(
  symbol: MapTileSymbolType
): MapSymbolSwitcherType {
  switch (symbol) {
    // pipe horizontal
    case "-":
      return { name: "pipeHorizontal", spriteIndex: [6, 4] };

    // pipe vertical
    case "|":
      return { name: "pipeVertical", spriteIndex: [7, 5] };

    // pipe corner 1 - upper left
    case "1":
      return { name: "pipeCorner1", spriteIndex: [9, 3] };

    // Pipe corner 2 - upper right
    case "2":
      return { name: "pipeCorner2", spriteIndex: [7, 5] };

    // Pipe corner 3 - bottom right
    case "3":
      return { name: "pipeCorner3", spriteIndex: [7, 4] };

    // Pipe corner 4 - bottom left
    case "4":
      return { name: "pipeCorner4", spriteIndex: [8, 4] };

    // Block - a one tile sized block
    case "b":
      return { name: "block", spriteIndex: [9, 5] };

    // Cap left - a cap for one tile sized open entities
    case "[":
      return { name: "capLeft", spriteIndex: [4, 4] };
    case "]":
      return { name: "capRight", spriteIndex: spriteEntities.capRight };

    case "_":
      return { name: "capBottom", spriteIndex: spriteEntities.capBottom };

    case "^":
      return { name: "capBottom", spriteIndex: [8, 5] };

    case "+":
      return { name: "pipeCross", spriteIndex: spriteEntities.pipeCross };

    case "5":
      return {
        name: "pipeConnectorTop",
        spriteIndex: spriteEntities.pipeConnectorTop,
      };

    case "6":
      return {
        name: "pipeConnectorRight",
        spriteIndex: spriteEntities.pipeConnectorRight,
      };
    case "7":
      return {
        name: "pipeConnectorBottom",
        spriteIndex: spriteEntities.pipeConnectorBottom,
      };
    case "8":
      return {
        name: "pipeConnectorLeft",
        spriteIndex: spriteEntities.pipeConnectorLeft,
      };

    case ".":
      return {
        name: "pellet",
        spriteIndex: [0, 0],
      };

    case "p":
      return {
        name: "powerUp",
        spriteIndex: [0, 0],
      };

    // Upper left corner boundary
    case "ul":
      return {
        name: "upperLeftHalfBlock",
        spriteIndex: spriteEntities.upperLeftHalfBlock,
      };

    // Upper right corner boundary
    case "ur":
      return {
        name: "upperRightHalfBlock",
        spriteIndex: spriteEntities.upperRightHalfBlock,
      };

    // Bottom left corner boundary
    case "bl":
      return {
        name: "bottomLeftHalfBlock",
        spriteIndex: spriteEntities.bottomLeftHalfBlock,
      };

    // Bottom right corner boundary
    case "br":
      return {
        name: "bottomRightHalfBlock",
        spriteIndex: spriteEntities.bottomRightHalfBlock,
      };

    // Top of the tile only boundary (a line)
    case "to":
      return {
        name: "topOnlyBar",
        spriteIndex: spriteEntities.topOnlyBar,
      };

    // Bottom of the tile oriented boundary (a line)
    case "bo":
      return {
        name: "bottomOnlyBar",
        spriteIndex: spriteEntities.bottomOnlyBar,
      };

    // Left of the tile oriented boundary (a line)
    case "lo":
      return {
        name: "leftOnlyBar",
        spriteIndex: spriteEntities.leftOnlyBar,
      };

    // Right of the tile oriented boundary (a line)
    case "ro":
      return {
        name: "rightOnlyBar",
        spriteIndex: spriteEntities.rightOnlyBar,
      };

    // Bottom of the tile oriented boundary (a line)
    case "gg":
      return {
        name: "ghostGate",
        spriteIndex: spriteEntities.ghostGate,
      };
    default:
      return {
        name: "block",
        spriteIndex: spriteEntities.block,
      };
  }
}
