import * as React from "react";
import { useId, useRef, useState } from "react";
import { Column, Row } from "@stenajs-webui/core";
import { PrimaryButton, SecondaryButton } from "@stenajs-webui/elements";
import { Canvas } from "../../canvas/Canvas.tsx";
import { cssColor } from "@stenajs-webui/theme";
import { tileAtlasStateToImageElements } from "../util/ImageDataUtil.ts";
import { useAppSelector } from "../../Store.ts";
import { initWcfData } from "../../wfc/WcfTileFactory.ts";
import { processAndRenderAsync } from "./AsyncWcfProcessor.ts";
import { CancellationToken } from "../util/CancellationToken.ts";

export interface WcfCanvasPanelProps {}

export const WcfCanvasPanel: React.FC<WcfCanvasPanelProps> = () => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(false);
  const cancellationTokenRef = useRef<CancellationToken>();

  const { tiles, tileHeight, tileWidth } = useAppSelector(
    (state) => state.tileAtlas,
  );

  const { ruleSet } = useAppSelector((state) => state.wcf);

  const onClickCancel = () => {
    cancellationTokenRef.current?.cancel();
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

    const d = initWcfData(32, 20, ruleSet);
    setLoading(true);
    try {
      cancellationTokenRef.current = new CancellationToken();

      await processAndRenderAsync(
        ctx,
        d,
        ruleSet,
        t,
        tileWidth,
        tileHeight,
        0,
        cancellationTokenRef.current,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column gap={2}>
      <Row alignItems={"flex-end"} gap={6}>
        <PrimaryButton
          label={"Generate"}
          onClick={onClickGenerate}
          loading={loading}
          disabled={loading}
        />
        {loading && (
          <SecondaryButton label={"Cancel"} onClick={onClickCancel} />
        )}
      </Row>

      <Canvas
        id={id}
        width={"640px"}
        height={"360px"}
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
