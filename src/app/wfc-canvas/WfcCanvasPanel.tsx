import * as React from "react";
import { MouseEventHandler, useEffect, useId, useRef, useState } from "react";
import { Column, Indent, Row, Text } from "@stenajs-webui/core";
import {
  PrimaryButton,
  SecondaryButton,
  Spinner,
} from "@stenajs-webui/elements";
import { Canvas } from "../../canvas/Canvas.tsx";
import { cssColor } from "@stenajs-webui/theme";
import { tileAtlasStateToImageElements } from "../util/ImageDataUtil.ts";
import { RootState, useAppDispatch, useAppSelector } from "../../Store.ts";
import { CancellationToken } from "../util/CancellationToken.ts";
import { useModalDialog } from "@stenajs-webui/modal";
import { RuleDetailsModal } from "../wfc-rule-details/RuleDetailsModal.tsx";
import { processRollbackAndRenderAsync } from "./AsyncWfcRollbackProcessor.ts";
import { wfcSlice } from "../wfc-ruleset/WfcSlice.ts";
import { renderWfcData } from "../util/TileMapRenderer.ts";
import { ErrorPanel } from "./ErrorPanel.tsx";
import { SwitchWithLabel } from "@stenajs-webui/forms";
import { getWfcTile } from "../../wfc/WfcTileFactory.ts";
import { WfcSettingsForm } from "./WfcSettingsForm.tsx";
import {
  TileSelectModal,
  TileSelectModalProps,
  TileSelectModalResult,
} from "./tile-select/TileSelectModal.tsx";
import { asyncDelay } from "../../util/AsyncDelay.ts";

export interface WfcCanvasPanelProps {}

const getWfcData = (s: RootState) => s.wfc.wfcData;

interface MouseTileCoordinate {
  mouseTileX: number;
  mouseTileY: number;
  mouseTileIndex: number;
}

export const WfcCanvasPanel: React.FC<WfcCanvasPanelProps> = () => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mouseTileCoordinate, setMouseTileCoordinate] = useState<
    MouseTileCoordinate | undefined
  >();

  const wfcData = useAppSelector(getWfcData);
  const dispatch = useAppDispatch();

  const [backtrackingEnabled, setBacktrackingEnabled] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [ruleDetailsDialog, { show: showRuleDetails }] =
    useModalDialog(RuleDetailsModal);
  const [tileSelectDialog, { show: showTileSelect }] = useModalDialog<
    TileSelectModalProps,
    TileSelectModalResult
  >(TileSelectModal);

  const [loading, setLoading] = useState(false);
  const cancellationTokenRef = useRef<CancellationToken>();

  const { tiles, tileHeight, tileWidth } = useAppSelector(
    (state) => state.tileAtlas,
  );

  const { ruleSet } = useAppSelector((state) => state.wfc);

  const onClickCancel = () => {
    cancellationTokenRef.current?.cancel();
  };

  const onClickClear = () => {
    dispatch(wfcSlice.actions.resetWfcData());
    setError(undefined);
  };

  const onMouseOverCanvas: MouseEventHandler<HTMLCanvasElement> = async (
    ev,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const canvasScale = 2;
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / canvasScale;
    const y = (ev.clientY - rect.top) / canvasScale;
    const mouseTileX = Math.floor(x / tileWidth);
    const mouseTileY = Math.floor(y / tileHeight);
    const mouseTileIndex = wfcData
      ? mouseTileY * wfcData?.cols + mouseTileX
      : 0;
    if (mouseTileX >= 0 && mouseTileY >= 0) {
      setMouseTileCoordinate({ mouseTileX, mouseTileY, mouseTileIndex });
    }
  };

  const onClickCanvas: MouseEventHandler<HTMLCanvasElement> = async (ev) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const canvasScale = 2;
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / canvasScale;
    const y = (ev.clientY - rect.top) / canvasScale;
    const col = Math.floor(x / tileWidth);
    const row = Math.floor(y / tileHeight);

    if (wfcData) {
      const tileId = getWfcTile(wfcData, row, col).collapsed;
      if (tileId) {
        try {
          await showRuleDetails({ tileId });
        } catch (e) {
          /* empty */
        }
      } else {
        try {
          const result = await showTileSelect({
            coordinate: { row: row, col: col },
          });
          await asyncDelay(100);
          if (result) {
            dispatch(
              wfcSlice.actions.setWfcTile({
                row,
                col,
                tileId: result.selectedTileId,
              }),
            );
            if (result.selectedTileIsNotAllowed) {
              // TODO Update rule
            }
          }
        } catch (e) {
          /* empty */
        }
      }
    }
  };

  const onClickGenerate = async () => {
    if (ruleSet == null) {
      alert("No rule set defined.");
      return;
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      setError("Could not get context.");
      return;
    }
    const t = await tileAtlasStateToImageElements(tiles);

    ctx.reset();

    if (wfcData == null) {
      return;
    }

    setError(undefined);
    setLoading(true);

    try {
      cancellationTokenRef.current = new CancellationToken();
      const r = await processRollbackAndRenderAsync(
        ctx,
        structuredClone(wfcData),
        ruleSet,
        t,
        tileWidth,
        tileHeight,
        backtrackingEnabled,
        0,
        cancellationTokenRef.current,
      );
      if (r.type === "error") {
        setError(r.message);
      }
      dispatch(wfcSlice.actions.setWfcData({ wfcData: r.wfcData }));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!wfcData) {
        return;
      }
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        setError("Could not get context.");
        return;
      }

      const t = await tileAtlasStateToImageElements(tiles);

      renderWfcData(ctx, wfcData, t, tileWidth, tileHeight);
    })();
  }, [tileHeight, tileWidth, tiles, wfcData]);

  return (
    <Column gap={2}>
      {ruleDetailsDialog}
      {tileSelectDialog}
      <Row alignItems={"center"} gap={2} justifyContent={"space-between"}>
        <Row alignItems={"center"} gap={2} minHeight={"40px"}>
          <PrimaryButton
            label={loading ? "Stop" : "Start"}
            onClick={loading ? onClickCancel : onClickGenerate}
            loadingLabel={"Stop"}
          />
          {loading && <Spinner size={"tiny"} />}
          <SecondaryButton
            label={"Clear"}
            onClick={onClickClear}
            disabled={loading}
          />
          <SwitchWithLabel
            label={"Enable backtracking"}
            value={backtrackingEnabled}
            onValueChange={setBacktrackingEnabled}
            disabled={loading}
          />
        </Row>
        <Row alignItems={"center"}>
          {error && (
            <>
              <Indent num={4} />
              <ErrorPanel text={error} />
            </>
          )}
        </Row>
      </Row>

      <Row alignItems={"center"} gap={4}>
        <WfcSettingsForm />
        {mouseTileCoordinate && (
          <Text>
            {mouseTileCoordinate.mouseTileX}:{mouseTileCoordinate.mouseTileY}{" "}
            {mouseTileCoordinate.mouseTileIndex}
          </Text>
        )}
      </Row>
      <Canvas
        id={id}
        width={"960px"}
        height={"512px"}
        onClick={onClickCanvas}
        onMouseMove={onMouseOverCanvas}
        onMouseOut={() => setMouseTileCoordinate(undefined)}
        style={{
          border: "1px solid " + cssColor("--silver"),
          width: "1920px",
          height: "1024px",
          imageRendering: "pixelated",
        }}
        ref={canvasRef}
      />
    </Column>
  );
};
