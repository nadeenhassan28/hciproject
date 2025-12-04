// Sound utility functions for educational feedback

let backgroundMusicContext: AudioContext | null = null;
let musicOscillators: OscillatorNode[] = [];
let musicGainNode: GainNode | null = null;

export const startBackgroundMusic = () => {
  if (backgroundMusicContext) {
    stopBackgroundMusic();
  }

  try {
    backgroundMusicContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    musicGainNode = backgroundMusicContext.createGain();
    musicGainNode.connect(backgroundMusicContext.destination);
    musicGainNode.gain.value = 0.08; // Soft background volume

    // Create a gentle, playful melody loop
    const melody = [
      { freq: 523.25, time: 0, duration: 0.4 },      // C5
      { freq: 587.33, time: 0.5, duration: 0.4 },    // D5
      { freq: 659.25, time: 1.0, duration: 0.4 },    // E5
      { freq: 587.33, time: 1.5, duration: 0.4 },    // D5
      { freq: 523.25, time: 2.0, duration: 0.4 },    // C5
      { freq: 392.00, time: 2.5, duration: 0.4 },    // G4
      { freq: 523.25, time: 3.0, duration: 0.8 },    // C5
    ];

    const harmony = [
      { freq: 261.63, time: 0, duration: 1.0 },      // C4
      { freq: 329.63, time: 1.0, duration: 1.0 },    // E4
      { freq: 261.63, time: 2.0, duration: 1.0 },    // C4
      { freq: 196.00, time: 3.0, duration: 1.0 },    // G3
    ];

    const loopDuration = 4; // 4 seconds per loop

    const playLoop = () => {
      if (!backgroundMusicContext || !musicGainNode) return;

      const now = backgroundMusicContext.currentTime;

      // Play melody
      melody.forEach(note => {
        const osc = backgroundMusicContext!.createOscillator();
        const noteGain = backgroundMusicContext!.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(musicGainNode!);
        
        osc.frequency.value = note.freq;
        osc.type = 'sine';
        
        const startTime = now + note.time;
        const endTime = startTime + note.duration;
        
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.001, endTime);
        
        osc.start(startTime);
        osc.stop(endTime);
        
        musicOscillators.push(osc);
      });

      // Play harmony
      harmony.forEach(note => {
        const osc = backgroundMusicContext!.createOscillator();
        const noteGain = backgroundMusicContext!.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(musicGainNode!);
        
        osc.frequency.value = note.freq;
        osc.type = 'triangle';
        
        const startTime = now + note.time;
        const endTime = startTime + note.duration;
        
        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.001, endTime);
        
        osc.start(startTime);
        osc.stop(endTime);
        
        musicOscillators.push(osc);
      });

      // Schedule next loop
      setTimeout(() => {
        if (backgroundMusicContext) {
          playLoop();
        }
      }, loopDuration * 1000);
    };

    playLoop();
  } catch (error) {
    console.log('Background music not supported');
  }
};

export const stopBackgroundMusic = () => {
  if (backgroundMusicContext) {
    musicOscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    musicOscillators = [];
    
    if (musicGainNode) {
      musicGainNode.disconnect();
      musicGainNode = null;
    }
    
    backgroundMusicContext.close();
    backgroundMusicContext = null;
  }
};

export const playCorrectSound = (enabled: boolean = true) => {
  if (!enabled) return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create clapping/celebration sound effect
    const duration = 0.6;
    const now = audioContext.currentTime;
    
    // Multiple frequencies for a richer clapping sound
    const frequencies = [200, 400, 800, 1600];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'triangle';
      
      // Create clapping rhythm
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.15 / frequencies.length, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.15 / frequencies.length, now + 0.15);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      gainNode.gain.linearRampToValueAtTime(0.2 / frequencies.length, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    });

    // Add a celebratory bell sound
    const bellOsc = audioContext.createOscillator();
    const bellGain = audioContext.createGain();
    
    bellOsc.connect(bellGain);
    bellGain.connect(audioContext.destination);
    
    bellOsc.frequency.value = 1200;
    bellOsc.type = 'sine';
    
    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.2, now + 0.01);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    bellOsc.start(now + 0.3);
    bellOsc.stop(now + 0.8);
    
  } catch (error) {
    console.log('Audio not supported');
  }
};

export const playWrongSound = (enabled: boolean = true) => {
  if (!enabled) return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a gentle "oops" sound
    const duration = 0.5;
    const now = audioContext.currentTime;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Descending tone for "wrong" but not harsh
    oscillator.frequency.setValueAtTime(400, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + duration);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    // Add a soft second tone
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    
    osc2.frequency.setValueAtTime(300, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(150, now + duration);
    osc2.type = 'triangle';
    
    gain2.gain.setValueAtTime(0, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.1, now + 0.11);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    osc2.start(now + 0.1);
    osc2.stop(now + duration);
    
  } catch (error) {
    console.log('Audio not supported');
  }
};

export const playSuccessSound = (enabled: boolean = true) => {
  if (!enabled) return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a triumphant success melody
    const notes = [
      { freq: 523.25, time: 0, duration: 0.15 },      // C5
      { freq: 659.25, time: 0.15, duration: 0.15 },   // E5
      { freq: 783.99, time: 0.3, duration: 0.3 },     // G5
    ];
    
    const now = audioContext.currentTime;
    
    notes.forEach(note => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle';
      
      const startTime = now + note.time;
      const endTime = startTime + note.duration;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);
      
      oscillator.start(startTime);
      oscillator.stop(endTime);
    });
    
  } catch (error) {
    console.log('Audio not supported');
  }
};
