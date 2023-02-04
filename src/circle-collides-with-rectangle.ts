import { PlayerType } from "./main";
import { Boundary } from "./boundary-class";

export function circleCollidesWithRectangle({
  circle,
  rectangle,
}: {
  rectangle: Boundary;
  circle: PlayerType;
}) {
  return (
    // top of circle
    circle.position.y - circle.radius + circle.velocity.y <=
      rectangle.position.y + rectangle.height &&
    // right side of circle
    circle.position.x + circle.radius + circle.velocity.x >=
      rectangle.position.x &&
    // bottom of circle
    circle.position.y + circle.radius + circle.velocity.y >=
      rectangle.position.y &&
    // left side of circle
    circle.position.x - circle.radius + circle.velocity.x <=
      rectangle.position.x + rectangle.width
  );
}
