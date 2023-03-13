import { determineGhostState } from "./determine-ghost-state";
import { Ghost } from "./ghost-class";
import { spriteEntities } from "./sprite-map";
import { spritePositionToImagePosition } from "./sprite-position-to-image-position";

export function spritePicker({ ghost }: { ghost: Ghost }) {
  let spritePosition = { x: 0, y: 0 };

  // Normal ghosts
  if (ghost.velocity.x === 0 && ghost.velocity.y === 0 && !ghost.scared) {
    // ghost is stationary
    spritePosition = spritePositionToImagePosition({
      col: spriteEntities[ghost.name].right[0],
      row: spriteEntities[ghost.name].right[1],
    });
  } else if (ghost.velocity.y < 0 && !ghost.scared) {
    // moving up
    spritePosition = spritePositionToImagePosition({
      col: spriteEntities[ghost.name].up[0],
      row: spriteEntities[ghost.name].up[1],
    });
  } else if (ghost.velocity.x > 0 && !ghost.scared) {
    // moving right
    spritePosition = spritePositionToImagePosition({
      col: spriteEntities[ghost.name].right[0],
      row: spriteEntities[ghost.name].right[1],
    });
  } else if (ghost.velocity.y > 0 && !ghost.scared) {
    // moving down
    spritePosition = spritePositionToImagePosition({
      col: spriteEntities[ghost.name].down[0],
      row: spriteEntities[ghost.name].down[1],
    });
  } else if (ghost.velocity.x < 0 && !ghost.scared) {
    // moving left
    spritePosition = spritePositionToImagePosition({
      col: spriteEntities[ghost.name].left[0],
      row: spriteEntities[ghost.name].left[1],
    });
  } else if (ghost.velocity.y < 0 && ghost.scared) {
    // moving up - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: ghost.blinking,
        ghost,
        colOrRow: "col",
        eaten: ghost.eaten,
        position: "top",
        sprites: spriteEntities,
      }),
      // col: ghost.eaten ? sprites.eaten.top[0] : sprites.scared.top[0],
      row: determineGhostState({
        ghost,
        blinking: ghost.blinking,
        colOrRow: "row",
        eaten: ghost.eaten,
        position: "top",
        sprites: spriteEntities,
      }),
    });
  } else if (ghost.velocity.x > 0 && ghost.scared) {
    // moving right - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: ghost.blinking,
        colOrRow: "col",
        eaten: ghost.eaten,
        ghost,
        position: "right",
        sprites: spriteEntities,
      }),
      row: determineGhostState({
        blinking: ghost.blinking,
        colOrRow: "row",
        eaten: ghost.eaten,
        ghost,
        position: "right",
        sprites: spriteEntities,
      }),
    });
  } else if (ghost.velocity.y > 0 && ghost.scared) {
    // moving down - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: ghost.scaredAboutToExpireTimer === 0, // ghost.blinking,
        colOrRow: "col",
        eaten: ghost.eaten,
        ghost,
        position: "bottom",
        sprites: spriteEntities,
      }),
      row: determineGhostState({
        blinking: ghost.scaredAboutToExpireTimer === 0, // ghost.blinking,
        colOrRow: "row",
        eaten: ghost.eaten,
        ghost,
        position: "bottom",
        sprites: spriteEntities,
      }),
    });
  } else if (ghost.velocity.x < 0 && ghost.scared) {
    // moving left - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: ghost.blinking,
        colOrRow: "col",
        eaten: ghost.eaten,
        ghost,
        position: "left",
        sprites: spriteEntities,
      }),
      row: determineGhostState({
        blinking: ghost.blinking,
        colOrRow: "row",
        eaten: ghost.eaten,
        ghost,
        position: "left",
        sprites: spriteEntities,
      }),
    });
  }

  return spritePosition;
}
