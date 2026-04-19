import { useMemo } from 'react';

export default function ParticleBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      left: Math.random() * 100,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 10,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? 'var(--neon-cyan-rgb)' : 'var(--neon-purple-rgb)',
    }));
  }, []);

  return (
    <div className="particles-container">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          width: p.size + 'px', height: p.size + 'px',
          left: p.left + '%',
          animationDelay: p.delay + 's',
          animationDuration: p.duration + 's',
          opacity: p.opacity,
          background: `radial-gradient(circle, rgba(${p.color}, 0.8), transparent)`,
        }} />
      ))}
    </div>
  );
}
