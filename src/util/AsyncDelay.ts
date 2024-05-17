export const asyncDelay = (delayInMilliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayInMilliseconds));
