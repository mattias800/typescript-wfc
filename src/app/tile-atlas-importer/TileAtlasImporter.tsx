import * as React from "react";
import { useEffect, useId, useRef } from "react";
import sourceImage from "../../assets/smb3map.png";
import { Canvas } from "../../canvas/Canvas.tsx";
import { drawChessBoard } from "../../canvas/CanvasUtils.ts";
import { Card, CardBody, CardHeader } from "@stenajs-webui/elements";
import { TileAtlasImporterSettingsForm } from "./TileAtlasImporterSettingsForm.tsx";
import { useAppSelector } from "../../Store.ts";

export interface TileAtlasImporterProps {}

export const TileAtlasImporter: React.FC<TileAtlasImporterProps> = () => {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { settingsX, settingsY } = useAppSelector(
    (state) => state.tileAtlasImporter,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) {
      console.log("Could not get context.");
      return;
    }
    const image = new Image();
    image.src = sourceImage;
    image.onload = () => {
      const scale = 1;
      ctx.reset();
      ctx.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        image.width * scale,
        image.height * scale,
      );
      drawChessBoard(
        ctx,
        settingsX.tileSize,
        settingsY.tileSize,
        settingsX.offset,
        settingsY.offset,
        settingsX.separation,
        settingsY.separation,
      );
    };
  }, [settingsX, settingsY]);

  return (
    <Card>
      <CardHeader text={"Tile atlas importer"} />
      <CardBody>
        <TileAtlasImporterSettingsForm />
        <Canvas
          id={id}
          width={"320px"}
          height={"180px"}
          style={{
            width: "1280px",
            height: "720px",
            imageRendering: "pixelated",
          }}
          ref={canvasRef}
        />
      </CardBody>
    </Card>
  );
};
