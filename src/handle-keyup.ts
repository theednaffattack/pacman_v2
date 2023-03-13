import { ConfigType } from "./types";

type HandleKeyupArgsType = {
  key: string;
  // keys: KeysRegisterType;
  config: ConfigType;
};

export function handleKeyup({ config, key }: HandleKeyupArgsType) {
  switch (key) {
    case "ArrowUp":
      config.keys.ArrowUp.pressed = false;
      break;

    case "ArrowDown":
      config.keys.ArrowDown.pressed = false;
      break;

    case "ArrowLeft":
      config.keys.ArrowLeft.pressed = false;
      break;

    case "ArrowRight":
      config.keys.ArrowRight.pressed = false;

      break;

    default:
      break;
  }
}
