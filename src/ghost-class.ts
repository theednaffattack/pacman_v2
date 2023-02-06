import { SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";
import { canvasErrorString, context } from "./main";
import { spritePositionToImagePosition } from "./spirte-position-to-image-position";
import {
  CollisionType,
  GhostConstructor,
  GhostNameType,
  PositionType,
  SpriteGhostTypes,
  VelocityType,
} from "./types";

export class Ghost {
  blinking: boolean;
  image: HTMLImageElement;
  name: GhostNameType;
  position: PositionType;
  prevCollisions: CollisionType[];
  radius: number;
  scared: boolean;
  spriteIndex: [number, number];
  static speed = 2;
  speed: number;
  velocity: VelocityType;
  constructor({
    name,
    image,
    position,
    speed,
    spriteIndex,
    velocity,
  }: GhostConstructor) {
    this.position = position;
    this.velocity = velocity;
    this.radius = SPRITE_WIDTH / 2;
    // this.speed = 2;
    this.scared = false;
    this.blinking = false;
    this.speed = speed;
    this.name = name;
    this.image = image;
    this.prevCollisions = [];
    this.spriteIndex = spriteIndex;
  }
  draw() {
    if (!context) {
      console.error(canvasErrorString);
      return;
    }

    const sprites: SpriteGhostTypes = {
      blinky: {
        top: [0, 0],
        right: [1, 0],
        bottom: [1, 1],
        left: [0, 1],
      },
      inky: { top: [2, 2], right: [3, 2], bottom: [3, 3], left: [2, 3] },
      pinky: { top: [0, 2], right: [3, 0], bottom: [3, 1], left: [2, 1] },
      clyde: { top: [2, 0], right: [1, 2], bottom: [1, 3], left: [0, 3] },
      eaten: { top: [4, 0], right: [5, 0], bottom: [5, 1], left: [4, 1] },
      scared: { top: [4, 2], right: [5, 2], bottom: [5, 3], left: [4, 1] },
      flash: { top: [4, 0], right: [5, 0], bottom: [5, 1], left: [4, 3] },
    };

    let color = "";
    if (this.name === "blinky") {
      color = "red";
    }

    if (this.name === "inky") {
      color = "cyan";
    }

    if (this.name === "clyde") {
      color = "orange";
    }
    if (this.name === "pinky") {
      color = "pink";
    }

    // GHOSTS AS CIRCLES
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.scared ? "blue" : color;
    context.fill();
    context.closePath();

    let spritePosition: {
      x: number;
      y: number;
    } = { x: sprites[this.name].right[1], y: sprites[this.name].right[0] };

    if (this.velocity.y < 0) {
      // moving up
      spritePosition = spritePositionToImagePosition({
        row: sprites[this.name].top[0],
        col: sprites[this.name].top[1],
      });
    } else if (this.velocity.x > 0) {
      // moving right
      spritePosition = spritePositionToImagePosition({
        col: sprites[this.name].right[0],
        row: sprites[this.name].right[1],
      });
    } else if (this.velocity.y > 0) {
      // moving down
      spritePosition = spritePositionToImagePosition({
        col: sprites[this.name].bottom[0],
        row: sprites[this.name].bottom[1],
      });
    } else if (this.velocity.x < 0) {
      // moving left
      spritePosition = spritePositionToImagePosition({
        col: sprites[this.name].left[0],
        row: sprites[this.name].left[1],
      });
    }
    if (!this.scared) {
      context.drawImage(
        this.image,
        spritePosition.x,
        spritePosition.y,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        this.position.x / 2,
        this.position.y / 2,
        SPRITE_WIDTH,
        SPRITE_HEIGHT
      );
    } else {
      spritePosition = spritePositionToImagePosition({
        col: sprites["scared"].left[1],
        row: sprites["scared"].left[0],
      });

      console.log("SCARED", { spritePosition });

      context.drawImage(
        this.image,
        spritePosition.x,
        spritePosition.y,
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        this.position.x / 2,
        this.position.y / 2,
        SPRITE_WIDTH,
        SPRITE_HEIGHT
      );
    }
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
