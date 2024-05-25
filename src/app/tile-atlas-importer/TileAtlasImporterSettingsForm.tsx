import * as React from "react";
import { useCallback } from "react";
import { Column, Row } from "@stenajs-webui/core";
import { useAppDispatch, useAppSelector } from "../../Store.ts";
import {
  TileAtlasDimensionSettings,
  tileAtlasImporterSlice,
} from "./TileAtlasImporterSlice.ts";
import { DimensionsSettingsForm } from "./DimensionsSettingsForm.tsx";
import { SwitchWithLabel } from "@stenajs-webui/forms";

export interface TileAtlasImporterSettingsFormProps {}

export const TileAtlasImporterSettingsForm: React.FC<
  TileAtlasImporterSettingsFormProps
> = () => {
  const dispatch = useAppDispatch();

  const { settingsX, settingsY, deleteTilesWithMissingNeighbour } =
    useAppSelector((state) => state.tileAtlasImporter);

  const onChangeX = useCallback(
    (fields: Partial<TileAtlasDimensionSettings>) => {
      dispatch(tileAtlasImporterSlice.actions.setSettingsX(fields));
    },
    [dispatch],
  );

  const onChangeY = useCallback(
    (fields: Partial<TileAtlasDimensionSettings>) => {
      dispatch(tileAtlasImporterSlice.actions.setSettingsY(fields));
    },
    [dispatch],
  );

  const onChangeDeleteTilesWithMissingNeighbour = useCallback(
    (value: boolean) => {
      dispatch(
        tileAtlasImporterSlice.actions.setDeleteTilesWithMissingNeighbour({
          value,
        }),
      );
    },
    [dispatch],
  );

  return (
    <Column gap={6}>
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
      <SwitchWithLabel
        label={"Remove tiles with missing neighbours"}
        value={deleteTilesWithMissingNeighbour}
        onValueChange={onChangeDeleteTilesWithMissingNeighbour}
      />
    </Column>
  );
};
