import { Ghost } from "./ghost-class";
import { Player } from "./player-class";
import { Sound } from "./sound-class";

type HandlePowerUpsArgsType = {
  eatPowerUpSound: Sound;
  ghosts: Ghost[];
  powerUps: any[];
  player: Player;
  powerDotTimer: any;
  powerDotAboutToExpireTimer: any;
  config: { score: number };
  scoreElement: HTMLElement | null;
};

export function handlePowerUps({
  eatPowerUpSound,
  ghosts,
  player,
  powerDotAboutToExpireTimer,
  powerDotTimer,
  powerUps,
  config,
  scoreElement,
}: HandlePowerUpsArgsType) {
  for (
    let powerUpIndex = powerUps.length - 1;
    0 <= powerUpIndex;
    powerUpIndex--
  ) {
    const powerUp = powerUps[powerUpIndex];
    powerUp.draw();

    // Player collides with power up eat powerup
    if (
      Math.hypot(
        powerUp.position.x - player.position.x,
        powerUp.position.y - player.position.y
      ) <
      powerUp.radius + player.radius
    ) {
      powerUps.splice(powerUpIndex, 1);
      player.powerUpActive = true;
      player.powerUpAboutToExpire = false;
      eatPowerUpSound.play();

      // If we already have active timers we
      // need to clear them before setting new ones.
      player.timers.forEach((timer) => {
        clearTimeout(timer);
      });

      // Now clear out the timers array
      player.timers = [];

      player.timers.push(powerDotTimer);

      player.timers.push(powerDotAboutToExpireTimer);

      ghosts.forEach((ghost) => {
        if (player.powerUpActive) {
          ghost.scared = true;
        } else {
          ghost.scared = false;
        }
      });
      config.score += 20;
      if (!scoreElement) {
        console.error("Score element is missing!");
        return;
      } else {
        scoreElement.innerHTML = config.score.toString();
      }
    }
  }
}
