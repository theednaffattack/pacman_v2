import { determineGhostState } from "./determine-ghost-state";
import { Ghost } from "./ghost-class";
import { Player } from "./player-class";
import { spritePositionToImagePosition } from "./spirte-position-to-image-position";
import { sprites } from "./sprite-map";

export function spritePicker({
  ghost,
  player,
}: {
  ghost: Ghost;
  player: Player;
}) {
  // const sprites: SpriteGhostTypes = {
  //   blinky: {
  //     top: [0, 0],
  //     right: [1, 0],
  //     bottom: [1, 1],
  //     left: [0, 1],
  //   },
  //   inky: { top: [2, 2], right: [3, 2], bottom: [3, 3], left: [2, 3] },
  //   pinky: { top: [0, 2], right: [3, 0], bottom: [3, 1], left: [2, 1] },
  //   clyde: { top: [2, 0], right: [1, 2], bottom: [1, 3], left: [0, 3] },
  //   eaten: { top: [4, 2], right: [5, 2], bottom: [5, 3], left: [4, 3] },
  //   scared: { top: [4, 0], right: [5, 0], bottom: [5, 1], left: [4, 1] },
  //   flash: { top: [6, 0], right: [7, 0], bottom: [7, 1], left: [6, 1] },
  // };

  let spritePosition = { x: 0, y: 0 };

  // Normal ghosts player.powerUpActive = false
  if (ghost.velocity.y < 0 && !player.powerUpActive) {
    // moving up
    spritePosition = spritePositionToImagePosition({
      row: sprites[ghost.name].top[0],
      col: sprites[ghost.name].top[1],
    });
  } else if (ghost.velocity.x > 0 && !player.powerUpActive) {
    // moving right
    spritePosition = spritePositionToImagePosition({
      col: sprites[ghost.name].right[0],
      row: sprites[ghost.name].right[1],
    });
  } else if (ghost.velocity.y > 0 && !player.powerUpActive) {
    // moving down
    spritePosition = spritePositionToImagePosition({
      col: sprites[ghost.name].bottom[0],
      row: sprites[ghost.name].bottom[1],
    });
  } else if (ghost.velocity.x < 0 && !player.powerUpActive) {
    // moving left
    spritePosition = spritePositionToImagePosition({
      col: sprites[ghost.name].left[0],
      row: sprites[ghost.name].left[1],
    });
  } else if (ghost.velocity.y < 0 && ghost.scared) {
    // moving up - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: player.powerUpAboutToExpire,
        ghost,
        colOrRow: "col",
        eaten: ghost.eaten,
        position: "top",
        sprites,
      }),
      // col: ghost.eaten ? sprites.eaten.top[0] : sprites.scared.top[0],
      row: determineGhostState({
        ghost,
        blinking: player.powerUpAboutToExpire,
        colOrRow: "row",
        eaten: ghost.eaten,
        position: "top",
        sprites,
      }),
    });
  } else if (ghost.velocity.x > 0) {
    // moving right - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: player.powerUpAboutToExpire,
        colOrRow: "col",
        eaten: ghost.eaten,
        ghost,
        position: "right",
        sprites,
      }),
      row: determineGhostState({
        blinking: player.powerUpAboutToExpire,
        colOrRow: "row",
        eaten: ghost.eaten,
        ghost,
        position: "right",
        sprites,
      }),
    });
  } else if (ghost.velocity.y > 0) {
    // moving down - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: ghost.scaredAboutToExpireTimer === 0, // player.powerUpAboutToExpire,
        colOrRow: "col",
        eaten: ghost.eaten,
        ghost,
        position: "bottom",
        sprites,
      }),
      row: determineGhostState({
        blinking: ghost.scaredAboutToExpireTimer === 0, // player.powerUpAboutToExpire,
        colOrRow: "row",
        eaten: ghost.eaten,
        ghost,
        position: "bottom",
        sprites,
      }),
    });
  } else if (ghost.velocity.x < 0) {
    // moving left - SCARED
    spritePosition = spritePositionToImagePosition({
      col: determineGhostState({
        blinking: player.powerUpAboutToExpire,
        colOrRow: "col",
        eaten: ghost.eaten,
        ghost,
        position: "left",
        sprites,
      }),
      row: determineGhostState({
        blinking: player.powerUpAboutToExpire,
        colOrRow: "row",
        eaten: ghost.eaten,
        ghost,
        position: "left",
        sprites,
      }),
    });
  }

  return spritePosition;
}
