import { PositionType } from "./types";

export class PowerUp {
  context: CanvasRenderingContext2D;
  position: PositionType;
  radius: number;
  constructor({
    context,
    position,
  }: { position: PositionType } & { context: CanvasRenderingContext2D }) {
    this.context = context;
    this.position = position;
    this.radius = 8;
  }

  draw() {
    this.context.beginPath();
    this.context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    this.context.fillStyle = "white";
    this.context.fill();
    this.context.closePath();
  }
}
