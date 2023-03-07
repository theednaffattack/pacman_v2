import { Boundary } from "./boundary-class";
import { GhostLike } from "./ghost-class";
import { PlayerType } from "./types";
import { clamp } from "./util";

export function circleCollidesWithRectangle({
  circle,
  rectangle,
}: {
  rectangle: Boundary;
  circle: PlayerType | GhostLike;
}) {
  if ("name" in circle) {
  }
  const padding = Boundary.cellWidth / 2 - circle.radius - 1;

  const bottomOfCircle =
    circle.position.y + circle.radius + circle.velocity.y >=
    rectangle.position.y - padding;

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

// Adapted from: https://stackoverflow.com/a/1879223
export function circleCollidesWithRectangleV2({
  circle,
  rectangle,
}: {
  circle: GhostLike;
  rectangle: Boundary;
}) {
  // clamp(value, min, max) - limits value to the range min..max

  // Find the closest point to the circle within the rectangle
  const closestX = clamp({
    value: circle.position.x,
    min: rectangle.position.x,
    max: rectangle.position.x,
  });
  const closestY = clamp({
    value: circle.position.y,
    min: rectangle.position.y,
    max: rectangle.position.y,
  });

  // Calculate the distance between the circle's center and this closest point
  const distanceX = circle.position.x - closestX;
  const distanceY = circle.position.y - closestY;

  // If the distance is less than the circle's radius, an intersection occurs
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  return distanceSquared < circle.radius * circle.radius;
}
