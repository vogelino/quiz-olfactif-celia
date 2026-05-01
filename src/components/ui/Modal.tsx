import { ComponentProps, splitProps } from "solid-js";

import { cn } from "~/utils/cn";

import { X } from "../icons";
import { Button } from "./Button";

export type ModalProps = ComponentProps<"dialog"> & {
  title: string;
};

export default function Modal(props: ModalProps) {
  const [local, rest] = splitProps(props, ["children", "class", "id"]);
  const id = () => local.id || "modal";

  return (
    <dialog
      {...rest}
      id={id()}
      class={cn(
        "group/dialog",
        "fixed inset-0 w-screen h-screen min-w-screen min-h-screen",
        "hidden grid place-content-center bg-transparent pointer-events-none open:ponter-events-auto",
        "transition backdrop:bg-transparent p-4",
        "before:content-[''] before:fixed before:inset-0 before:w-screen before:h-screen",
        "before:min-w-screen before:min-h-screen before:bg-foreground/20",
        "before:opacity-0 open:before:opacity-100 before:texture-mask",
        local.class,
      )}
    >
      <div
        class={cn(
          "w-full max-w-lg scale-75 bg-white p-6 opacity-0 shadow-lg relative",
          "transition group-open/dialog:scale-100 group-open/dialog:opacity-100",
          "rounded-xl border-2 border-foreground [corner-shape:scoop] bg-texture",
        )}
      >
        <header class="flex items-center justify-between mb-4 gap-8">
          <h2 class="font-headline text-2xl texture-mask">{props.title}</h2>
          <Button
            aria-label="Close modal"
            variant="ghost"
            size="icon"
            commandfor={id()}
            command="request-close"
          >
            <X />
          </Button>
        </header>
        {local.children}
      </div>
    </dialog>
  );
}
