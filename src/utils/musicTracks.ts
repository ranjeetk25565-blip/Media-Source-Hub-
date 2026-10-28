import { MusicTrack } from '../types/schemas';

export const MUSIC_CATALOG: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Desi Dhol Beats (Patna Remix)',
    artist: 'Ranjeet Kumar & Studio Crew',
    album: 'Bhojpuri & Bollywood Bass 2026',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    duration: 185,
    genre: 'Bhojpuri',
    audioFreq: 330,
    tempo: 128,
    playsCount: '1.4M',
    waveformPattern: [35, 60, 85, 45, 95, 75, 55, 90, 80, 65, 40, 90, 100, 70, 45, 80],
    tags: ['#DesiVibes', '#Bihar', '#PatnaBeats', '#TrendingReel']
  },
  {
    id: 'track-2',
    title: 'Sunset Lo-Fi Chillwave',
    artist: 'Aarav Beats',
    album: 'Midnight Chai Vibes',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80',
    duration: 142,
    genre: 'Lo-Fi',
    audioFreq: 260,
    tempo: 84,
    playsCount: '890K',
    waveformPattern: [20, 35, 45, 50, 40, 60, 50, 45, 30, 40, 55, 60, 40, 30, 25, 20],
    tags: ['#LoFi', '#Aesthetic', '#ChillVibes', '#Relax']
  },
  {
    id: 'track-3',
    title: 'Urban Punjabi Trap',
    artist: 'Sidhu & Veer',
    album: 'G.O.A.T. Punjab',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    duration: 160,
    genre: 'Punjabi',
    audioFreq: 390,
    tempo: 140,
    playsCount: '2.8M',
    waveformPattern: [45, 80, 95, 70, 85, 100, 60, 95, 90, 85, 70, 95, 85, 65, 80, 90],
    tags: ['#PunjabiHits', '#Swag', '#BassBoosted', '#ViralReels']
  },
  {
    id: 'track-4',
    title: 'Dil Ki Dhadkan (Acoustic Strings)',
    artist: 'Neha Sharma',
    album: 'Romantic Melodies Vol. 1',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    duration: 210,
    genre: 'Bollywood',
    audioFreq: 440,
    tempo: 96,
    playsCount: '3.2M',
    waveformPattern: [30, 40, 60, 75, 80, 65, 70, 85, 60, 70, 80, 55, 65, 75, 50, 35],
    tags: ['#Bollywood', '#Romantic', '#LoveSong', '#FeelingGood']
  },
  {
    id: 'track-5',
    title: 'Cyberpunk Neon Pulse',
    artist: 'Nexus Wave',
    album: 'Future Horizon 2026',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    duration: 175,
    genre: 'Trending',
    audioFreq: 520,
    tempo: 132,
    playsCount: '940K',
    waveformPattern: [50, 90, 70, 95, 60, 85, 100, 75, 90, 80, 65, 90, 80, 95, 70, 85],
    tags: ['#Synthwave', '#Cyberpunk', '#Tech', '#FastPaced']
  },
  {
    id: 'track-6',
    title: 'Bhojpuri Tadka DJ Blast',
    artist: 'Khesari & Ranjeet Beats',
    album: 'Chhath Puja & Festive Dhol',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
    duration: 195,
    genre: 'Bhojpuri',
    audioFreq: 360,
    tempo: 138,
    playsCount: '4.1M',
    waveformPattern: [60, 85, 100, 90, 75, 95, 100, 85, 90, 95, 100, 70, 85, 95, 80, 90],
    tags: ['#BhojpuriTadka', '#BiharVibes', '#FestivalReel', '#DJSong']
  }
];

/**
 * Web Audio API synthesizer for instant audio playback preview
 */
class SynthesizerPlayer {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentTrackId: string | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playTrack(track: MusicTrack, onEnd?: () => void) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = track.genre === 'Lo-Fi' ? 'sine' : track.genre === 'Bhojpuri' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(track.audioFreq || 330, this.ctx.currentTime);

    // Add rhythmic arpeggio/melody effect to sound realistic
    const melodySteps = [0, 4, 7, 12, 7, 4, 2, -2];
    let stepIndex = 0;
    const intervalTime = (60 / (track.tempo || 120)) / 2;

    const melodyTimer = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.oscillator) {
        clearInterval(melodyTimer);
        return;
      }
      stepIndex = (stepIndex + 1) % melodySteps.length;
      const semitone = melodySteps[stepIndex];
      const freq = (track.audioFreq || 330) * Math.pow(2, semitone / 12);
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }, intervalTime * 1000);

    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    this.oscillator = osc;
    this.gainNode = gain;
    this.isPlaying = true;
    this.currentTrackId = track.id;

    // Auto fadeout after 12 seconds preview
    setTimeout(() => {
      if (this.currentTrackId === track.id) {
        this.stop();
        if (onEnd) onEnd();
      }
    }, 12000);
  }

  stop() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);
      } catch (e) {
        // ignore
      }
    }
    setTimeout(() => {
      if (this.oscillator) {
        try {
          this.oscillator.stop();
          this.oscillator.disconnect();
        } catch (e) {
          // ignore
        }
        this.oscillator = null;
      }
    }, 150);

    this.isPlaying = false;
    this.currentTrackId = null;
  }

  getActiveTrackId(): string | null {
    return this.isPlaying ? this.currentTrackId : null;
  }
}

export const audioSynth = new SynthesizerPlayer();
