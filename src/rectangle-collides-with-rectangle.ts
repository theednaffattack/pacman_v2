import { Boundary } from "./boundary-class";
import { TILE_SIZE } from "./constants";
import { GhostLike } from "./ghost-class";

export function rectangleCollidesWithRectangle({
  rectangleOne,
  rectangleTwo,
}: {
  rectangleOne: GhostLike;
  rectangleTwo: Boundary;
}) {
  return (
    rectangleOne.position.y + TILE_SIZE >= rectangleTwo.position.y &&
    rectangleOne.position.y <= rectangleTwo.position.y + TILE_SIZE &&
    rectangleOne.position.x + TILE_SIZE >= rectangleTwo.position.x &&
    rectangleOne.position.x <= rectangleTwo.position.x + TILE_SIZE
  );
}
