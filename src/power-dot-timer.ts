import { Ghost } from "./ghost-class";
import { showPowerUpState } from "./handle-power-ups";
import { Player } from "./player-class";

export type PowerDotTimerArgs = {
  ghosts: Ghost[];
  player: Player;
  activeSec: number;
};

export function powerDotTimer({
  ghosts,
  player,
  activeSec,
}: PowerDotTimerArgs) {
  showPowerUpState(player);
  setTimeout(() => {
    player.powerUpActive = false;
    player.powerUpAboutToExpire = false;
    ghosts.forEach((ghost) => {
      ghost.blinking = false;
      ghost.scared = false;
      // ghost.eaten = false;
    });
    console.log("POWER DOT TIMER ENDING!!!", 1000 * activeSec);
    console.log("POWER DOT TIMER WAS!!!", activeSec + " SECONDS TOTAL");

    showPowerUpState(player);
  }, activeSec);
}
