import { SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";
import { Player } from "./player-class";
import { spritePositionToImagePosition } from "./spirte-position-to-image-position";
import { sprites } from "./sprite-map";
import { spritePicker } from "./spritePicker";
import type {
  CollisionType,
  GhostConstructor,
  GhostNameType,
  PositionType,
  VelocityType,
} from "./types";

export class Ghost {
  blinking: boolean;
  context: CanvasRenderingContext2D;
  eaten: boolean;
  image: HTMLImageElement;
  name: GhostNameType;
  position: PositionType;
  prevCollisions: CollisionType[];
  radius: number;
  scared: boolean;
  scaredAboutToExpireTimer: number;
  scaredAboutToExpireTimerDefault: number;
  spriteIndex: [number, number];
  static speed = 2;
  speed: number;
  velocity: VelocityType;
  constructor({
    context,
    name,
    image,
    position,
    speed = 2,
    spriteIndex,
    velocity,
  }: GhostConstructor) {
    this.context = context;
    this.position = position;
    this.velocity = velocity;
    this.radius = SPRITE_WIDTH / 2;
    this.eaten = false;
    this.scared = false;
    this.blinking = false;
    this.speed = speed;
    this.name = name;
    this.image = image;
    this.prevCollisions = [];
    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
    this.spriteIndex = spriteIndex;
  }

  draw(ctx: CanvasRenderingContext2D, pacman: Player) {
    this.#setImage(ctx, pacman);
  }

  update(ctx: CanvasRenderingContext2D, pacman: Player) {
    this.draw(ctx, pacman);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  #setImage(ctx: CanvasRenderingContext2D, pacman: Player) {
    // The default normal ghost
    let obj = spritePicker({ ghost: this, player: pacman });

    if (pacman.powerUpActive) {
      this.#setImageWhenPowerUpIsActive(ctx, pacman);
    }

    ctx.drawImage(
      this.image,
      obj.x,
      obj.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.position.x - SPRITE_WIDTH / 2,
      this.position.y - SPRITE_HEIGHT / 2,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
  }

  // Reminder, this method is only called when powerUp is active
  #setImageWhenPowerUpIsActive(ctx: CanvasRenderingContext2D, pacman: Player) {
    // Default scared ghost
    let obj = spritePositionToImagePosition({ col: 9, row: 0 });
    if (pacman.powerUpAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0 && !this.eaten) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        const isGhostImageScared =
          JSON.stringify(spritePositionToImagePosition({ col: 9, row: 0 })) ===
          JSON.stringify(
            spritePositionToImagePosition({ col: obj.x, row: obj.y })
          );
        if (isGhostImageScared) {
          // console.log("NOT BLINKING");

          // Blink scared ghost
          obj = spritePositionToImagePosition({ col: 9, row: 0 });
          // this.blinking = true;
        } else {
          // Blink white ghost
          obj = spritePositionToImagePosition({ col: 8, row: 0 });
          // this.blinking = false;
        }
      }

      // When ghosts are eaten and the power up is expiring
      // When ghosts are eaten we care about
      // which direction they're heading (eyeball direction)
      if (this.eaten) {
        let eyeDirection = { col: 0, row: 0 };
        if (this.velocity.y < 0) {
          eyeDirection = {
            col: sprites.eaten.top[0],
            row: sprites.eaten.top[1],
          };
        } else if (this.velocity.x > 0) {
          eyeDirection = {
            col: sprites.eaten.right[0],
            row: sprites.eaten.right[1],
          };
        } else if (this.velocity.y > 0) {
          eyeDirection = {
            col: sprites.eaten.bottom[0],
            row: sprites.eaten.bottom[1],
          };
        } else if (this.velocity.x < 0) {
          eyeDirection = {
            col: sprites.eaten.left[0],
            row: sprites.eaten.left[1],
          };
        }

        obj = spritePositionToImagePosition({
          col: eyeDirection.col,
          row: eyeDirection.row,
        });
      }

      ctx.drawImage(
        this.image,
        obj.x,
        obj.y,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        this.position.x - SPRITE_WIDTH / 2,
        this.position.y - SPRITE_HEIGHT / 2,
        SPRITE_WIDTH,
        SPRITE_HEIGHT
      );
    }
  }
}
