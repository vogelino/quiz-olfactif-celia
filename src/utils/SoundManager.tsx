interface PlayOptions {
  volume?: number;
  loop?: boolean;
  playbackRate?: number;
}

export type LoadProgress = {
  soundsCompleted: number;
  totalSounds: number;
  bytesLoaded: number;
  totalBytes: number;
  percentage: number;
};

export class SoundManager {
  private context: AudioContext;
  private buffers: Map<string, AudioBuffer>;
  private activeSources: Set<AudioBufferSourceNode>;
  private masterGain: GainNode;
  private loopingSources: Map<string, AudioBufferSourceNode> = new Map();

  // Progress tracking
  private totalBytes: number = 0;
  private bytesLoaded: number = 0;
  private soundsCompleted: number = 0;
  private totalSounds: number = 0;

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.buffers = new Map();
    this.activeSources = new Set();

    // Create master gain node for overall volume control
    this.masterGain = this.context.createGain();
    this.masterGain.connect(this.context.destination);

    // Bind public methods to its instance to avoid issues
    this.loadSounds = this.loadSounds.bind(this);
    this.getLoadProgress = this.getLoadProgress.bind(this);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.stopAll = this.stopAll.bind(this);
    this.setMasterVolume = this.setMasterVolume.bind(this);
    this.getMasterVolume = this.getMasterVolume.bind(this);
    this.isSoundLoaded = this.isSoundLoaded.bind(this);
    this.getLoadedSounds = this.getLoadedSounds.bind(this);
    this.dispose = this.dispose.bind(this);
    this.playLoop = this.playLoop.bind(this);
    this.stopLoop = this.stopLoop.bind(this);
    this.stopAllLoops = this.stopAllLoops.bind(this);
    this.isLoopPlaying = this.isLoopPlaying.bind(this);
  }

  private async fetchWithProgress(
    url: string,
    onProgress?: (loaded: number, total: number) => void,
  ): Promise<ArrayBuffer> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    // Get total file size
    const contentLength = response.headers.get("content-length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let loaded = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;

        if (onProgress) {
          onProgress(loaded, total);
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Combine chunks into single ArrayBuffer
    const chunksAll = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    return chunksAll.buffer;
  }

  async loadSounds(
    sounds: Record<string, string>,
    onProgress?: (progress: LoadProgress) => void,
  ): Promise<void> {
    this.totalSounds = Object.keys(sounds).length;
    this.soundsCompleted = 0;
    this.bytesLoaded = 0;
    this.totalBytes = 0;

    // First pass: get total file sizes
    const soundUrls = Object.entries(sounds);
    const sizes = await Promise.all(
      soundUrls.map(async ([_, url]) => {
        try {
          const response = await fetch(url, { method: "HEAD" });
          const contentLength = response.headers.get("content-length");
          return contentLength ? parseInt(contentLength, 10) : 0;
        } catch {
          return 0;
        }
      }),
    );

    this.totalBytes = sizes.reduce((sum, size) => sum + size, 0);

    // Second pass: load sounds with progress
    const promises = soundUrls.map(async ([name, url], index) => {
      try {
        const arrayBuffer = await this.fetchWithProgress(url, (loaded, total) => {
          // Update progress
          const previousLoaded = sizes.slice(0, index).reduce((sum, size) => sum + size, 0);
          this.bytesLoaded = previousLoaded + loaded;

          if (onProgress) {
            const percentage =
              this.totalBytes > 0 ? Math.round((this.bytesLoaded / this.totalBytes) * 100) : 0;

            onProgress({
              soundsCompleted: this.soundsCompleted,
              totalSounds: this.totalSounds,
              bytesLoaded: this.bytesLoaded,
              totalBytes: this.totalBytes,
              percentage,
            });
          }
        });

        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.buffers.set(name, audioBuffer);
        this.soundsCompleted++;
      } catch (error) {
        console.error(`Failed to load sound "${name}":`, error);
        throw error;
      }
    });

    await Promise.all(promises);
  }

  getLoadProgress(): LoadProgress {
    const percentage =
      this.totalBytes > 0 ? Math.round((this.bytesLoaded / this.totalBytes) * 100) : 0;

    return {
      soundsCompleted: this.soundsCompleted,
      totalSounds: this.totalSounds,
      bytesLoaded: this.bytesLoaded,
      totalBytes: this.totalBytes,
      percentage,
    };
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

  playLoop(name: string, options: PlayOptions = {}): AudioBufferSourceNode | null {
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
