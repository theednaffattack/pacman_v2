import { Boundary } from "./boundary-class";
import { GridPointClass } from "./grid-point-class";
import { Pellet } from "./pellet-class";
import { PowerUp } from "./power-up-class";
import { mapEntities } from "./sprite-map";

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
  spriteIndex: [number, number];
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

export type GhostEntityTypes = {
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

export type CoordsTuple = [XNum, YNum];

export type PointsEntityType = {
  pellet: "";
  powerUp: "";
  cherry: "";
  banana: "";
  orange: "";
};

export type ObstacleType = {
  block: [XNum, YNum];
  capLeft: [XNum, YNum];
  capRight: [XNum, YNum];
  capBottom: [XNum, YNum];
  capTop: [XNum, YNum];
  pipeConnectorBottom: [XNum, YNum];
  pipeConnectorLeft: [XNum, YNum];
  pipeConnectorRight: [XNum, YNum];
  pipeConnectorTop: [XNum, YNum];
  pipeConnectorDownward: [XNum, YNum];
  pipeHorizontal: [XNum, YNum];
  pipeCorner1: [XNum, YNum];
  pipeCorner2: [XNum, YNum];
  pipeCorner3: [XNum, YNum];
  pipeCorner4: [XNum, YNum];
  pipeCross: [XNum, YNum];
  pipeVertical: [XNum, YNum];
  upperLeftHalfBlock: [XNum, YNum];
  upperRightHalfBlock: [XNum, YNum];
  bottomLeftHalfBlock: [XNum, YNum];
  bottomRightHalfBlock: [XNum, YNum];
  topOnlyBar: [XNum, YNum];
  bottomOnlyBar: [XNum, YNum];
  leftOnlyBar: [XNum, YNum];
  rightOnlyBar: [XNum, YNum];
  ghostGate: [XNum, YNum];
};

export type MapTileEntityType = PointsEntityType & ObstacleType;

export type MapTileEntityKeys = keyof MapTileEntityType;

export type MapEntityTypes = keyof typeof mapEntities;
// BEG TYPES

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

export type InitArgsType = {
  startCoords: GridPointClass;
  goal: GridPointClass;
  grid: GridPointClass[][];
};

export type MapTileSymbolType =
  | "-"
  | "_"
  | "|"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "ul"
  | "p"
  | "b"
  | "to"
  | "lo"
  | "ro"
  | "ur"
  | "br"
  | "bo"
  | "bl"
  | "gg"
  | "."
  | "+"
  | "^"
  | "["
  | "]"
  | " "
  | "";

export type RetrieveGhostsArgsType = {
  context: CanvasRenderingContext2D;
  map: "levelOneMap" | "levelTwoMap" | "levelThreeMap";
};

export type ConvertSymbolMapToPathMatrixArgs = {
  mapName: RetrieveGhostsArgsType["map"];
  walkableValues?: MapTileSymbolType[];
};
