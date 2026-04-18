import { ingredients } from "~/data/ingredients";
import { memoryPairs } from "~/data/memory";
import { molecules } from "~/data/molecules";
import { usePreloadImages } from "~/utils/preloadImages";

export function usePreloadedMemoryImages() {
  const isDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");
  return usePreloadImages([
    ...ingredients.map((ingredient) => ingredient.illustration),
    ...molecules.map((molecule) => `/memory/molecules/${molecule.id}.webp`),
    "/memory/card-front.webp",
    "/memory/card-back.webp",
    isDarkMedia.matches
      ? "/memory/bg-texture-dark.webp"
      : "/memory/bg-texture-light.webp",
  ]);
}
