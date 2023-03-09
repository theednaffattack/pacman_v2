import { SPRITE_HEIGHT, SPRITE_WIDTH, TILE_SIZE } from "./constants";
import { Player } from "./player-class";
import { spritePositionToImagePosition } from "./sprite-position-to-image-position";
import { spriteEntities } from "./sprite-map";
import { spritePicker } from "./spritePicker";
import type {
  CollisionType,
  GhostConstructor,
  GhostNameType,
  PathfinderResultType,
  PixelPositionType,
  VelocityType,
} from "./types";

export interface GhostLike {
  blinking: boolean;
  context: CanvasRenderingContext2D;
  eaten: boolean;
  ghostPenPath: PathfinderResultType;
  ghostPenPathIndex: number;
  image: HTMLImageElement;
  name: GhostNameType;
  position: PixelPositionType;
  prevCollisions: CollisionType[];
  radius: number;
  scared: boolean;
  scaredAboutToExpireTimer: number;
  scaredAboutToExpireTimerDefault: number;
  spriteIndex: [number, number];
  speed: number;
  velocity: VelocityType;
}

export class Ghost {
  blinking: boolean;
  context: CanvasRenderingContext2D;
  eaten: boolean;
  exitingPen: boolean;
  /** An array of tuples of type [number, number] */
  ghostPenEntryPath: PathfinderResultType;
  ghostPenExitPath: PathfinderResultType;
  ghostPenEntryPathIndex: number;
  ghostPenExitPathIndex: number;
  image: HTMLImageElement;
  name: GhostNameType;
  position: PixelPositionType;
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
    this.exitingPen = false;
    this.ghostPenEntryPath = [];
    this.ghostPenExitPath = [];
    this.ghostPenEntryPathIndex = 0;
    this.ghostPenExitPathIndex = 0;
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

  update(
    ctx: CanvasRenderingContext2D,
    pacman: Player,
    mapHeight: number,
    mapWidth: number
  ) {
    this.draw(ctx, pacman);
    // If ghost exits tunnel to the left
    if (this.position.x < 0) {
      this.position.x = mapWidth;
    }
    // If ghost exits tunnel to the right
    if (this.position.x > mapWidth) {
      this.position.x = 0;
    }
    // If ghost exits tunnel to the top
    if (this.position.y < 0) {
      this.position.y = mapHeight;
    }
    // If ghost exits tunnel to the bottom
    if (this.position.y > mapHeight) {
      this.position.y = 0;
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  #setImage(ctx: CanvasRenderingContext2D, pacman: Player) {
    // The default normal ghost
    let ghostSprite = spritePicker({ ghost: this, player: pacman });

    if (pacman.powerUpActive && !this.eaten) {
      this.#setImageWhenPowerUpIsActive(ctx, pacman);
    }

    if (this.eaten) {
      let eyeDirection = {
        col: spriteEntities.eaten.right[0],
        row: spriteEntities.eaten.right[1],
      };
      if (this.velocity.y < 0) {
        eyeDirection = {
          col: spriteEntities.eaten.top[0],
          row: spriteEntities.eaten.top[1],
        };
      } else if (this.velocity.x > 0) {
        eyeDirection = {
          col: spriteEntities.eaten.right[0],
          row: spriteEntities.eaten.right[1],
        };
      } else if (this.velocity.y > 0) {
        eyeDirection = {
          col: spriteEntities.eaten.bottom[0],
          row: spriteEntities.eaten.bottom[1],
        };
      } else if (this.velocity.x < 0) {
        eyeDirection = {
          col: spriteEntities.eaten.left[0],
          row: spriteEntities.eaten.left[1],
        };
      }

      ghostSprite = spritePositionToImagePosition({
        col: eyeDirection.col,
        row: eyeDirection.row,
      });
    }

    ctx.drawImage(
      this.image,
      ghostSprite.x,
      ghostSprite.y,
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
      // When ghosts are eaten we care about which
      // direction they're heading (eyeball direction)
      if (this.eaten) {
        let eyeDirection = { col: 0, row: 0 };
        if (this.velocity.y < 0) {
          eyeDirection = {
            col: spriteEntities.eaten.top[0],
            row: spriteEntities.eaten.top[1],
          };
        } else if (this.velocity.x > 0) {
          eyeDirection = {
            col: spriteEntities.eaten.right[0],
            row: spriteEntities.eaten.right[1],
          };
        } else if (this.velocity.y > 0) {
          eyeDirection = {
            col: spriteEntities.eaten.bottom[0],
            row: spriteEntities.eaten.bottom[1],
          };
        } else if (this.velocity.x < 0) {
          eyeDirection = {
            col: spriteEntities.eaten.left[0],
            row: spriteEntities.eaten.left[1],
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
