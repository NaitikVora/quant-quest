import React, { useRef, useEffect } from 'react';

interface ArcadeSoundManagerProps {
  soundTrigger: string | null;
  isMuted: boolean;
  onSoundComplete?: () => void;
}

const ArcadeSoundManager: React.FC<ArcadeSoundManagerProps> = ({ 
  soundTrigger, 
  isMuted, 
  onSoundComplete 
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (!soundTrigger || isMuted || !audioContextRef.current) {
      if (onSoundComplete) onSoundComplete();
      return;
    }

    const audioContext = audioContextRef.current;
    const playSound = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set volume
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

      switch (soundTrigger) {
        case 'victory':
          // Victory fanfare - ascending major chord
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
          oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.8);
          break;

        case 'defeat':
          // Defeat sound - descending minor chord
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(466.16, audioContext.currentTime + 0.1); // Bb4
          oscillator.frequency.setValueAtTime(392.00, audioContext.currentTime + 0.2); // G4
          oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.3); // F4
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.8);
          break;

        case 'overtake':
          // Overtake sound - dramatic ascending sweep
          oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
          oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3); // A5
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;

        case 'progress':
          // Progress sound - short beep
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;

        case 'milestone':
          // Milestone sound - celebratory chime
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
          oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.2); // C6
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
          break;

        case 'achievement':
          // Achievement sound - sparkle effect
          oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime); // C6
          oscillator.frequency.setValueAtTime(1318.51, audioContext.currentTime + 0.1); // E6
          oscillator.frequency.setValueAtTime(1567.98, audioContext.currentTime + 0.2); // G6
          gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        case 'coin':
          // Coin collection sound - classic arcade coin
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.05); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.1); // G5
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'countdown':
          // Countdown beep
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;

        case 'go':
          // GO sound - exciting start
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.1); // A5
          oscillator.frequency.setValueAtTime(1760, audioContext.currentTime + 0.2); // A6
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;

        case 'danger':
          // Danger warning sound
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Low frequency
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;

        default:
          // Default beep
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
      }

      // Call completion callback after sound duration
      setTimeout(() => {
        if (onSoundComplete) onSoundComplete();
      }, 1000);
    };

    // Ensure audio context is running
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(playSound);
    } else {
      playSound();
    }
  }, [soundTrigger, isMuted, onSoundComplete]);

  return null; // This component doesn't render anything
};

export default ArcadeSoundManager;
