import { Pellet } from "./pellet-class";
import { Player } from "./player-class";
import { Sound } from "./sound-class";

type HandlePelletsArgsType = {
  eatPelletSound: Sound;
  pellets: Pellet[];
  player: Player;
  score: number;
  scoreElement: HTMLElement | null;
};

export function handlePellets({
  eatPelletSound,
  pellets,
  player,
  score,
  scoreElement,
}: HandlePelletsArgsType) {
  for (let pelletIndex = pellets.length - 1; 0 <= pelletIndex; pelletIndex--) {
    const pellet = pellets[pelletIndex];

    pellet.draw();

    if (
      Math.hypot(
        pellet.position.x - player.position.x,
        pellet.position.y - player.position.y
      ) <
      pellet.radius + player.radius
    ) {
      pellets.splice(pelletIndex, 1);
      score += 10;
      if (player.madeTheFirstMove) {
        eatPelletSound.play();
      }
      if (!scoreElement) {
        console.error("Score element is missing!");
        return;
      } else {
        scoreElement.innerHTML = score.toString();
      }
    }
  }
}
