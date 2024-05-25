export const moveItemToStart = <T>(arr: Array<T>, index: number): Array<T> => {
  // Ensure the index is within the bounds of the array
  if (index < 0 || index >= arr.length) {
    throw new Error("Index out of bounds");
  }

  // Remove the item at the specified index
  const item = arr.splice(index, 1)[0];

  // Insert the item at the start of the array
  arr.unshift(item);

  return arr;
};

export const getRandomItem = <T>(list: Array<T>): T => {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};
