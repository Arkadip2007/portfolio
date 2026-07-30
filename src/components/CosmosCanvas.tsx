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
    const numParticles = Math.min(110, Math.floor(width / 14));
    const particles = Array.from({ length: numParticles }, () => {
      const baseVx = (Math.random() - 0.5) * 0.4;
      const baseVy = (Math.random() - 0.5) * 0.4;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        radius: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.4 ? '#00f3ff' : Math.random() > 0.5 ? '#ff00aa' : '#8a2be2',
        alpha: Math.random() * 0.7 + 0.3,
        // Individual random offset around the imaginary orbital ring (~140px)
        // Fuzzy offset spread: +/- 55px so the circle remains soft and organic
        orbitOffset: (Math.random() - 0.5) * 110,
        spin: Math.random() > 0.5 ? 1 : -1,
      };
    });

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
        // Distance to mouse
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const influenceRadius = 280;

        if (mdist < influenceRadius && mdist > 0.1) {
          // Target ring radius around mouse (base ~140px + individual random offset)
          const targetDist = 140 + p.orbitOffset;
          const distDiff = mdist - targetDist; // > 0 if outside ring, < 0 if inside ring

          // Normalized vector pointing away from mouse
          const ux = mdx / mdist;
          const uy = mdy / mdist;

          // Radial force: pull towards targetDist ring
          const pullForce = -distDiff * 0.0025;

          // Tangential swirl force (gentle orbit motion around ring)
          const tx = -uy * p.spin;
          const ty = ux * p.spin;
          const swirlForce = 0.04;

          p.vx += ux * pullForce + tx * swirlForce;
          p.vy += uy * pullForce + ty * swirlForce;

          // Gentle friction when influenced by mouse
          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
          // Gently drift back towards base velocity when outside mouse influence
          p.vx += (p.baseVx - p.vx) * 0.03;
          p.vy += (p.baseVy - p.vy) * 0.03;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen edges
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

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

          if (pdist < 115) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - pdist / 115) * 0.22;
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
