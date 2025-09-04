import React, { createContext, useContext, useRef, useEffect } from 'react';

const SoundContext = createContext();

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }) => {
  const audioContextRef = useRef(null);
  const soundsRef = useRef({});

  useEffect(() => {
    // Initialize Web Audio API
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }

    // Create sound effects using Web Audio API
    const createTone = (frequency, duration, type = 'sine', volume = 0.1) => {
      if (!audioContextRef.current) return null;

      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + duration);
      
      return { oscillator, gainNode };
    };

    // Define sound effects
    soundsRef.current = {
      shoot: () => {
        const tone = createTone(800, 0.1, 'square', 0.05);
        if (tone) {
          tone.oscillator.start(audioContextRef.current.currentTime);
          tone.oscillator.stop(audioContextRef.current.currentTime + 0.1);
        }
      },
      
      explosion: () => {
        // Create explosion sound with noise
        if (!audioContextRef.current) return;
        
        const bufferSize = audioContextRef.current.sampleRate * 0.2;
        const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }
        
        const source = audioContextRef.current.createBufferSource();
        const gainNode = audioContextRef.current.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);
        
        gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.2);
        
        source.start(audioContextRef.current.currentTime);
      },
      
      alienShoot: () => {
        const tone = createTone(200, 0.15, 'sawtooth', 0.03);
        if (tone) {
          tone.oscillator.start(audioContextRef.current.currentTime);
          tone.oscillator.stop(audioContextRef.current.currentTime + 0.15);
        }
      },
      
      levelComplete: () => {
        // Play ascending tone sequence
        const frequencies = [440, 554, 659, 880];
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const tone = createTone(freq, 0.3, 'sine', 0.08);
            if (tone) {
              tone.oscillator.start(audioContextRef.current.currentTime);
              tone.oscillator.stop(audioContextRef.current.currentTime + 0.3);
            }
          }, index * 200);
        });
      },
      
      gameOver: () => {
        // Play descending tone sequence
        const frequencies = [880, 659, 440, 220];
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const tone = createTone(freq, 0.4, 'sine', 0.1);
            if (tone) {
              tone.oscillator.start(audioContextRef.current.currentTime);
              tone.oscillator.stop(audioContextRef.current.currentTime + 0.4);
            }
          }, index * 300);
        });
      }
    };

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playSound = (soundName) => {
    // Resume audio context if it's suspended (required for user interaction)
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    if (soundsRef.current[soundName]) {
      soundsRef.current[soundName]();
    }
  };

  const value = {
    playSound,
    isSupported: !!audioContextRef.current
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};
