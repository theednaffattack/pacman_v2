import { ConfigType, LastKeyType } from "./types";

type HandleKeydownArgsType = {
  key: string;
  lastKey: LastKeyType;
  config: ConfigType;
};

export function handleKeydown({
  config,
  key,
  // keys,
  lastKey,
}: HandleKeydownArgsType) {
  switch (key) {
    case "ArrowUp":
      if (!config.player.madeTheFirstMove) {
        config.player.madeTheFirstMove = true;
      }
      config.keys.ArrowUp.pressed = true;
      lastKey.value = "ArrowUp";
      break;
    case "ArrowDown":
      if (!config.player.madeTheFirstMove) {
        config.player.madeTheFirstMove = true;
      }
      config.keys.ArrowDown.pressed = true;
      lastKey.value = "ArrowDown";
      break;
    case "ArrowLeft":
      if (!config.player.madeTheFirstMove) {
        config.player.madeTheFirstMove = true;
      }
      config.keys.ArrowLeft.pressed = true;
      lastKey.value = "ArrowLeft";

      break;
    case "ArrowRight":
      config.keys.ArrowRight.pressed = true;
      lastKey.value = "ArrowRight";
      break;
    default:
      break;
  }
}
