export type TileId = string;
export type SourceMap = Array<Array<TileId>>;

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

export type WcfAllowedTileList = Array<TileId>;

export interface WcfTile {
  selectedTile: TileId | undefined;
  allowedTiles: WcfAllowedTileList;
}

export type WcfData = Array<Array<WcfTile>>;
