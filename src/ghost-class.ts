import { SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";
import { Player } from "./player-class";
import { spriteEntities } from "./sprite-map";
import { spritePositionToImagePosition } from "./sprite-position-to-image-position";
import type {
  CollisionType,
  GhostConstructor,
  GhostNameType,
  PathfinderResultType,
  PixelPositionType,
  VelocityType,
} from "./types";

export interface GhostLike {
  behavior: "default" | "blinking" | "eaten" | "scared";
  // blinking: boolean;
  context: CanvasRenderingContext2D;
  // eaten: boolean;
  ghostPenPath: PathfinderResultType;
  ghostPenPathIndex: number;
  image: HTMLImageElement;
  name: GhostNameType;
  position: PixelPositionType;
  prevCollisions: CollisionType[];
  radius: number;
  // scared: boolean;
  scaredAboutToExpireTimer: number;
  scaredAboutToExpireTimerDefault: number;
  spriteIndex: [number, number];
  speed: number;
  velocity: VelocityType;
}

export class Ghost {
  behavior: "default" | "blinking" | "eaten" | "scared";
  // blinking: boolean;
  context: CanvasRenderingContext2D;
  /** The direction the ghost is facing */
  direction: "up" | "down" | "left" | "right" | "stationary";
  // eaten: boolean;
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
  // scared: boolean;
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
    this.behavior = "default";
    this.context = context;
    this.direction = "stationary";
    // this.eaten = false;
    this.exitingPen = false;
    this.ghostPenEntryPath = [];
    this.ghostPenExitPath = [];
    this.ghostPenEntryPathIndex = 0;
    this.ghostPenExitPathIndex = 0;
    // this.scared = false;
    // this.blinking = false;
    this.speed = speed;
    this.name = name;
    this.image = image;
    this.position = position;
    this.prevCollisions = [];
    this.radius = SPRITE_WIDTH / 2;
    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
    this.spriteIndex = spriteIndex;
    this.velocity = velocity;
  }

  draw(ctx: CanvasRenderingContext2D, pacman: Player) {
    let ghostSprite;
    switch (this.behavior) {
      case "default":
        ghostSprite = spritePositionToImagePosition({
          col: spriteEntities[this.name][this.direction][0],
          row: spriteEntities[this.name][this.direction][1],
        });
        break;
      default:
        ghostSprite = spritePositionToImagePosition({
          col: spriteEntities[this.behavior][this.direction][0],
          row: spriteEntities[this.behavior][this.direction][1],
        });
        break;
    }

    // The default normal ghost
    // let ghostSprite = spritePicker({ ghost: this });

    // let eyeDirection;

    // // Eye direction for normal ghosts
    // ghostSprite = spritePositionToImagePosition({
    //   col: eyeDirection.col,
    //   row: eyeDirection.row,
    // });

    // // Default scared ghost
    // ghostSprite = spritePositionToImagePosition({ col: 9, row: 0 });

    // // Eye direction for eaten ghosts
    // if (this.eaten) {
    //   if (this.velocity.y < 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.top[0],
    //       row: spriteEntities.eaten.top[1],
    //     };
    //   } else if (this.velocity.x > 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.right[0],
    //       row: spriteEntities.eaten.right[1],
    //     };
    //   } else if (this.velocity.y > 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.bottom[0],
    //       row: spriteEntities.eaten.bottom[1],
    //     };
    //   } else if (this.velocity.x < 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.left[0],
    //       row: spriteEntities.eaten.left[1],
    //     };
    //   }

    //   if (!eyeDirection) {
    //     throw new Error("Eye direction is null!");
    //   }
    //   //
    // }

    // if (this.scared && !this.eaten) {
    //   this.#setImageWhenPowerUpIsActive(ctx, pacman);
    // } else if (this.eaten) {
    //   let eyeDirection = {
    //     col: spriteEntities.eaten.right[0],
    //     row: spriteEntities.eaten.right[1],
    //   };
    //   if (this.velocity.y < 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.top[0],
    //       row: spriteEntities.eaten.top[1],
    //     };
    //   } else if (this.velocity.x > 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.right[0],
    //       row: spriteEntities.eaten.right[1],
    //     };
    //   } else if (this.velocity.y > 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.bottom[0],
    //       row: spriteEntities.eaten.bottom[1],
    //     };
    //   } else if (this.velocity.x < 0) {
    //     eyeDirection = {
    //       col: spriteEntities.eaten.left[0],
    //       row: spriteEntities.eaten.left[1],
    //     };
    //   }

    //   ghostSprite = spritePositionToImagePosition({
    //     col: eyeDirection.col,
    //     row: eyeDirection.row,
    //   });
    // } else if (!this.scared && !this.eaten) {
    //   ctx.drawImage(
    //     this.image,
    //     ghostSprite.x,
    //     ghostSprite.y,
    //     SPRITE_WIDTH,
    //     SPRITE_HEIGHT,
    //     this.position.x - SPRITE_WIDTH / 2,
    //     this.position.y - SPRITE_HEIGHT / 2,
    //     SPRITE_WIDTH,
    //     SPRITE_HEIGHT
    //   );
    // }

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
}
