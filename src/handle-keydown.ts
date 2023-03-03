import { Player } from "./player-class";
import { KeysRegisterType, LastKeyType } from "./types";

type HandleKeydownArgsType = {
  key: string;
  keys: KeysRegisterType;
  lastKey: LastKeyType;
  player: Player;
};

export function handleKeydown({
  key,
  keys,
  lastKey,
  player,
}: HandleKeydownArgsType) {
  switch (key) {
    case "ArrowUp":
      if (!player.madeTheFirstMove) {
        player.madeTheFirstMove = true;
      }
      keys.ArrowUp.pressed = true;
      lastKey.value = "ArrowUp";
      break;
    case "ArrowDown":
      if (!player.madeTheFirstMove) {
        player.madeTheFirstMove = true;
      }
      keys.ArrowDown.pressed = true;
      lastKey.value = "ArrowDown";
      break;
    case "ArrowLeft":
      if (!player.madeTheFirstMove) {
        player.madeTheFirstMove = true;
      }
      keys.ArrowLeft.pressed = true;
      lastKey.value = "ArrowLeft";

      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      lastKey.value = "ArrowRight";
      break;
    default:
      break;
  }
}
