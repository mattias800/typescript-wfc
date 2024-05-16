import * as React from "react";
import { useCallback } from "react";
import { Row } from "@stenajs-webui/core";
import { useAppDispatch, useAppSelector } from "../../Store.ts";
import {
  TileAtlasDimensionSettings,
  tileAtlasImporterSlice,
} from "./TileAtlasImporterSlice.ts";
import { DimensionsSettingsForm } from "./DimensionsSettingsForm.tsx";

export interface TileAtlasImporterSettingsFormProps {}

export const TileAtlasImporterSettingsForm: React.FC<
  TileAtlasImporterSettingsFormProps
> = () => {
  const dispatch = useAppDispatch();

  const { settingsX, settingsY } = useAppSelector(
    (state) => state.tileAtlasImporter,
  );

  const onChangeX = useCallback(
    (fields: Partial<TileAtlasDimensionSettings>) => {
      dispatch(tileAtlasImporterSlice.actions.setSettingsX(fields));
    },
    [],
  );

  const onChangeY = useCallback(
    (fields: Partial<TileAtlasDimensionSettings>) => {
      dispatch(tileAtlasImporterSlice.actions.setSettingsY(fields));
    },
    [],
  );

  return (
    <Row gap={2}>
      <DimensionsSettingsForm
        settings={settingsX}
        onValueChange={onChangeX}
        heading={"Width"}
      />
      <DimensionsSettingsForm
        settings={settingsY}
        onValueChange={onChangeY}
        heading={"Height"}
      />
    </Row>
  );
};
