export type PositionType = {
  x: number;
  y: number;
};

export type VelocityType = {
  x: number;
  y: number;
};

export type BoundaryConstructor = {
  position: PositionType;
  image: HTMLImageElement;
  color?: string;
};

export type PlayerConstructor = {
  position: PositionType;
  velocity: VelocityType;
};

export type PlayerType = {
  position: PositionType;
  radius: number;
  velocity: VelocityType;
};
