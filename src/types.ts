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

export interface PlayerConstructor {
  position: PositionType;
  velocity: VelocityType;
}

export interface GhostConstructor extends PlayerConstructor {
  position: PositionType;
  speed: number;
  velocity: VelocityType;
  color: string;
}

export type PlayerType = {
  position: PositionType;
  radius: number;
  velocity: VelocityType;
};

export type CollisionType = "top" | "right" | "bottom" | "left";
