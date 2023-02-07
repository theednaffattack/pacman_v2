import { SPRITE_HEIGHT, SPRITE_WIDTH } from "./constants";
import { spritePositionToImagePosition } from "./spirte-position-to-image-position";
import type {
  CollisionType,
  GhostConstructor,
  GhostNameType,
  PositionType,
  SpriteGhostTypes,
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
    this.spriteIndex = spriteIndex;
  }
  draw() {
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
      eaten: { top: [4, 2], right: [5, 2], bottom: [5, 3], left: [4, 3] },
      scared: { top: [4, 0], right: [5, 0], bottom: [5, 1], left: [4, 1] },
      flash: { top: [6, 0], right: [7, 0], bottom: [5, 3], left: [6, 1] },
    };

    // // GHOSTS AS CIRCLES
    // let color = "";
    // if (this.name === "blinky") {
    //   color = "red";
    // }

    // if (this.name === "inky") {
    //   color = "cyan";
    // }

    // if (this.name === "clyde") {
    //   color = "orange";
    // }
    // if (this.name === "pinky") {
    //   color = "pink";
    // }

    // this.context.beginPath();
    // this.context.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.radius,
    //   0,
    //   Math.PI * 2
    // );
    // this.context.fillStyle = this.scared ? "blue" : color;
    // this.context.fill();
    // this.context.closePath();

    // let spritePosition: {
    //   x: number;
    //   y: number;
    // } = { x: sprites[this.name].right[1], y: sprites[this.name].right[0] };

    let spritePosition = { x: 0, y: 0 };

    if (this.velocity.y < 0 && !this.scared) {
      // moving up
      spritePosition = spritePositionToImagePosition({
        row: sprites[this.name].top[0],
        col: sprites[this.name].top[1],
      });
    } else if (this.velocity.x > 0 && !this.scared) {
      // moving right
      spritePosition = spritePositionToImagePosition({
        col: sprites[this.name].right[0],
        row: sprites[this.name].right[1],
      });
    } else if (this.velocity.y > 0 && !this.scared) {
      // moving down
      spritePosition = spritePositionToImagePosition({
        col: sprites[this.name].bottom[0],
        row: sprites[this.name].bottom[1],
      });
    } else if (this.velocity.x < 0 && !this.scared) {
      // moving left
      spritePosition = spritePositionToImagePosition({
        col: sprites[this.name].left[0],
        row: sprites[this.name].left[1],
      });
    } else if (this.velocity.y < 0 && this.scared) {
      // moving up - SCARED
      spritePosition = spritePositionToImagePosition({
        col: this.eaten ? sprites.eaten.top[0] : sprites.scared.top[0],
        row: this.eaten ? sprites.eaten.top[1] : sprites.scared.top[1],
      });
    } else if (this.velocity.x > 0) {
      // moving right - SCARED
      spritePosition = spritePositionToImagePosition({
        col: this.eaten ? sprites.eaten.right[0] : sprites.scared.right[0],
        row: this.eaten ? sprites.eaten.right[1] : sprites.scared.right[1],
      });
    } else if (this.velocity.y > 0) {
      // moving down - SCARED
      spritePosition = spritePositionToImagePosition({
        col: this.eaten ? sprites.eaten.bottom[0] : sprites.scared.bottom[0],
        row: this.eaten ? sprites.eaten.bottom[1] : sprites.scared.bottom[1],
      });
    } else if (this.velocity.x < 0) {
      // moving left - SCARED
      spritePosition = spritePositionToImagePosition({
        col: this.eaten ? sprites.eaten.left[0] : sprites.scared.left[0],
        row: this.eaten ? sprites.eaten.left[1] : sprites.scared.left[1],
      });
    }

    this.context.drawImage(
      this.image,
      spritePosition.x,
      spritePosition.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.position.x - SPRITE_WIDTH / 2,
      this.position.y - SPRITE_HEIGHT / 2,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
