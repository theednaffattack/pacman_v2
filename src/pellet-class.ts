import { PixelPositionType } from "./types";

export class Pellet {
  context: CanvasRenderingContext2D;
  position: PixelPositionType;
  radius: number;
  constructor({
    context,
    position,
  }: { position: PixelPositionType } & { context: CanvasRenderingContext2D }) {
    this.context = context;
    this.position = position;
    this.radius = 3;
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
