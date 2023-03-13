import { circleCollidesWithRectangle } from "./circle-collides-with-rectangle";
import { Gates } from "./gates-class";
import { ConfigType, LastKeyType } from "./types";

type HandleCharacterMovementArgsType = {
  config: ConfigType;
  gates: Gates[];
  lastKey: LastKeyType;
};

export function handleCharacterMovement({
  config,
  gates,
  lastKey,
}: HandleCharacterMovementArgsType) {
  const boundaries = [...config.boundaries, ...gates];

  if (config.keys.ArrowUp.pressed && lastKey.value === "ArrowUp") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...config.player, velocity: { x: 0, y: -5 } },
          rectangle: boundary,
        })
      ) {
        config.player.velocity.y = 0;
        break;
      } else {
        config.player.velocity.y = -5;
      }
    }
  } else if (config.keys.ArrowDown.pressed && lastKey.value === "ArrowDown") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...config.player, velocity: { x: 0, y: 5 } },
          rectangle: boundary,
        })
      ) {
        config.player.velocity.y = 0;
        break;
      } else {
        config.player.velocity.y = 5;
      }
    }
  } else if (config.keys.ArrowLeft.pressed && lastKey.value === "ArrowLeft") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...config.player, velocity: { x: -5, y: 0 } },
          rectangle: boundary,
        })
      ) {
        config.player.velocity.x = 0;
        break;
      } else {
        config.player.velocity.x = -5;
      }
    }
  } else if (config.keys.ArrowRight.pressed && lastKey.value === "ArrowRight") {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        circleCollidesWithRectangle({
          circle: { ...config.player, velocity: { x: 5, y: 0 } },
          rectangle: boundary,
        })
      ) {
        config.player.velocity.x = 0;
        break;
      } else {
        config.player.velocity.x = 5;
      }
    }
  }
}
