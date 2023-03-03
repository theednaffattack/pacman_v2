import { KeysRegisterType } from "./types";

type HandleKeyupArgsType = {
  key: string;
  keys: KeysRegisterType;
};

export function handleKeyup({ key, keys }: HandleKeyupArgsType) {
  switch (key) {
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;

    case "ArrowDown":
      keys.ArrowDown.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;

      break;

    default:
      break;
  }
}
