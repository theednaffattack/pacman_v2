import { TILE_SIZE } from "./constants";
import { Ghost } from "./ghost-class";

export function drawPath({
  ghost,
  context,
}: {
  context: CanvasRenderingContext2D;
  ghost: Ghost;
}) {
  const ghostColors = {
    inky: "rgba(0, 255, 255, .5)", // cyan (#00ffff)
    pinky: "rgba(251, 116, 187, .5)", // pink (#fb74bb)
    blinky: "rgba(254, 13, 12, .5)", // red (#fe0d0c)
    clyde: "rgba(255, 165, 2, .5)", // orange (#ffa502)
  };

  // Draw the path back to the ghost pen
  for (const coords of ghost.ghostPenExitPath) {
    const x = coords[0] * TILE_SIZE;
    const y = coords[1] * TILE_SIZE;

    context.fillStyle = ghostColors[ghost.name];
    context.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    // // draw a line to the goal
    // context.beginPath();
    // context.moveTo(x, y);
    // context.lineTo(ghostPenPos.x, ghostPenPos.y);
    // context.stroke();
  }
}
