import { ComponentProps } from "solid-js";

import { SVGContainer } from "./SVGContainer";

export function X(props: ComponentProps<"svg">) {
  return (
    <SVGContainer role="img" aria-label="X or Times Icon" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </SVGContainer>
  );
}
