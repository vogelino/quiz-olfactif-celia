import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";
import { useMemorySounds } from "@memory/memorySounds";
import { ClassValue } from "clsx";
import { createEffect, createSignal, For, onCleanup, onMount } from "solid-js";
import { cn } from "~/utils/cn";

type TextRevealType = {
  text: string;
  fontSize: number;
  fontFamily: string;
  class?: ClassValue;
  segmentationUnit?: "character" | "word";
  startingClass?: ClassValue;
};

type LayoutLineWithCharacters = {
  word: string;
  chars: { char: string; charIndex: number }[];
  wordIndex: number;
}[];

const charSegmenter = new Intl.Segmenter([], { granularity: "grapheme" });
const wordSegmenter = new Intl.Segmenter([], { granularity: "word" });
const toCharsArr = (t: string) =>
  Array.from(charSegmenter.segment(t)).map((c) => c.segment);
const toWordsArr = (t: string) =>
  Array.from(wordSegmenter.segment(t)).map((c) => c.segment);

export function TextReveal({
  text,
  fontSize,
  fontFamily,
  class: className,
  segmentationUnit = "character",
  startingClass = "starting:translate-y-4 starting:opacity-0",
}: TextRevealType) {
  const sounds = useMemorySounds();
  const [lines, setLines] = createSignal<LayoutLineWithCharacters[]>([]);
  let hostRef!: HTMLDivElement;
  let resizeObserver: ResizeObserver | undefined;

  function calculateLayout() {
    if (!hostRef) return;
    const width = Math.floor(hostRef.getBoundingClientRect().width);

    if (width <= 0) return;

    const prepared = prepareWithSegments(text, `${fontSize}px ${fontFamily}`, {
      whiteSpace: "pre-wrap",
      wordBreak: "keep-all",
    });
    const layout = layoutWithLines(prepared, width, fontSize * 1.2);
    const linesWithWordsAndChars = layout.lines.map((l) =>
      toWordsArr(l.text).map((w) => toCharsArr(w)),
    );
    const newLines = linesWithWordsAndChars.map((lineWords, lIdx) =>
      lineWords.map((wordChars, wIdx) => ({
        word: wordChars.join(""),
        wordIndex: getCharOrWordCountBefore(linesWithWordsAndChars, lIdx, wIdx),
        chars: wordChars.map((c, cIdx) => {
          const countBefore = getCharOrWordCountBefore(
            linesWithWordsAndChars,
            lIdx,
            wIdx,
            cIdx,
          );
          return { char: c, charIndex: countBefore };
        }),
      })),
    );
    const linesHaveChanged =
      lines().length !== newLines.length ||
      lines().some((line, idx) => {
        if (!newLines[idx]) return true;
        return line.some((word, wIdx) => {
          if (!newLines[idx][wIdx]) return true;
          return word.chars.some((char, cIdx) => {
            const newChar = newLines[idx][wIdx].chars[cIdx];
            return !newChar || newChar.char !== char.char;
          });
        });
      });

    if (!linesHaveChanged) return;
    setLines(newLines);
  }

  onMount(() => {
    resizeObserver = new ResizeObserver(calculateLayout);
    resizeObserver.observe(hostRef);
    if (hostRef.parentElement) {
      resizeObserver.observe(hostRef.parentElement);
    }
    calculateLayout();
    void document.fonts?.ready.then(calculateLayout);
  });

  createEffect(() => {
    text;
    fontSize;
    fontFamily;
    calculateLayout();
  });

  onCleanup(() => resizeObserver?.disconnect());

  return (
    <div ref={hostRef} class={cn("w-full min-w-0 max-w-full", className)}>
      <span class="sr-only">{text}</span>
      <For each={lines()}>
        {(line) => (
          <div
            class="flex justify-center whitespace-nowrap max-w-full"
            aria-hidden="true"
          >
            <For each={line}>
              {({ chars, wordIndex }) => (
                <span class="whitespace-nowrap inline-block" aria-hidden="true">
                  <For each={chars}>
                    {({ char, charIndex }) => {
                      const soundStep = Math.max(
                        1,
                        Math.floor(
                          text.length / Math.max(lines().length, 1) / 2,
                        ),
                      );

                      return (
                        <span
                          onTransitionStart={(evt) => {
                            if (evt.propertyName !== "opacity") return;
                            if (charIndex % soundStep !== 0) return;
                            sounds.playUISound("click2", { volume: 0.4 });
                          }}
                          class={cn(
                            "inline-block transition whitespace-nowrap",
                            "delay-(--transition-delay) duration-500 ease-in-out",
                            startingClass,
                          )}
                          style={{
                            "--transition-delay": `calc(${segmentationUnit === "word" ? wordIndex : charIndex} * var(--stagger-unit, 20ms) + var(--start-delay, 0ms))`,
                          }}
                          aria-hidden="true"
                        >
                          {char === " " ? <>&nbsp;</> : char}
                        </span>
                      );
                    }}
                  </For>
                </span>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}

function getCharOrWordCountBefore(
  lines: string[][][],
  lineIndex: number,
  wordIndex: number,
  charIndex?: number,
): number {
  const sumWord = (word: string[]) => word.length;
  const sumWords = (words: string[][]) =>
    words.reduce((sum, w) => sum + sumWord(w), 0);

  const prevLinesCount = lines
    .slice(0, lineIndex)
    .reduce((sum, line) => sum + sumWords(line), 0);

  const prevWordsCount = sumWords(lines[lineIndex].slice(0, wordIndex));

  return prevLinesCount + prevWordsCount + (charIndex ?? 0);
}
