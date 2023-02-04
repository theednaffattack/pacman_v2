import { PositionType, VelocityType, PlayerConstructor } from "./types";
import { context, canvasErrorString } from "./main";

export class Player {
  position: PositionType;
  radius: number;
  velocity: VelocityType;
  constructor({ position, velocity }: PlayerConstructor) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }
  draw() {
    if (!context) {
      console.error(canvasErrorString);
      return;
    }
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
