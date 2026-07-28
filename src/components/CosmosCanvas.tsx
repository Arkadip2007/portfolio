import React, { useEffect, useRef } from 'react';

export const CosmosCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse interactive coords
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Stars & Particles
    const numParticles = Math.min(100, Math.floor(width / 15));
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.5,
      color: Math.random() > 0.4 ? '#00f3ff' : Math.random() > 0.5 ? '#ff00aa' : '#8a2be2',
      alpha: Math.random() * 0.7 + 0.3,
    }));

    // Spacetime Grid setup
    const gridSize = 60;
    const cols = Math.ceil(width / gridSize) + 2;
    const rows = Math.ceil(height / gridSize) + 2;

    const render = () => {
      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Render Spacetime Grid Warping
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.06)';
      ctx.lineWidth = 1;

      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          const gx = i * gridSize;
          const gy = j * gridSize;

          // Distance from mouse for gravitational pull
          const dx = mouse.x - gx;
          const dy = mouse.y - gy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 280;

          let warpX = gx;
          let warpY = gy;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 35;
            warpX += (dx / dist) * force;
            warpY += (dy / dist) * force;
          }

          if (j === 0) {
            ctx.moveTo(warpX, warpY);
          } else {
            ctx.lineTo(warpX, warpY);
          }
        }
        ctx.stroke();
      }

      for (let j = 0; j < rows; j++) {
        ctx.beginPath();
        for (let i = 0; i < cols; i++) {
          const gx = i * gridSize;
          const gy = j * gridSize;

          const dx = mouse.x - gx;
          const dy = mouse.y - gy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 280;

          let warpX = gx;
          let warpY = gy;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 35;
            warpX += (dx / dist) * force;
            warpY += (dy / dist) * force;
          }

          if (i === 0) {
            ctx.moveTo(warpX, warpY);
          } else {
            ctx.lineTo(warpX, warpY);
          }
        }
        ctx.stroke();
      }

      // 2. Render Cosmic Floating Particles & Constellations
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles with energy lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pdist < 110) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - pdist / 110) * 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;

      // 3. Central Event Horizon subtle aura around mouse
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        250
      );
      gradient.addColorStop(0, 'rgba(0, 243, 255, 0.08)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 170, 0.03)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
