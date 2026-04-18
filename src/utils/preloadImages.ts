import { createSignal } from "solid-js";

export function usePreloadImages(imageUrls: string[]): {
  loaded: boolean;
  loadingPercentage: number;
  failedUrls: string[];
} {
  const [loaded, setIsLoaded] = createSignal(false);
  const [loadingPercentage, setLoadingPercentage] = createSignal(0);
  const [failedUrls, setFailedUrls] = createSignal<string[]>([]);

  imageUrls.forEach((url) => {
    preloadImage(url)
      .then(() => {
        setLoadingPercentage((prev) => prev + 100 / imageUrls.length);
        if (loadingPercentage() < 100) return;
        setIsLoaded(true);
      })
      .catch(() => {
        setFailedUrls((prev) => [...prev, url]);
        setLoadingPercentage((prev) => prev + 100 / imageUrls.length);
        if (loadingPercentage() < 100) return;
        setIsLoaded(true);
      });
  });

  return {
    loaded: loaded(),
    loadingPercentage: loadingPercentage(),
    failedUrls: failedUrls(),
  };
}

async function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
