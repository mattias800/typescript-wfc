import * as React from "react";
import { forwardRef, memo } from "react";

export interface CanvasProps extends React.HTMLProps<HTMLCanvasElement> {}

export const Canvas = memo(
  forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
    return <canvas {...props} ref={ref}></canvas>;
  }),
);
