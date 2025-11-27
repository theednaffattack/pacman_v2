import { Ghost } from "./ghost-class";
import { Player } from "./player-class";
import { Sound } from "./sound-class";
import { PowerDotTimerArgs } from "./power-dot-timer";

type HandlePowerUpsArgsType = {
  eatPowerUpSound: Sound;
  ghosts: Ghost[];
  powerUps: any[];
  player: Player;
  powerDotTimer: (arg0: PowerDotTimerArgs) => void;
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
      showPowerUpState(player);

      // If we already have active timers we
      // need to clear them before setting new ones.
      player.timers.forEach((timer) => {
        clearTimeout(timer);
      });

      // Now clear out the timers array
      player.timers = [];
      let newTimer = powerDotTimer({
        ghosts,
        player,
        activeSec: 10,
      });

      player.timers.push(newTimer);

      player.timers.push(powerDotAboutToExpireTimer);

      // Make the ghosts scared
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

export function showPowerUpState(player: Player) {
  const displayElement = document.getElementById("displayArea");
  let myVar: "active" | "inactive";
  if (displayElement) {
    switch (player.powerUpActive) {
      case true:
        myVar = "active";
        break;
      case false:
        myVar = "inactive";
        break;
    }
    displayElement.textContent = myVar;
  }
}
