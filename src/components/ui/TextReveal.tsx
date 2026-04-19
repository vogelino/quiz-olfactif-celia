import {
  prepareWithSegments,
  layoutWithLines,
  LayoutLine,
} from "@chenglou/pretext";
import { ClassValue } from "clsx";
import { createEffect, createSignal, For, onCleanup, onMount } from "solid-js";
import { useMemorySounds } from "@memory/memorySounds";
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
  let containerRef!: HTMLDivElement;
  const prepared = prepareWithSegments(text, `${fontSize}px ${fontFamily}`, {
    whiteSpace: "pre-wrap",
    wordBreak: "keep-all",
  });

  const resizeObserver = new ResizeObserver(calculateLayout);

  function calculateLayout() {
    if (!containerRef) return;
    const layout = layoutWithLines(
      prepared,
      containerRef.getBoundingClientRect().width,
      fontSize * 1.2,
    );
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
    resizeObserver.observe(containerRef);
    calculateLayout();
  });

  onCleanup(() => resizeObserver.disconnect());

  return (
    <div
      ref={containerRef}
      class={cn("whitespace-nowrap flex flex-col items-center", className)}
    >
      <For each={lines()}>
        {(line, lineIdx) => (
          <div class="whitespace-nowrap">
            <For each={line}>
              {({ chars, wordIndex }) => (
                <span class="whitespace-nowrap inline-block">
                  <For each={chars}>
                    {({ char, charIndex }) => {
                      return (
                        <span
                          onTransitionStart={(evt) => {
                            if (evt.propertyName !== "opacity") return;
                            if (
                              charIndex %
                                Math.floor(text.length / lines().length / 2) !==
                              0
                            )
                              return;
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
