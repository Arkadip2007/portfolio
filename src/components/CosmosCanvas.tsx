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

    // Subtle Web Audio API synthesizer for cosmic fusion & Supernova blast
    let audioCtx: AudioContext | null = null;
    let lastSoundTime = 0;

    const playSubtleFusionSound = (freqStart = 240, freqEnd = 120) => {
      const now = Date.now();
      if (now - lastSoundTime < 1800) return;
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
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freqStart, t);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, t + 0.45);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.015, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(t);
        osc.stop(t + 0.45);
      } catch (e) {}
    };

    // Mouse interactive coords & Idle state tracking
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    let lastMouseMoved = Date.now();
    let prevMousePos = { x: width / 2, y: height / 2 };

    // Supernova Implosion & Blast state
    let isCollapsing = false;
    let collapseTimer = 0;
    let isBlasting = false;
    let blastTimer = 0;
    let shockwaveRadius = 0;
    let nextSupernovaAllowedTime = Date.now() + Math.random() * 45000 + 25000;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      const distMoved = Math.hypot(e.clientX - prevMousePos.x, e.clientY - prevMousePos.y);
      if (distMoved > 6) {
        lastMouseMoved = Date.now();
        prevMousePos = { x: e.clientX, y: e.clientY };
      }

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
    const numParticles = Math.min(105, Math.floor(width / 14));
    const createRandomParticle = () => {
      const baseVx = (Math.random() - 0.5) * 0.45;
      const baseVy = (Math.random() - 0.5) * 0.45;
      const baseRadius = Math.random() * 1.3 + 0.5;
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
        orbitOffset: (Math.random() - 0.5) * 50,
        spin: Math.random() > 0.5 ? 1 : -1,
        immunityTimer: 0,
        decayTimer: 0,
        constellationTarget: null as { x: number; y: number } | null,
      };
    };

    let particles = Array.from({ length: numParticles }, () => createRandomParticle());

    // 8 Authentic Constellations Templates (Strictly English Labels & Node Schemas)
    const constellationTemplates = [
      {
        name: '✨ Ursa Major',
        nodes: [
          { x: -90, y: -30 },
          { x: -55, y: -20 },
          { x: -25, y: -8 },
          { x: 0, y: 0 },
          { x: 8, y: 38 },
          { x: 45, y: 45 },
          { x: 38, y: 8 },
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]
      },
      {
        name: '✨ Orion',
        nodes: [
          { x: -35, y: -45 },
          { x: 35, y: -45 },
          { x: -18, y: 0 },
          { x: 0, y: 0 },
          { x: 18, y: 0 },
          { x: -30, y: 48 },
          { x: 30, y: 48 },
          { x: 0, y: -20 },
        ],
        edges: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [7, 3]]
      },
      {
        name: '✨ Cassiopeia',
        nodes: [
          { x: -55, y: -10 },
          { x: -28, y: 18 },
          { x: 0, y: -12 },
          { x: 28, y: 22 },
          { x: 55, y: -5 }
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4]]
      },
      {
        name: '✨ Scorpius',
        nodes: [
          { x: -65, y: -20 },
          { x: -38, y: -10 },
          { x: -15, y: 0 },
          { x: 0, y: 15 },
          { x: 15, y: 35 },
          { x: 35, y: 45 },
          { x: 50, y: 30 },
          { x: 60, y: 10 }
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]]
      },
      {
        name: '✨ Cygnus',
        nodes: [
          { x: 0, y: -48 },
          { x: 0, y: -15 },
          { x: 0, y: 20 },
          { x: 0, y: 52 },
          { x: -42, y: 0 },
          { x: 42, y: 0 }
        ],
        edges: [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]]
      },
      {
        name: '✨ Leo',
        nodes: [
          { x: 42, y: -32 },
          { x: 18, y: -48 },
          { x: -10, y: -38 },
          { x: -22, y: -12 },
          { x: -18, y: 15 },
          { x: 22, y: 18 },
          { x: 52, y: 12 },
          { x: -50, y: 22 }
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [4, 7]]
      },
      {
        name: '✨ Taurus',
        nodes: [
          { x: -48, y: -28 },
          { x: -18, y: -10 },
          { x: 0, y: 0 },
          { x: 22, y: -18 },
          { x: 48, y: -38 },
          { x: 15, y: 22 },
          { x: 38, y: 38 }
        ],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6]]
      },
      {
        name: '✨ Canis Major',
        nodes: [
          { x: 0, y: -38 },
          { x: -22, y: -12 },
          { x: 22, y: -12 },
          { x: -32, y: 22 },
          { x: 32, y: 22 },
          { x: 0, y: 42 }
        ],
        edges: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2]]
      }
    ];

    let nextConstellationTime = Date.now() + Math.random() * 45000 + 20000;
    let activeConstellation: {
      templateIdx: number;
      centerX: number;
      centerY: number;
      rotationAngle: number;
      duration: number;
      maxDuration: number;
      particleIndices: number[];
    } | null = null;

    // Spacetime Grid setup
    const gridSize = 60;
    const cols = Math.ceil(width / gridSize) + 2;
    const rows = Math.ceil(height / gridSize) + 2;

    const render = () => {
      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Check trapped stars count near mouse orbit
      let trappedStarsCount = 0;
      particles.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        if (Math.hypot(dx, dy) < 110) {
          trappedStarsCount++;
        }
      });

      // Rare Supernova Implosion Trigger Condition:
      // Must have gathered at least 5 stars near mouse AND mouse held still for 3+ seconds AND cooldown passed!
      const now = Date.now();
      if (
        trappedStarsCount >= 5 &&
        now - lastMouseMoved > 3000 &&
        now > nextSupernovaAllowedTime &&
        !isCollapsing &&
        !isBlasting
      ) {
        isCollapsing = true;
        collapseTimer = 70; // ~1.2s implosion phase
        playSubtleFusionSound(150, 450);
      }

      if (isCollapsing) {
        collapseTimer--;
        if (collapseTimer <= 0) {
          // BOOM! Supernova Blast
          isCollapsing = false;
          isBlasting = true;
          blastTimer = 45;
          shockwaveRadius = 15;
          playSubtleFusionSound(500, 100);

          // Radial blast outward for all particles!
          particles.forEach(p => {
            const angle = Math.atan2(p.y - mouse.y, p.x - mouse.x) || Math.random() * Math.PI * 2;
            const speed = Math.random() * 5.5 + 4.0;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.immunityTimer = 220;
            p.mass = 1;
            p.radius = p.baseRadius;
          });

          // Unpredictable random cooldown between 35s and 2.5 minutes before next supernova can happen
          nextSupernovaAllowedTime = Date.now() + Math.random() * 115000 + 35000;
          lastMouseMoved = Date.now();
        }
      }

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
          const maxDist = isCollapsing ? 380 : 220;

          let warpX = gx;
          let warpY = gy;

          if (dist < maxDist) {
            const warpStrength = isCollapsing ? 65 : 28;
            const force = (1 - dist / maxDist) * warpStrength;
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
          const maxDist = isCollapsing ? 380 : 220;

          let warpX = gx;
          let warpY = gy;

          if (dist < maxDist) {
            const warpStrength = isCollapsing ? 65 : 28;
            const force = (1 - dist / maxDist) * warpStrength;
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

        if (p1.mass > 1) {
          p1.decayTimer--;
          if (p1.decayTimer <= 0) {
            p1.mass = 1;
            p1.radius = p1.baseRadius;
            p1.color = particleColors[Math.floor(Math.random() * particleColors.length)];
            p1.immunityTimer = Math.floor(Math.random() * 150) + 100;
            const burstAngle = Math.random() * Math.PI * 2;
            p1.vx = Math.cos(burstAngle) * (Math.random() * 2 + 1.5);
            p1.vy = Math.sin(burstAngle) * (Math.random() * 2 + 1.5);
          }
        }

        if (mdist1 < 140 && p1.immunityTimer <= 0 && !isCollapsing) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const pdx = p1.x - p2.x;
            const pdy = p1.y - p2.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

            if (pdist < 16 && p2.immunityTimer <= 0) {
              if (p1.mass < 3) {
                p1.mass += 1;
                p1.radius = Math.min(3.0, p1.baseRadius + p1.mass * 0.6);
                p1.color = Math.random() > 0.4 ? '#38bdf8' : '#7dd3fc';
                p1.decayTimer = Math.floor(Math.random() * 180) + 150;

                playSubtleFusionSound();

                const energy = Math.random();
                p2.x = mouse.x + (Math.random() - 0.5) * 15;
                p2.y = mouse.y + (Math.random() - 0.5) * 15;
                p2.mass = 1;
                p2.radius = p2.baseRadius;
                p2.color = particleColors[Math.floor(Math.random() * particleColors.length)];

                const ejectAngle = Math.random() * Math.PI * 2;
                if (energy > 0.5) {
                  const speed = Math.random() * 3.5 + 3.0;
                  p2.vx = Math.cos(ejectAngle) * speed;
                  p2.vy = Math.sin(ejectAngle) * speed;
                  p2.immunityTimer = Math.floor(Math.random() * 200) + 200;
                } else {
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

      // 3. Rare Constellation Spawning Logic (1 of 8 Famous Constellations, Random Orientation & Location)
      if (now > nextConstellationTime && !activeConstellation) {
        // Schedule next constellation spawn time (rare & unpredictable: 40s to 2.5 minutes)
        nextConstellationTime = now + Math.random() * 110000 + 40000;

        const templateIdx = Math.floor(Math.random() * constellationTemplates.length);
        const tmpl = constellationTemplates[templateIdx];

        // Random center location in viewport with safety margins
        const centerX = Math.random() * (width - 300) + 150;
        const centerY = Math.random() * (height - 300) + 150;
        const rotationAngle = Math.random() * Math.PI * 2; // Random 3D spatial rotation

        // Select free particles in deep space
        const indices: number[] = [];
        particles.forEach((p, idx) => {
          if (indices.length < tmpl.nodes.length && p.immunityTimer <= 0 && p.mass === 1) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            if (Math.hypot(dx, dy) > 140) {
              indices.push(idx);
            }
          }
        });

        if (indices.length === tmpl.nodes.length) {
          activeConstellation = {
            templateIdx,
            centerX,
            centerY,
            rotationAngle,
            duration: 260, // ~4.3 seconds display
            maxDuration: 260,
            particleIndices: indices,
          };
        }
      }

      // Update Active Constellation Positions with Rotation Math
      if (activeConstellation) {
        const tmpl = constellationTemplates[activeConstellation.templateIdx];
        activeConstellation.duration--;

        if (activeConstellation.duration <= 0) {
          activeConstellation.particleIndices.forEach(idx => {
            if (particles[idx]) {
              particles[idx].constellationTarget = null;
            }
          });
          activeConstellation = null;
        } else {
          const cosA = Math.cos(activeConstellation.rotationAngle);
          const sinA = Math.sin(activeConstellation.rotationAngle);

          activeConstellation.particleIndices.forEach((pIdx, nodeIdx) => {
            const p = particles[pIdx];
            if (p) {
              const node = tmpl.nodes[nodeIdx];
              // Rotated relative coordinates
              const rx = node.x * cosA - node.y * sinA;
              const ry = node.x * sinA + node.y * cosA;

              p.constellationTarget = {
                x: activeConstellation!.centerX + rx,
                y: activeConstellation!.centerY + ry,
              };
            }
          });
        }
      }

      // 4. Render Cosmic Floating Particles & Constellations
      let outerStarCount = 0;

      particles.forEach((p, idx) => {
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const influenceRadius = 220;

        if (mdist > 180) {
          outerStarCount++;
        }

        if (isCollapsing) {
          const ux = mdx / (mdist || 1);
          const uy = mdy / (mdist || 1);
          p.vx -= ux * 0.45;
          p.vy -= uy * 0.45;
          p.vx *= 0.91;
          p.vy *= 0.91;
        } else if (p.constellationTarget) {
          p.x += (p.constellationTarget.x - p.x) * 0.08;
          p.y += (p.constellationTarget.y - p.y) * 0.08;
          p.vx = 0;
          p.vy = 0;
        } else if (p.immunityTimer > 0) {
          p.immunityTimer--;
          p.vx *= 0.985;
          p.vy *= 0.985;
        } else if (mdist < influenceRadius && mdist > 0.1) {
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
          p.vx += (p.baseVx - p.vx) * 0.03;
          p.vy += (p.baseVy - p.vy) * 0.03;
        }

        if (!p.constellationTarget) {
          p.x += p.vx;
          p.y += p.vy;
        }

        // Screen wrap
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

        if (p.mass > 1) {
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Connect nearby particles with random energy lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pdist < 100) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - pdist / 100) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // 5. Draw Glowing Authentic Constellation Lines & Title (Strictly English)
      if (activeConstellation) {
        const tmpl = constellationTemplates[activeConstellation.templateIdx];
        const fadeRatio = activeConstellation.duration > 40
          ? Math.min(1, (activeConstellation.maxDuration - activeConstellation.duration) / 30)
          : activeConstellation.duration / 40;

        ctx.save();
        ctx.strokeStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = fadeRatio * 0.7;

        tmpl.edges.forEach(([n1, n2]) => {
          const p1Idx = activeConstellation!.particleIndices[n1];
          const p2Idx = activeConstellation!.particleIndices[n2];
          const p1 = particles[p1Idx];
          const p2 = particles[p2Idx];

          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Subtle English Constellation Title
        ctx.font = '11px monospace';
        ctx.fillStyle = '#00f3ff';
        ctx.textAlign = 'center';
        ctx.globalAlpha = fadeRatio * 0.65;
        ctx.fillText(tmpl.name, activeConstellation.centerX, activeConstellation.centerY - 55);
        ctx.restore();
      }

      // 6. Draw Expanding Supernova Shockwave Ring if Blasting
      if (isBlasting) {
        blastTimer--;
        shockwaveRadius += 16;

        ctx.save();
        ctx.strokeStyle = 'rgba(0, 243, 255, ' + (blastTimer / 45 * 0.5) + ')';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, shockwaveRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (blastTimer <= 0) {
          isBlasting = false;
        }
      }

      // 7. Deep Space Respawn Safety Net
      if (outerStarCount < Math.floor(numParticles * 0.4)) {
        const trappedIndex = particles.findIndex(p => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          return Math.sqrt(dx * dx + dy * dy) < 100 && p.immunityTimer <= 0 && !p.constellationTarget;
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
          p.immunityTimer = 180;
        }
      }

      ctx.globalAlpha = 1;

      // 8. Central Event Horizon subtle aura around mouse
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
