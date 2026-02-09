import confetti from 'canvas-confetti';

export const fireConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#3b82f6'],
  });
};

export const fireMilestoneConfetti = () => {
  const duration = 2000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#f59e0b', '#ef4444', '#8b5cf6'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#10b981', '#3b82f6', '#f59e0b'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};
