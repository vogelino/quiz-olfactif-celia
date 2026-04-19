import { Memory } from "@memory/index";
import { MemorySoundsProvider } from "@memory/memorySounds";

export default function Home() {
  return (
    <MemorySoundsProvider>
      <Memory />
    </MemorySoundsProvider>
  );
}
