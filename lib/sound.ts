// Retro 8-bit Sound Effects Engine using Web Audio API
// Synthesized in real-time: 0 external assets, zero latency, authentic arcade timbre

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dilemma_sfx_muted');
        this.muted = saved === 'true';
      } catch {
        this.muted = false;
      }
    }
  }

  private initContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dilemma_sfx_muted', muted ? 'true' : 'false');
      } catch {
        // ignore
      }
    }
  }

  public toggleMute(): boolean {
    const nextState = !this.muted;
    this.setMuted(nextState);
    if (!nextState) {
      this.playClick();
    }
    return nextState;
  }

  // 1. Classic 8-bit Coin Clink (B5 -> E6 arpeggio with square wave)
  public playCoin() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      // First tone: 987.77 Hz (B5) for 75ms
      osc.frequency.setValueAtTime(987.77, now);
      // Jump to high tone: 1318.51 Hz (E6)
      osc.frequency.setValueAtTime(1318.51, now + 0.075);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.setValueAtTime(0.18, now + 0.075);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 2. Subtle Slider Tick (short crisp tactile chirp)
  public playSliderTick() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  // 3. Button Click Pop
  public playClick() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }

  // 4. Breaking News Siren / Teletype Arcade Fanfare
  public playBreakingNews() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 440, duration: 0.12 },
        { freq: 554.37, duration: 0.12 },
        { freq: 659.25, duration: 0.12 },
        { freq: 880, duration: 0.35 },
      ];

      let t = now;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.freq, t);

        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + n.duration);
        t += n.duration * 0.85;
      });
    } catch {
      // ignore
    }
  }

  // 5. Urgent Countdown Timer Tick (Last 5 seconds)
  public playTimerUrgent(pitchMultiplier: number = 1) {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(750 * pitchMultiplier, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // 6. Round Start / Fanfare
  public playRoundStart() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const chords = [
        { freq: 523.25, time: 0.0 }, // C5
        { freq: 659.25, time: 0.1 }, // E5
        { freq: 783.99, time: 0.2 }, // G5
        { freq: 1046.5, time: 0.32 }, // C6
      ];

      chords.forEach((c) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(c.freq, now + c.time);

        gain.gain.setValueAtTime(0.14, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + c.time);
        osc.stop(now + c.time + 0.25);
      });
    } catch {
      // ignore
    }
  }

  // 7. Scale Weight Tilt Thud
  public playScaleTilt() {
    if (this.muted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
