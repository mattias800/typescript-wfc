import * as React from "react";
import { useState } from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { Coordinate, TileId } from "../../../wfc/CommonTypes.ts";
import { PrimaryButton } from "@stenajs-webui/elements";
import { RootState, useAppSelector } from "../../../Store.ts";
import { getWfcTile } from "../../../wfc/WfcTileFactory.ts";
import { Row, Spacing, Text } from "@stenajs-webui/core";
import { SelectableTileAtlasImage } from "../../common/components/SelectableTileAtlasImage.tsx";
import { SwitchWithLabel } from "@stenajs-webui/forms";

export interface TileSelectModalProps {
  coordinate: Coordinate;
}

export interface TileSelectModalResult {
  selectedTileId: string;
  selectedTileIsNotAllowed: boolean;
}

const getWfcData = (s: RootState) => s.wfc.wfcData;
const getTileAtlas = (s: RootState) => s.tileAtlas.tiles;

export const TileSelectModal: React.FC<TileSelectModalProps> = ({
  coordinate,
}) => {
  const { resolve, reject } = useDialogPromise<TileSelectModalResult>();

  const [selectedTileId, setSelectedTileId] = useState<string | undefined>();
  const [showOnlyAllowed, setShowOnlyAllowed] = useState(true);
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
    <ModalBody>
      <ModalHeader heading={"Select tile"} onClickClose={reject} />

      <SwitchWithLabel
        label={"Show only allowed"}
        value={showOnlyAllowed}
        onValueChange={setShowOnlyAllowed}
      />

      <Text>Options:</Text>
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
      <Text>Not allowed:</Text>
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
    </ModalBody>
  );
};
