import * as React from "react";
import { Column, Heading } from "@stenajs-webui/core";
import { Label } from "@stenajs-webui/elements";
import { TileAtlasDimensionSettings } from "./TileAtlasImporterSlice.ts";

export interface DimensionsSettingsFormProps {
  heading: string;
  settings: TileAtlasDimensionSettings;
  onValueChange: (value: Partial<TileAtlasDimensionSettings>) => void;
}

export const DimensionsSettingsForm: React.FC<DimensionsSettingsFormProps> = ({
  heading,
  settings: { offset, separation, tileSize },
  onValueChange,
}) => {
  return (
    <Column gap={2}>
      <Heading>{heading}</Heading>
      <Label text={"Size: " + tileSize + "px"}>
        <input
          type={"range"}
          value={tileSize}
          step={8}
          min={8}
          max={64}
          onChange={(ev) => {
            onValueChange({ tileSize: parseInt(ev.target.value) });
          }}
        />
      </Label>
      <Label text={"Offset: " + offset + "px"}>
        <input
          type={"range"}
          value={offset}
          step={1}
          min={0}
          max={16}
          onChange={(ev) =>
            onValueChange({ offset: parseInt(ev.target.value) })
          }
        />
      </Label>
      <Label text={"Separation: " + separation + "px"}>
        <input
          type={"range"}
          value={separation}
          step={1}
          min={0}
          max={16}
          onChange={(ev) =>
            onValueChange({ separation: parseInt(ev.target.value) })
          }
        />
      </Label>
    </Column>
  );
};
