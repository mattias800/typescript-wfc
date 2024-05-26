import { TileId } from "../../wfc/CommonTypes.ts";

export const createSubImageData = (
  imageData: ImageData,
  startX: number,
  startY: number,
  width: number,
  height: number,
) => {
  const chunk = new ImageData(width, height);
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      const sourceIndex = ((startY + dy) * imageData.width + (startX + dx)) * 4;
      const targetIndex = (dy * width + dx) * 4;
      chunk.data[targetIndex] = imageData.data[sourceIndex];
      chunk.data[targetIndex + 1] = imageData.data[sourceIndex + 1];
      chunk.data[targetIndex + 2] = imageData.data[sourceIndex + 2];
      chunk.data[targetIndex + 3] = imageData.data[sourceIndex + 3];
    }
  }
  return chunk;
};

export const containsImageData = (
  list: Array<ImageData>,
  image: ImageData,
): boolean => list.some((item) => imageDataEquals(item, image));

export const imageDataEquals = (
  imageData1: ImageData,
  imageData2: ImageData,
): boolean => {
  if (
    imageData1.width !== imageData2.width ||
    imageData1.height !== imageData2.height
  ) {
    return false;
  }

  const data1 = imageData1.data;
  const data2 = imageData2.data;

  for (let i = 0; i < data1.length; i++) {
    if (data1[i] !== data2[i]) {
      return false;
    }
  }

  return true;
};

export const getImageDataFromImage = (image: HTMLImageElement) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx == null) {
    throw new Error("No context found.");
  }
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, image.width, image.height);
};

export const imageDataToBase64 = (imageData: ImageData): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (ctx == null) {
    throw new Error("No context found.");
  }
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL(); // default format is 'image/png'
};

export const base64ToImageData = (base64String: string): Promise<ImageData> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx == null) {
        reject();
        return;
      }
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    image.onerror = function (error) {
      reject(error);
    };
    image.src = base64String;
  });

const base64ToImageAsync = (
  base64String: string,
): Promise<HTMLImageElement> => {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject();
    image.src = base64String;
  });
};

export const tileAtlasStateToImageElements = async (
  atlas: Record<TileId, string>,
): Promise<Record<TileId, HTMLImageElement>> => {
  const r: Record<TileId, HTMLImageElement> = {};
  const tileIds = Object.keys(atlas);

  for (const tileId of tileIds) {
    r[tileId] = await base64ToImageAsync(atlas[tileId]);
  }

  return r;
};
