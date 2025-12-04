// Sound notification utilities

const createOscillatorSound = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      setTimeout(() => {
        audioContext.close();
        resolve();
      }, duration * 1000);
    } catch (error) {
      console.error('Error playing sound:', error);
      resolve();
    }
  });
};

export const playPomodoroEndSound = async () => {
  // Play a pleasant chime sequence
  await createOscillatorSound(523.25, 0.2, 'sine'); // C5
  await new Promise(r => setTimeout(r, 100));
  await createOscillatorSound(659.25, 0.2, 'sine'); // E5
  await new Promise(r => setTimeout(r, 100));
  await createOscillatorSound(783.99, 0.3, 'sine'); // G5
};

export const playAchievementSound = async () => {
  // Play a celebratory fanfare
  await createOscillatorSound(523.25, 0.15, 'triangle'); // C5
  await new Promise(r => setTimeout(r, 50));
  await createOscillatorSound(659.25, 0.15, 'triangle'); // E5
  await new Promise(r => setTimeout(r, 50));
  await createOscillatorSound(783.99, 0.15, 'triangle'); // G5
  await new Promise(r => setTimeout(r, 50));
  await createOscillatorSound(1046.50, 0.4, 'triangle'); // C6
};

export const playBreakEndSound = async () => {
  // Softer sound for break ending
  await createOscillatorSound(440, 0.3, 'sine'); // A4
  await new Promise(r => setTimeout(r, 150));
  await createOscillatorSound(523.25, 0.4, 'sine'); // C5
};
