import * as React from "react";
import { useState } from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { TileId } from "../../wfc/CommonTypes.ts";
import { Row } from "@stenajs-webui/core";
import { useAppSelector } from "../../Store.ts";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
import { SelectableTileAtlasImage } from "../common/components/SelectableTileAtlasImage.tsx";

export interface RuleSelectModalProps {}

export const RuleSelectModal: React.FC<RuleSelectModalProps> = () => {
  const { resolve, reject } = useDialogPromise<TileId>();

  const [selectedId, setSelectedId] = useState<string | undefined>();

  const { ruleSet } = useAppSelector((state) => state.wfc);

  const tileIds =
    ruleSet == null ? [] : (Object.keys(ruleSet) as Array<TileId>);

  return (
    <ModalBody maxWidth={"700px"}>
      <ModalHeader heading={"Select rule"} />

      <Row flexWrap={"wrap"} gap={2}>
        {tileIds.map((tileId) => (
          <SelectableTileAtlasImage
            tileId={tileId}
            onSelectTile={() => setSelectedId(tileId)}
            selected={tileId === selectedId}
          />
        ))}
      </Row>

      <Row gap={2} justifyContent={"flex-end"}>
        <PrimaryButton
          disabled={selectedId == null}
          label={"OK"}
          onClick={() => selectedId && resolve(selectedId)}
        />
        <SecondaryButton label={"Cancel"} onClick={() => reject()} />
      </Row>
    </ModalBody>
  );
};
