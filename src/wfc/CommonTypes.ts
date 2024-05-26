export type TileId = string;

export interface TileMap {
  cols: number;
  rows: number;
  tiles: Array<TileId>; // First <col> number of elements is the first row.
}

export interface Coordinate {
  col: number;
  row: number;
}

export interface RuleSet {
  [key: TileId]: AllowedNeighbours;
}

export interface AllowedNeighbours {
  right: Array<TileId>;
  left: Array<TileId>;
  up: Array<TileId>;
  down: Array<TileId>;
}

export interface WfcTile {
  collapsed: TileId | undefined;
  options: Array<TileId>;
}

export interface WfcData {
  cols: number;
  rows: number;
  tiles: Array<WfcTile>; // First <col> number of elements is the first row.
}
