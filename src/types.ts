import { Boundary } from "./boundary-class";
import { Pellet } from "./pellet-class";
import { PowerUp } from "./power-up-class";

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
  name: GhostNameType;
  image: HTMLImageElement;
  position: PositionType;
  speed: number;
  spriteIndex: [number, number];
  velocity: VelocityType;
}

export type GhostSpriteIndexType = {
  top: [number, number];
  right: [number, number];
  bottom: [number, number];
  left: [number, number];
};

export type GhostNameType =
  | "blinky"
  | "pinky"
  | "inky"
  | "clyde"
  | "scared"
  | "flash"
  | "eaten";

export type RowColumnType = {
  row: number;
  col: number;
};

export type PlayerType = {
  position: PositionType;
  radius: number;
  velocity: VelocityType;
};

export type CollisionType = "top" | "right" | "bottom" | "left";

export type SpriteGhostTypes = {
  blinky: GhostSpriteIndexType;
  inky: GhostSpriteIndexType;
  pinky: GhostSpriteIndexType;
  clyde: GhostSpriteIndexType;
  eaten: GhostSpriteIndexType;
  scared: GhostSpriteIndexType;
  flash: GhostSpriteIndexType;
};

export type KeyType = "" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export type InitType = {
  boundaries: Boundary[];
  pellets: Pellet[];
  powerUps: PowerUp[];
};
