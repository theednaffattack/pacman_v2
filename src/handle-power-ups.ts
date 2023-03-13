import { Sound } from "./sound-class";
import { Timer } from "./timer-class";
import { ConfigType } from "./types";

type HandlePowerUpsArgsType = {
  eatPowerUpSound: Sound;
  // powerDotTimer: Timer;
  // powerDotAboutToExpireTimer: Timer;
  config: ConfigType;
  scoreElement: HTMLElement | null;
};

export function handlePowerUps({
  eatPowerUpSound,
  config,
  scoreElement,
}: HandlePowerUpsArgsType) {
  for (
    let powerUpIndex = config.powerUps.length - 1;
    0 <= powerUpIndex;
    powerUpIndex--
  ) {
    const powerUp = config.powerUps[powerUpIndex];
    powerUp.draw();

    // Player collides with power up, eat powerup
    if (
      Math.hypot(
        powerUp.position.x - config.player.position.x,
        powerUp.position.y - config.player.position.y
      ) <
      powerUp.radius + config.player.radius
    ) {
      config.powerUps.splice(powerUpIndex, 1);
      // config.player.powerUpActive = true;
      // config.player.powerUpAboutToExpire = false;
      eatPowerUpSound.play();

      // Make ghosts scared
      config.ghosts.forEach((ghost) => {
        ghost.behavior = "scared";

        setTimeout(() => {
          ghost.behavior = "default";
        }, 1000 * config.powerDotActiveSeconds);
      });

      // // If we already have active timers we
      // // need to clear them before setting new ones.
      // config.player.timers.forEach((timer) => {
      //   // clearTimeout(timer);
      //   timer.clear();
      // });

      // // Now clear out the timers array
      // config.player.timers = [];
      // powerDotTimer.resume();
      // config.player.timers.push(powerDotTimer);
      // powerDotAboutToExpireTimer.resume();
      // config.player.timers.push(powerDotAboutToExpireTimer);

      // config.ghosts.forEach((ghost) => {
      //   if (config.player.powerUpActive) {
      //     ghost.scared = true;
      //   } else {
      //     ghost.scared = false;
      //   }
      // });
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
