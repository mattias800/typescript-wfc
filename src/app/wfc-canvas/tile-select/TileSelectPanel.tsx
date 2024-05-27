import * as React from "react";
import { SwitchWithLabel } from "@stenajs-webui/forms";
import { Column, Heading, Row, Spacing, Text } from "@stenajs-webui/core";
import { SelectableTileAtlasImage } from "../../common/components/SelectableTileAtlasImage.tsx";
import { PrimaryButton } from "@stenajs-webui/elements";
import { getWfcTile } from "../../../wfc/WfcTileFactory.ts";
import { Coordinate, TileId } from "../../../wfc/CommonTypes.ts";
import { RootState, useAppSelector } from "../../../Store.ts";
import { useState } from "react";
import { useDialogPromise } from "@stenajs-webui/modal";
import { TileSelectModalResult } from "./TileSelectModal.tsx";

export interface TileSelectPanelProps {
  coordinate: Coordinate;
}

const getWfcData = (s: RootState) => s.wfc.wfcData;
const getTileAtlas = (s: RootState) => s.tileAtlas.tiles;

export const TileSelectPanel: React.FC<TileSelectPanelProps> = ({
  coordinate,
}) => {
  const { resolve } = useDialogPromise<TileSelectModalResult>();

  const [selectedTileId, setSelectedTileId] = useState<string | undefined>();

  const [addNeighbourRules, setAddNeighbourRules] = useState(true);

  const wfcData = useAppSelector(getWfcData);
  const atlasTiles = useAppSelector(getTileAtlas);

  const options = wfcData
    ? getWfcTile(wfcData, coordinate.row, coordinate.col).options
    : [];

  const notAllowedTiles = (Object.keys(atlasTiles) as Array<TileId>).filter(
    (t) => !options.includes(t),
  );

  const selectedTileIsNotAllowed = selectedTileId
    ? notAllowedTiles.includes(selectedTileId)
    : false;

  const onClickDone = () => {
    if (!selectedTileId) {
      return;
    }
    resolve({
      selectedTileId,
      selectedTileIsNotAllowed: selectedTileIsNotAllowed
        ? addNeighbourRules
        : false,
    });
  };

  return (
    <Column gap={3}>
      <Heading variant={"h4"}>Allowed tiles</Heading>
      <Row flexWrap={"wrap"} width={"700px"}>
        {options.length === 0 && <Text>There are no allowed tiles.</Text>}
        {options.map((option) => (
          <SelectableTileAtlasImage
            key={option}
            tileId={option}
            onSelectTile={() => setSelectedTileId(option)}
            selected={option === selectedTileId}
          />
        ))}
      </Row>
      <Heading variant={"h4"}>Not allowed tiles</Heading>
      <Row flexWrap={"wrap"} width={"700px"}>
        {notAllowedTiles.map((option) => (
          <SelectableTileAtlasImage
            key={option}
            tileId={option}
            onSelectTile={() => setSelectedTileId(option)}
            selected={option === selectedTileId}
          />
        ))}
      </Row>
      <Spacing />
      <Row justifyContent={"flex-end"} gap={2}>
        {selectedTileIsNotAllowed && (
          <SwitchWithLabel
            label={"Add neighbour rules"}
            value={addNeighbourRules}
            onValueChange={setAddNeighbourRules}
          />
        )}
        <PrimaryButton
          label={"Done"}
          disabled={!selectedTileId}
          onClick={onClickDone}
        />
      </Row>
    </Column>
  );
};
