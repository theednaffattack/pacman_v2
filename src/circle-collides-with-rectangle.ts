import { PlayerType } from "./types";
import { Boundary } from "./boundary-class";

export function circleCollidesWithRectangle({
  circle,
  rectangle,
}: {
  rectangle: Boundary;
  circle: PlayerType;
}) {
  const padding = Boundary.cellWidth / 2 - circle.radius - 1;
  return (
    // top of circle
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height + padding &&
    // right side of circle
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x - padding &&
    // bottom of circle
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y - padding &&
    // left side of circle
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width + padding
  );
}
