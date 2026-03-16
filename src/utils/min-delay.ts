const MIN_LOADING_DELAY_MS = 750;

export const minDelay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, MIN_LOADING_DELAY_MS));
