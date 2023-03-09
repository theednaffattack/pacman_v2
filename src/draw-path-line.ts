import { TILE_SIZE } from "./constants";
import { Ghost } from "./ghost-class";

export function drawPathLine({
  ghost,
  context,
}: {
  context: CanvasRenderingContext2D;
  ghost: Ghost;
}) {
  // Draw a line of the ghost's path
  for (
    let pathIndex = 0;
    pathIndex < ghost.ghostPenEntryPath.length - 1;
    pathIndex++
  ) {
    const [x0, y0] = ghost.ghostPenEntryPath[pathIndex];
    const [x1, y1] = ghost.ghostPenEntryPath[pathIndex + 1];

    context.beginPath();
    context.moveTo(
      x0 * TILE_SIZE + TILE_SIZE / 2,
      y0 * TILE_SIZE + TILE_SIZE / 2
    );
    context.lineTo(
      x1 * TILE_SIZE + TILE_SIZE / 2,
      y1 * TILE_SIZE + TILE_SIZE / 2
    );
    context.strokeStyle = "#32CD32";
    context.stroke();
  }
}
