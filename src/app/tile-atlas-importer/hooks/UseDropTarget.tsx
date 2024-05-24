import { DragEventHandler, useState } from "react";

type DropPngEvent = (src: string) => void;

export const useDropTarget = (onDropPng: DropPngEvent) => {
  const [isOver, setIsOver] = useState(false);

  const onDrop: DragEventHandler<HTMLElement> = (ev) => {
    ev.preventDefault();

    const dt = ev.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
      const file = files[0];
      if (file.type === "image/png") {
        const reader = new FileReader();
        reader.onload = function (event) {
          if (event.target && typeof event.target.result === "string") {
            onDropPng(event.target.result);
          } else {
            alert("Could not load file.");
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please drop a PNG file.");
      }
    }

    setIsOver(false);
  };

  const onDragOver: DragEventHandler<HTMLElement> = (ev) => {
    ev.preventDefault();
    setIsOver(true);
  };

  return {
    isOver,
    props: {
      onDrop,
      onDragOver,
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
    },
  };
};
