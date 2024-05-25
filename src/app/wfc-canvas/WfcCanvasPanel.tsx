import * as React from "react";
import { MouseEventHandler, useEffect, useId, useRef, useState } from "react";
import { Column, Indent, Row, Text } from "@stenajs-webui/core";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
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

export interface WfcCanvasPanelProps {}

const getWfcData = (s: RootState) => s.wfc.wfcData;

interface MouseTileCoordinate {
  mouseTileX: number;
  mouseTileY: number;
}

export const WfcCanvasPanel: React.FC<WfcCanvasPanelProps> = () => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mouseTileCoordinate, setMouseTileCoordinate] = useState<
    MouseTileCoordinate | undefined
  >();

  const wfcData = useAppSelector(getWfcData);
  const dispatch = useAppDispatch();

  const [allowZeroEntropyTiles, setAllowZeroEntropyTiles] = useState(true);
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
    setMouseTileCoordinate({ mouseTileX, mouseTileY });
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
      const tileId = wfcData[tileY]?.[tileX]?.selectedTile;
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
      console.log("Could not get context.");
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
      console.log("LETS GENERATE SOME STUFF ----------------------");
      console.log("Starting from wfcData", wfcData);
      const r = await processRollbackAndRenderAsync(
        ctx,
        structuredClone(wfcData),
        ruleSet,
        t,
        tileWidth,
        tileHeight,
        allowZeroEntropyTiles,
        0,
        cancellationTokenRef.current,
      );
      console.log("Storing wfcData", wfcData);
      if (r.type === "error") {
        setError(r.message);
      }
      dispatch(wfcSlice.actions.setWfcData({ wfcData: r.wfcData }));
    } catch (e) {
      console.error(e);
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
        console.log("Could not get context.");
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
          label={"Generate"}
          onClick={onClickGenerate}
          loading={loading}
          disabled={loading}
        />
        {loading ? (
          <SecondaryButton label={"Cancel"} onClick={onClickCancel} />
        ) : (
          <SecondaryButton label={"Clear"} onClick={onClickClear} />
        )}
        <SwitchWithLabel
          label={"Allow zero entropy tiles"}
          value={allowZeroEntropyTiles}
          onValueChange={setAllowZeroEntropyTiles}
        />
        {mouseTileCoordinate && (
          <Text>
            {mouseTileCoordinate.mouseTileX}:{mouseTileCoordinate.mouseTileY}
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
        width={"1280px"}
        height={"720px"}
        onClick={onClickCanvas}
        onMouseMove={onMouseOverCanvas}
        onMouseOut={() => setMouseTileCoordinate(undefined)}
        style={{
          border: "1px solid " + cssColor("--silver"),
          width: "2560px",
          height: "1440px",
          imageRendering: "pixelated",
        }}
        ref={canvasRef}
      />
    </Column>
  );
};
