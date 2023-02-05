import { PositionType, VelocityType, PlayerConstructor } from "./types";
import { context, canvasErrorString } from "./main";

export class Player {
  openRate: number;
  position: PositionType;
  radians: number;
  radius: number;
  rotation: number;
  velocity: VelocityType;

  constructor({ position, velocity }: PlayerConstructor) {
    this.openRate = 0.08;
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.rotation = 0;
  }
  draw() {
    if (!context) {
      console.error(canvasErrorString);
      return;
    }

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation);
    context.translate(-this.position.x, -this.position.y);
    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    context.lineTo(this.position.x, this.position.y);
    context.fillStyle = "yellow";
    context.fill();
    context.closePath();
    context.restore();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.75) {
      this.openRate = -this.openRate;
    }

    this.radians += this.openRate;
  }
}
