import React, { useState, useEffect } from 'react';

interface ArcadeSoundEffectsProps {
  trigger: 'countdown' | 'score' | 'combo' | 'critical' | 'block' | 'miss' | 'victory' | 'defeat' | null;
  isMuted: boolean;
}

const ArcadeSoundEffects: React.FC<ArcadeSoundEffectsProps> = ({ trigger, isMuted }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [audioContext]);

  useEffect(() => {
    if (!trigger || isMuted || !audioContext) return;

    const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    };

    const playChord = (frequencies: number[], duration: number) => {
      frequencies.forEach((freq, index) => {
        setTimeout(() => playSound(freq, duration), index * 50);
      });
    };

    switch (trigger) {
      case 'countdown':
        playSound(800, 0.3, 'square');
        break;
      case 'score':
        playSound(600, 0.2, 'sine');
        break;
      case 'combo':
        playChord([400, 500, 600], 0.4);
        break;
      case 'critical':
        playChord([800, 1000, 1200], 0.6);
        break;
      case 'block':
        playSound(300, 0.3, 'sawtooth');
        break;
      case 'miss':
        playSound(200, 0.5, 'triangle');
        break;
      case 'victory':
        playChord([523, 659, 784, 1047], 1.0);
        break;
      case 'defeat':
        playChord([200, 150, 100], 1.0);
        break;
    }
  }, [trigger, isMuted, audioContext]);

  return null; // This component doesn't render anything
};

export default ArcadeSoundEffects;
