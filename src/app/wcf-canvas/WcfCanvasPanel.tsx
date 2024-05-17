import * as React from "react";
import { useId, useRef } from "react";
import { Column, Row } from "@stenajs-webui/core";
import { PrimaryButton } from "@stenajs-webui/elements";
import { Canvas } from "../../canvas/Canvas.tsx";
import { cssColor } from "@stenajs-webui/theme";
import { tileAtlasStateToImageElements } from "../util/ImageDataUtil.ts";
import { useAppSelector } from "../../Store.ts";
import { renderTileMap } from "../util/TileMapRenderer.ts";
import { initWcfData } from "../../wfc/WcfTileFactory.ts";
import { process } from "../../wfc/WcfProcessor.ts";
import { mapWcfDataToSourceMap } from "../../wfc/SourceMapMapper.ts";

export interface WcfCanvasPanelProps {}

export const WcfCanvasPanel: React.FC<WcfCanvasPanelProps> = () => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { tiles, tileHeight, tileWidth } = useAppSelector(
    (state) => state.tileAtlas,
  );

  const { ruleSet } = useAppSelector((state) => state.wcf);

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

    const d = initWcfData(20, 16, ruleSet);
    const wcfData = process(d, ruleSet);

    const tileMap = mapWcfDataToSourceMap(wcfData);

    renderTileMap(ctx, tileMap, t, tileWidth, tileHeight);
  };

  return (
    <Column gap={2}>
      <Row alignItems={"flex-end"} gap={6}>
        <PrimaryButton label={"Generate"} onClick={onClickGenerate} />
      </Row>

      <Canvas
        id={id}
        width={"320px"}
        height={"180px"}
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
