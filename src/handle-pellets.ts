import { Sound } from "./sound-class";
import { ConfigType } from "./types";

type HandlePelletsArgsType = {
  eatPelletSound: Sound;
  config: ConfigType;
  scoreElement: HTMLElement | null;
};

export function handlePellets({
  eatPelletSound,
  config,
  scoreElement,
}: HandlePelletsArgsType) {
  for (
    let pelletIndex = config.pellets.length - 1;
    0 <= pelletIndex;
    pelletIndex--
  ) {
    const pellet = config.pellets[pelletIndex];

    pellet.draw();

    if (
      Math.hypot(
        pellet.position.x - config.player.position.x,
        pellet.position.y - config.player.position.y
      ) <
      pellet.radius + config.player.radius
    ) {
      config.pellets.splice(pelletIndex, 1);
      config.score += 10;
      if (config.player.madeTheFirstMove) {
        eatPelletSound.play();
      }
      if (!scoreElement) {
        console.error("Score element is missing!");
        return;
      } else {
        scoreElement.innerHTML = config.score.toString();
      }
    }
  }
}
