import { Memory } from "~/games/Memory";
import { SoundManager, SoundManagerProvider } from "~/utils/SoundManager";

export default function Home() {
  return (
    <SoundManagerProvider value={new SoundManager()}>
      <Memory />
    </SoundManagerProvider>
  );
}
