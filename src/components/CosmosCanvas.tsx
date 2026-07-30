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
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);

        // Extremely quiet volume (0.012) - warm, non-intrusive ambient chime
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.012, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.45);
      } catch (e) {
        // Safe fallback if audio context blocked
      }
    };

    // Mouse interactive coords
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!audioCtx) {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) audioCtx = new AudioCtx();
        } catch (err) {}
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const particleColors = ['#00f3ff', '#38bdf8', '#7dd3fc', '#a855f7', '#ff00aa'];

    // Stars & Particles Setup
    const numParticles = Math.min(100, Math.floor(width / 15));
    const createRandomParticle = () => {
      const baseVx = (Math.random() - 0.5) * 0.45;
      const baseVy = (Math.random() - 0.5) * 0.45;
      const baseRadius = Math.random() * 1.3 + 0.5; // Small dots (0.5px to 1.8px)
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: baseVx,
        vy: baseVy,
        baseVx,
        baseVy,
        baseRadius,
        radius: baseRadius,
        mass: 1,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.65 + 0.35,
        orbitOffset: (Math.random() - 0.5) * 50, // Reduced spread around smaller orbit
        spin: Math.random() > 0.5 ? 1 : -1,
        immunityTimer: 0, // Frames of gravity immunity after Hawking ejection
        decayTimer: 0,    // Frames before merged star decays back to small stars
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
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i < cols; i++) {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) {
          const gx = i * gridSize;
          const gy = j * gridSize;

          const dx = mouse.x - gx;
          const dy = mouse.y - gy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 220; // Reduced grid warp radius around mouse

          let warpX = gx;
          let warpY = gy;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 28;
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
          const maxDist = 220;

          let warpX = gx;
          let warpY = gy;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 28;
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

        // Check decay timer for merged stars
        if (p1.mass > 1) {
          p1.decayTimer--;
          if (p1.decayTimer <= 0) {
            // Merged star decays/breaks down back into a small star!
            p1.mass = 1;
            p1.radius = p1.baseRadius;
            p1.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            p1.immunityTimer = Math.floor(Math.random() * 150) + 100; // Fly away into space
            const burstAngle = Math.random() * Math.PI * 2;
            p1.vx = Math.cos(burstAngle) * (Math.random() * 2 + 1.5);
            p1.vy = Math.sin(burstAngle) * (Math.random() * 2 + 1.5);
          }
        }

        // Stellar Fusion when near mouse
        if (mdist1 < 140 && p1.immunityTimer <= 0) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const pdx = p1.x - p2.x;
            const pdy = p1.y - p2.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

            // If two stars touch in mouse gravity (within 16px), fuse them!
            if (pdist < 16 && p2.immunityTimer <= 0) {
              if (p1.mass < 3) {
                // Merge p2 into p1
                p1.mass += 1;
                // Compact max radius (max ~3.0px) so dots stay relatively small and elegant
                p1.radius = Math.min(3.0, p1.baseRadius + p1.mass * 0.6);
                p1.color = Math.random() > 0.4 ? '#38bdf8' : '#7dd3fc'; // Electric light blue / cyan Tones
                p1.decayTimer = Math.floor(Math.random() * 180) + 150; // Decays in 2.5 - 5 seconds

                playSubtleFusionSound();

                // Eject p2 as Hawking Radiation into deep space with variable kinetic energy!
                const energy = Math.random(); // 0 to 1
                p2.x = mouse.x + (Math.random() - 0.5) * 15;
                p2.y = mouse.y + (Math.random() - 0.5) * 15;
                p2.mass = 1;
                p2.radius = p2.baseRadius;
                p2.color = particleColors[Math.floor(Math.random() * particleColors.length)];

                const ejectAngle = Math.random() * Math.PI * 2;
                if (energy > 0.5) {
                  // High Energy Ejection: Blasts far into deep space, immune to gravity for 4-7 seconds
                  const speed = Math.random() * 3.5 + 3.0;
                  p2.vx = Math.cos(ejectAngle) * speed;
                  p2.vy = Math.sin(ejectAngle) * speed;
                  p2.immunityTimer = Math.floor(Math.random() * 200) + 200; // Long immunity to escape far
                } else {
                  // Low/Medium Energy Ejection: Shorter travel
                  const speed = Math.random() * 2.0 + 1.2;
                  p2.vx = Math.cos(ejectAngle) * speed;
                  p2.vy = Math.sin(ejectAngle) * speed;
                  p2.immunityTimer = Math.floor(Math.random() * 80) + 60;
                }
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
        const influenceRadius = 220; // Reduced mouse influence radius

        if (mdist > 180) {
          outerStarCount++;
        }

        if (p.immunityTimer > 0) {
          p.immunityTimer--;
          // Decelerate high speed ejection gradually to normal drift speed
          p.vx *= 0.985;
          p.vy *= 0.985;
        } else if (mdist < influenceRadius && mdist > 0.1) {
          // Tighter mouse orbit radius (~85px + offset)
          const targetDist = 85 + p.orbitOffset;
          const distDiff = mdist - targetDist;

          const ux = mdx / mdist;
          const uy = mdy / mdist;

          const pullForce = -distDiff * 0.0028;

          const tx = -uy * p.spin;
          const ty = ux * p.spin;
          const swirlForce = 0.045;

          p.vx += ux * pullForce + tx * swirlForce;
          p.vy += uy * pullForce + ty * swirlForce;

          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
          // Drift naturally in deep space
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

        // Render Particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle aura glow for fused stars
        if (p.mass > 1) {
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Connect nearby particles with energy lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pdist < 100) { // Reduced connection distance for cleaner look
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - pdist / 100) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // 4. Deep Space Respawn Safety Net: Ensure distant space always has stars
      if (outerStarCount < Math.floor(numParticles * 0.4)) {
        const trappedIndex = particles.findIndex(p => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          return Math.sqrt(dx * dx + dy * dy) < 100 && p.immunityTimer <= 0;
        });

        if (trappedIndex !== -1) {
          const p = particles[trappedIndex];
          const side = Math.floor(Math.random() * 4);
          if (side === 0) { p.x = Math.random() * width; p.y = 10; }
          else if (side === 1) { p.x = width - 10; p.y = Math.random() * height; }
          else if (side === 2) { p.x = Math.random() * width; p.y = height - 10; }
          else { p.x = 10; p.y = Math.random() * height; }

          p.vx = (Math.random() - 0.5) * 0.45;
          p.vy = (Math.random() - 0.5) * 0.45;
          p.baseVx = p.vx;
          p.baseVy = p.vy;
          p.mass = 1;
          p.radius = p.baseRadius;
          p.color = particleColors[Math.floor(Math.random() * particleColors.length)];
          p.immunityTimer = 180; // Immune to mouse gravity for 3 seconds so it stays in deep space
        }
      }

      ctx.globalAlpha = 1;

      // 5. Central Event Horizon subtle aura around mouse
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        5,
        mouse.x,
        mouse.y,
        180
      );
      gradient.addColorStop(0, 'rgba(0, 243, 255, 0.07)');
      gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.02)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
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
