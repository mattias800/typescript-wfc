export const drawChessBoard = (
  ctx: CanvasRenderingContext2D,
  tileSizeX: number,
  tileSizeY: number,
  offsetX: number = 0,
  offsetY: number = 0,
  separationX: number = 0,
  separationY: number = 0,
) => {
  let lightCellColor = "#ddb18060";
  let darkCellColor = "#7c330c60";

  for (let y = 0; y < ctx.canvas.height; y++) {
    for (let x = 0; x < ctx.canvas.width; x++) {
      const offset = y % 2 === 0 ? 1 : 0;
      const color = (x + offset) % 2 === 0 ? lightCellColor : darkCellColor;
      ctx.fillStyle = color;
      ctx.fillRect(
        offsetX + x * tileSizeX + x * separationX,
        offsetY + y * tileSizeY + y * separationY,
        tileSizeX,
        tileSizeY,
      );
    }
  }
};
