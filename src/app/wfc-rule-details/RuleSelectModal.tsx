import * as React from "react";
import { useState } from "react";
import { ModalBody, ModalHeader, useDialogPromise } from "@stenajs-webui/modal";
import { TileId } from "../../wfc/CommonTypes.ts";
import { Row } from "@stenajs-webui/core";
import { useAppSelector } from "../../Store.ts";
import { TileAtlasImage } from "../common/components/TileAtlasImage.tsx";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
import { cssColor } from "@stenajs-webui/theme";

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
          <button
            key={tileId}
            onClick={() => setSelectedId(tileId)}
            style={{
              borderRadius: "4px",
              border:
                "4px solid " +
                (tileId === selectedId
                  ? cssColor("--lhds-color-blue-500")
                  : cssColor("--lhds-color-ui-200")),
            }}
          >
            <TileAtlasImage tileId={tileId} />
          </button>
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
