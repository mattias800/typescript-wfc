import * as React from "react";
import { cssColor } from "@stenajs-webui/theme";
import { TileAtlasImage } from "./TileAtlasImage.tsx";
import { TileId } from "../../../wfc/CommonTypes.ts";

export interface SelectableTileAtlasImageProps {
  tileId: TileId;
  onSelectTile: (tileId: TileId) => void;
  selected: boolean;
}

export const SelectableTileAtlasImage: React.FC<
  SelectableTileAtlasImageProps
> = ({ tileId, onSelectTile, selected }) => {
  return (
    <button
      key={tileId}
      onClick={() => onSelectTile(tileId)}
      style={{
        borderRadius: "4px",
        border:
          "4px solid " +
          (selected
            ? cssColor("--lhds-color-blue-500")
            : cssColor("--lhds-color-ui-200")),
      }}
    >
      <TileAtlasImage tileId={tileId} />
    </button>
  );
};
