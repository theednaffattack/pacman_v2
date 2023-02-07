import { PositionType, VelocityType, PlayerConstructor } from "./types";
// import { this.context, canvasErrorString } from "./main";

export class Player {
  context: CanvasRenderingContext2D;
  openRate: number;
  position: PositionType;
  radians: number;
  radius: number;
  rotation: number;
  velocity: VelocityType;

  constructor({ context, position, velocity }: PlayerConstructor) {
    this.openRate = 0.08;
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.radians = 0.75;
    this.rotation = 0;
    this.context = context;
  }
  draw() {
    this.context.save();
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.rotation);
    this.context.translate(-this.position.x, -this.position.y);
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    this.context.lineTo(this.position.x, this.position.y);
    this.context.fillStyle = "yellow";
    this.context.fill();
    this.context.closePath();
    this.context.restore();
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
