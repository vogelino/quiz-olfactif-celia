import { Memory } from "~/games/Memory";
import { MemorySoundsProvider } from "~/games/Memory/memorySounds";

export default function Home() {
  return (
    <MemorySoundsProvider>
      <Memory />
    </MemorySoundsProvider>
  );
}
