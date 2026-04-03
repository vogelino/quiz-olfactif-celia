import { createContext, JSXElement, useContext } from "solid-js";

interface PlayOptions {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
}

export class SoundManager {
  private context: AudioContext;
  private buffers: Map<string, AudioBuffer>;
  private activeSources: Set<AudioBufferSourceNode>;
  private masterGain: GainNode;
  private loopingSources: Map<string, AudioBufferSourceNode> = new Map();

  constructor() {
    this.context = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.buffers = new Map();
    this.activeSources = new Set();

    // Create master gain node for overall volume control
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);
  }

  async loadSound(name: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(name, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound "${name}":`, error);
      throw error;
    }
  }

  async loadSounds(sounds: Record<string, string>): Promise<void> {
    const promises = Object.entries(sounds).map(([name, url]) =>
      this.loadSound(name, url),
    );
    await Promise.all(promises);
  }

  play(name: string, options: PlayOptions = {}): AudioBufferSourceNode | null {
    const buffer = this.buffers.get(name);
    if (!buffer) {
      console.warn(`Sound "${name}" not found`);
      return null;
    }

    // Resume context if suspended (required on some browsers)
    if (this.context.state === "suspended") {
      this.context.resume();
    }

    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop ?? false;
    source.playbackRate.value = options.playbackRate ?? 1;

    const gainNode = this.context.createGain();
    gainNode.gain.value = options.volume ?? 1;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    // Track active sources for cleanup
    this.activeSources.add(source);
    source.onended = () => {
      this.activeSources.delete(source);
    };

    source.start(0);
    return source;
  }

  stop(source: AudioBufferSourceNode | null): void {
    if (source) {
      try {
        source.stop();
        this.activeSources.delete(source);
      } catch (error) {
        console.warn("Error stopping source:", error);
      }
    }
  }

  stopAll(): void {
    this.activeSources.forEach((source) => {
      try {
        source.stop();
      } catch (error) {
        console.warn("Error stopping source:", error);
      }
    });
    this.activeSources.clear();
  }

  setMasterVolume(volume: number): void {
    this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }

  getMasterVolume(): number {
    return this.masterGain.gain.value;
  }

  isSoundLoaded(name: string): boolean {
    return this.buffers.has(name);
  }

  getLoadedSounds(): string[] {
    return Array.from(this.buffers.keys());
  }

  dispose(): void {
    this.stopAll();
    this.buffers.clear();
  }

  playLoop(
    name: string,
    options: PlayOptions = {},
  ): AudioBufferSourceNode | null {
    // Stop existing loop if already playing
    const existingSource = this.loopingSources.get(name);
    if (existingSource) {
      this.stop(existingSource);
    }

    const source = this.play(name, { ...options, loop: true });

    if (source) {
      this.loopingSources.set(name, source);
    }

    return source;
  }

  stopLoop(name: string): void {
    const source = this.loopingSources.get(name);
    if (source) {
      this.stop(source);
      this.loopingSources.delete(name);
    }
  }

  stopAllLoops(): void {
    this.loopingSources.forEach((source) => this.stop(source));
    this.loopingSources.clear();
  }

  isLoopPlaying(name: string): boolean {
    return this.loopingSources.has(name);
  }
}

const SoundManagerContext = createContext<SoundManager>(new SoundManager());

export const SoundManagerProvider = (props: {
  children: JSXElement;
  value: SoundManager;
}) => (
  <SoundManagerContext.Provider value={props.value}>
    {props.children}
  </SoundManagerContext.Provider>
);

export const useSoundManager = () => useContext(SoundManagerContext);
