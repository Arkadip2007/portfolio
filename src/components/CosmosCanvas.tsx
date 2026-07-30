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

    // Subtle, soft Web Audio API synthesizer for cosmic fusion & Hawking radiation
    let audioCtx: AudioContext | null = null;
    let lastSoundTime = 0;

    const playSubtleFusionSound = () => {
      const now = Date.now();
      // Throttle sound so it plays softly at most once every 2.5 seconds
      if (now - lastSoundTime < 2500) return;
      lastSoundTime = now;

      try {
        if (!audioCtx) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioCtx) return;
          audioCtx = new AudioCtx();
        }

        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        const t = audioCtx.currentTime;

        // Soft sine wave with gentle pitch bend down (collapse / fusion chime)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(130, t + 0.45);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);

        // Extremely quiet volume (0.015) - warm, non-intrusive ambient chime
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.015, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.5);
      } catch (e) {
        // Safe fallback if audio context blocked
      }
    };

    // Mouse interactive coords
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      // Initialize audio on user interaction
      if (!audioCtx) {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) audioCtx = new AudioCtx();
        } catch (err) {}
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Stars & Particles Setup
    const numParticles = Math.min(120, Math.floor(width / 13));
    const createRandomParticle = (customX?: number, customY?: number, customVx?: number, customVy?: number) => {
      const baseVx = customVx ?? (Math.random() - 0.5) * 0.4;
      const baseVy = customVy ?? (Math.random() - 0.5) * 0.4;
      return {
        x: customX ?? Math.random() * width,
        y: customY ?? Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        baseRadius: Math.random() * 1.5 + 0.6,
        radius: Math.random() * 1.5 + 0.6,
        mass: 1,
        color: Math.random() > 0.4 ? '#00f3ff' : Math.random() > 0.5 ? '#ff00aa' : '#8a2be2',
        alpha: Math.random() * 0.7 + 0.3,
        orbitOffset: (Math.random() - 0.5) * 110,
        spin: Math.random() > 0.5 ? 1 : -1,
        isEjected: false,
        ejectTimer: 0,
      };
    };

    let particles = Array.from({ length: numParticles }, () => createRandomParticle());

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

      // 2. Pairwise Collision check for Stellar Fusion & Hawking Ejection
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const mdx1 = p1.x - mouse.x;
        const mdy1 = p1.y - mouse.y;
        const mdist1 = Math.sqrt(mdx1 * mdx1 + mdy1 * mdy1);

        // Stellar Fusion & Hawking Ejection when close to mouse
        if (mdist1 < 190) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const pdx = p1.x - p2.x;
            const pdy = p1.y - p2.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

            // If two stars are extremely close under mouse gravity, they fuse!
            if (pdist < 22 && !p1.isEjected && !p2.isEjected) {
              if (p1.mass < 4) {
                // Merge p2 into p1
                p1.mass += 1;
                p1.radius = Math.min(6.0, p1.baseRadius + p1.mass * 1.2);
                p1.color = p1.mass >= 3 ? '#ffffff' : '#00ffff';

                // Soft Hawking audio chime
                playSubtleFusionSound();

                // Eject p2 away as Hawking Radiation (virtual particle jet into deep space!)
                p2.x = mouse.x + (Math.random() - 0.5) * 20;
                p2.y = mouse.y + (Math.random() - 0.5) * 20;
                const ejectAngle = Math.random() * Math.PI * 2;
                const ejectSpeed = Math.random() * 3.5 + 2.5; // High speed jet away
                p2.vx = Math.cos(ejectAngle) * ejectSpeed;
                p2.vy = Math.sin(ejectAngle) * ejectSpeed;
                p2.mass = 1;
                p2.radius = Math.random() * 1.4 + 0.6;
                p2.color = Math.random() > 0.5 ? '#00f3ff' : '#ff00aa';
                p2.isEjected = true;
                p2.ejectTimer = 60; // 60 frames of high speed jet
                break;
              }
            }
          }
        }
      }

      // 3. Render Cosmic Floating Particles & Constellations
      let outerStarCount = 0;

      particles.forEach((p, idx) => {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const influenceRadius = 280;

        if (mdist > 250) {
          outerStarCount++;
        }

        if (p.isEjected) {
          p.ejectTimer--;
          if (p.ejectTimer <= 0 || mdist > 300) {
            p.isEjected = false;
          }
        } else if (mdist < influenceRadius && mdist > 0.1) {
          const targetDist = 140 + p.orbitOffset;
          const distDiff = mdist - targetDist;

          const ux = mdx / mdist;
          const uy = mdy / mdist;

          const pullForce = -distDiff * 0.0025;

          const tx = -uy * p.spin;
          const ty = ux * p.spin;
          const swirlForce = 0.04;

          p.vx += ux * pullForce + tx * swirlForce;
          p.vy += uy * pullForce + ty * swirlForce;

          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
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

        // Render Particle & Glow if merged
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra aura glow for fused super-stars
        if (p.mass > 1) {
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.35;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

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

      // 4. Density Balance Safety Net: Respawn new stars in deep space if outer region gets too empty
      if (outerStarCount < Math.floor(numParticles * 0.35)) {
        // Find a heavily clustered star near mouse and respawn it in deep space far away
        const trappedIndex = particles.findIndex(p => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          return Math.sqrt(dx * dx + dy * dy) < 140 && !p.isEjected;
        });

        if (trappedIndex !== -1) {
          const p = particles[trappedIndex];
          // Spawn near screen border far from mouse
          const side = Math.floor(Math.random() * 4);
          if (side === 0) { p.x = Math.random() * width; p.y = 10; }
          else if (side === 1) { p.x = width - 10; p.y = Math.random() * height; }
          else if (side === 2) { p.x = Math.random() * width; p.y = height - 10; }
          else { p.x = 10; p.y = Math.random() * height; }

          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = (Math.random() - 0.5) * 0.4;
          p.baseVx = p.vx;
          p.baseVy = p.vy;
          p.mass = 1;
          p.radius = Math.random() * 1.5 + 0.6;
          p.color = Math.random() > 0.4 ? '#00f3ff' : Math.random() > 0.5 ? '#ff00aa' : '#8a2be2';
        }
      }

      ctx.globalAlpha = 1;

      // 5. Central Event Horizon subtle aura around mouse
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
      if (audioCtx) {
        audioCtx.close().catch(() => {});
      }
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
