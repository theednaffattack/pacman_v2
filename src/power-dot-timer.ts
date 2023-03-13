import { Timer } from "./timer-class";
import { ConfigType } from "./types";

export function callPowerDotTimer({ config }: { config: ConfigType }) {
  return new Timer(function () {
    config.player.powerUpActive = false;
    config.player.powerUpAboutToExpire = false;
    config.ghosts.forEach((ghost) => {
      ghost.blinking = false;
      ghost.scared = false;
      ghost.eaten = false;
    });
    console.log("TIMER TOO!!!");
  }, 1000 * config.powerDotActiveSeconds);
}
