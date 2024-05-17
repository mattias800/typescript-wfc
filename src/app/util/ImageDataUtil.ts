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
