import {
  BORDER_WIDTH,
  SPACING_WIDTH,
  SPRITE_WIDTH,
  SPRITE_HEIGHT,
} from "./constants";
import type { RowColumnType } from "./types";

export function spritePositionToImagePosition({ row, col }: RowColumnType) {
  return {
    x: BORDER_WIDTH + col * (SPACING_WIDTH + SPRITE_WIDTH),
    y: BORDER_WIDTH + row * (SPACING_WIDTH + SPRITE_HEIGHT),
  };
}
