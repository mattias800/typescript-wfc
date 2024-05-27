import * as React from "react";
import { useState } from "react";
import { Spacing, Text } from "@stenajs-webui/core";
import { ModalBody } from "@stenajs-webui/modal";
import { Coordinate } from "../../../wfc/CommonTypes.ts";
import { Tab, TabMenu } from "@stenajs-webui/elements";
import { RootState, useAppSelector } from "../../../Store.ts";
import { getWfcTile } from "../../../wfc/WfcTileFactory.ts";
import { RuleDetails } from "../../wfc-rule-details/RuleDetails.tsx";
import { TileSelectPanel } from "./TileSelectPanel.tsx";

export interface TileSelectModalProps {
  coordinate: Coordinate;
}

export interface TileSelectModalResult {
  selectedTileId: string;
  selectedTileIsNotAllowed: boolean;
}

type TabCode = "tile" | "rule";

const getWfcData = (s: RootState) => s.wfc.wfcData;

export const TileSelectModal: React.FC<TileSelectModalProps> = ({
  coordinate,
}) => {
  const [tabCode, setTabCode] = useState<TabCode>("tile");

  const wfcData = useAppSelector(getWfcData);

  const tileId = wfcData
    ? getWfcTile(wfcData, coordinate.row, coordinate.col).collapsed
    : undefined;

  return (
    <ModalBody>
      <TabMenu>
        <Tab
          label={"Tile selection"}
          selected={tabCode === "tile"}
          onClick={() => setTabCode("tile")}
        />
        <Tab
          label={"Tile rule"}
          selected={tabCode === "rule"}
          onClick={() => setTabCode("rule")}
        />
      </TabMenu>
      <Spacing width={"700px"} height={"700px"}>
        {tabCode === "tile" && <TileSelectPanel coordinate={coordinate} />}
        {tabCode === "rule" && (
          <>
            {tileId ? (
              <RuleDetails tileId={tileId} />
            ) : (
              <Text>No tile selected.</Text>
            )}
          </>
        )}
      </Spacing>
    </ModalBody>
  );
};
