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

  const [dialog, { show }] = useModalDialog(RuleDetailsModal);

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
    const tileX = Math.floor(x / tileWidth);
    const tileY = Math.floor(y / tileHeight);

    if (wfcData) {
      const tileId = getWfcTile(wfcData, tileY, tileX).collapsed;
      if (tileId) {
        await show({ tileId });
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

    console.log("START", { wfcData });
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
      {dialog}
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
        />
        <WfcSettingsForm />
        {mouseTileCoordinate && (
          <Text>
            {mouseTileCoordinate.mouseTileX}:{mouseTileCoordinate.mouseTileY}{" "}
            {mouseTileCoordinate.mouseTileIndex}
          </Text>
        )}
        {error && (
          <>
            <Indent num={4} />
            <ErrorPanel text={error} />
          </>
        )}
      </Row>

      <Canvas
        id={id}
        width={"640px"}
        height={"360"}
        onClick={onClickCanvas}
        onMouseMove={onMouseOverCanvas}
        onMouseOut={() => setMouseTileCoordinate(undefined)}
        style={{
          border: "1px solid " + cssColor("--silver"),
          width: "1280px",
          height: "720px",
          imageRendering: "pixelated",
        }}
        ref={canvasRef}
      />
    </Column>
  );
};
