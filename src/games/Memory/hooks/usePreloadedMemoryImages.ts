import { ingredients } from "@memory/data/ingredients";
import { molecules } from "@memory/data/molecules";
import { usePreloadImages } from "~/utils/preloadImages";

export function usePreloadedMemoryImages() {
  const isDarkMedia = window.matchMedia("(prefers-color-scheme: dark)");
  return usePreloadImages([
    ...ingredients.map(
      (ingredient) => `/memory/ingredients/${ingredient.id}.webp`,
    ),
    ...molecules.map((molecule) => `/memory/molecules/${molecule.id}.webp`),
    "/memory/card-front.webp",
    "/memory/card-back.webp",
    isDarkMedia.matches
      ? "/memory/bg-texture-dark.webp"
      : "/memory/bg-texture-light.webp",
  ]);
}
