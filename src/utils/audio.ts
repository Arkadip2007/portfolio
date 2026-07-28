// Web Audio API Sound Synthesizer for futuristic UI feedback

class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playBeep(880, 0.05, 'sine');
    }
    return this.enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playBeep(freq: number = 880, duration: number = 0.08, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playLhcCollisionSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Beam sweep up
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.3);

    gain1.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);

    osc1.start();
    osc1.stop(this.ctx.currentTime + 0.35);

    // Sub-bass impact
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(120, this.ctx.currentTime + 0.25);
    osc2.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.6);

    gain2.gain.setValueAtTime(0.3, this.ctx.currentTime + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc2.start(this.ctx.currentTime + 0.25);
    osc2.stop(this.ctx.currentTime + 0.6);
  }
}

export const soundFX = new SoundFX();
