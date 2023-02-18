import { Boundary } from "./boundary-class";
import { GridPointClass } from "./grid-point-class";
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
  context: CanvasRenderingContext2D;
  position: PositionType;
  spriteIndex: readonly [number, number];
};

export interface PlayerConstructor {
  position: PositionType;
  velocity: VelocityType;
  context: CanvasRenderingContext2D;
}

export interface GhostConstructor extends PlayerConstructor {
  context: CanvasRenderingContext2D;
  name: GhostNameType;
  image: HTMLImageElement;
  position: PositionType;
  speed: number;
  spriteIndex: [number, number];
  velocity: VelocityType;
}

export type GhostSpriteIndexType = {
  top: readonly [number, number];
  right: readonly [number, number];
  bottom: readonly [number, number];
  left: readonly [number, number];
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

export type SpriteEntityTypes = {
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
  context: CanvasRenderingContext2D;
  pellets: Pellet[];
  powerUps: PowerUp[];
};

export type KeysRegisterType = {
  ArrowUp: {
    pressed: boolean;
  };
  ArrowDown: {
    pressed: boolean;
  };
  ArrowLeft: {
    pressed: boolean;
  };
  ArrowRight: {
    pressed: boolean;
  };
};
type XNum = number;
type YNum = number;

export type CoordsTuple = readonly [XNum, YNum];

export type ObstacleType = {
  block: readonly [XNum, YNum];
  capLeft: readonly [XNum, YNum];
  capRight: readonly [XNum, YNum];
  capBottom: readonly [XNum, YNum];
  capTop: readonly [XNum, YNum];
  pipeConnectorBottom: readonly [XNum, YNum];
  pipeConnectorLeft: readonly [XNum, YNum];
  pipeConnectorRight: readonly [XNum, YNum];
  pipeConnectorTop: readonly [XNum, YNum];
  pipeConnectorDownward: readonly [XNum, YNum];
  pipeHorizontal: readonly [XNum, YNum];
  pipeCorner1: readonly [XNum, YNum];
  pipeCorner2: readonly [XNum, YNum];
  pipeCorner3: readonly [XNum, YNum];
  pipeCorner4: readonly [XNum, YNum];
  pipeCross: readonly [XNum, YNum];
  pipeVertical: readonly [XNum, YNum];
  upperLeftHalfBlock: readonly [XNum, YNum];
  upperRighttHalfBlock: readonly [XNum, YNum];
  bottomLeftHalfBlock: readonly [XNum, YNum];
  bottomRightHalfBlock: readonly [XNum, YNum];
  topOnlyBar: readonly [XNum, YNum];
  bottomOnlyBar: readonly [XNum, YNum];
  leftOnlyBar: readonly [XNum, YNum];
  rightOnlyBar: readonly [XNum, YNum];
  ghostGate: readonly [XNum, YNum];
};

// BEG TYPES
type GridNode = { x: number; y: number };

export type SearchArgsType = {
  start: GridPointClass;
  goal: GridPointClass;
  grid: GridPointClass[][];
};

export type GridPointType = {
  x: number;
  y: number;
  fScore: number;
  gScore: number;
  heuristic: number;
  neighbors: GridPointClass[];
  parent: GridPointClass | undefined;
};
// END TYPES
