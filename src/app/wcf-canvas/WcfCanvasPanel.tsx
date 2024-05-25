import * as React from "react";
import { MouseEventHandler, useEffect, useId, useRef, useState } from "react";
import { Column, Indent, Row } from "@stenajs-webui/core";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
import { Canvas } from "../../canvas/Canvas.tsx";
import { cssColor } from "@stenajs-webui/theme";
import { tileAtlasStateToImageElements } from "../util/ImageDataUtil.ts";
import { RootState, useAppDispatch, useAppSelector } from "../../Store.ts";
import { CancellationToken } from "../util/CancellationToken.ts";
import { useModalDialog } from "@stenajs-webui/modal";
import { RuleDetailsModal } from "../wfc-rule-details/RuleDetailsModal.tsx";
import { processRollbackAndRenderAsync } from "./AsyncWcfRollbackProcessor.ts";
import { wcfSlice } from "../wcf-ruleset/WcfSlice.ts";
import { renderWcfData } from "../util/TileMapRenderer.ts";
import { ErrorPanel } from "./ErrorPanel.tsx";

export interface WcfCanvasPanelProps {}

const getWcfData = (s: RootState) => s.wcf.wcfData;

export const WcfCanvasPanel: React.FC<WcfCanvasPanelProps> = () => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const wcfData = useAppSelector(getWcfData);
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | undefined>(undefined);

  const [dialog, { show }] = useModalDialog(RuleDetailsModal);

  const [loading, setLoading] = useState(false);
  const cancellationTokenRef = useRef<CancellationToken>();

  const { tiles, tileHeight, tileWidth } = useAppSelector(
    (state) => state.tileAtlas,
  );

  const { ruleSet } = useAppSelector((state) => state.wcf);

  const onClickCancel = () => {
    cancellationTokenRef.current?.cancel();
  };

  const onClickClear = () => {
    dispatch(wcfSlice.actions.resetWcfData());
    setError(undefined);
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

    if (wcfData) {
      const tileId = wcfData[tileY]?.[tileX]?.selectedTile;
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

    if (wcfData == null) {
      return;
    }

    setError(undefined);
    setLoading(true);
    try {
      cancellationTokenRef.current = new CancellationToken();
      console.log("LETS GENERATE SOME STUFF ----------------------");
      console.log("Starting from wcfData", wcfData);
      const r = await processRollbackAndRenderAsync(
        ctx,
        structuredClone(wcfData),
        ruleSet,
        t,
        tileWidth,
        tileHeight,
        0,
        cancellationTokenRef.current,
      );
      console.log("Storing wcfData", wcfData);
      if (r.type === "error") {
        setError(r.message);
      }
      dispatch(wcfSlice.actions.setWcfData({ wcfData: r.wcfData }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!wcfData) {
        return;
      }
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx) {
        console.log("Could not get context.");
        return;
      }

      const t = await tileAtlasStateToImageElements(tiles);

      renderWcfData(ctx, wcfData, t, tileWidth, tileHeight);
    })();
  }, [tileHeight, tileWidth, tiles, wcfData]);

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
