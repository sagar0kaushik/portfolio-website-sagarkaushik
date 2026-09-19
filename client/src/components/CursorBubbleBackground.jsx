import React, { useEffect, useRef } from 'react';

/**
 * CursorBubbleBackground
 * Creates a real-time, hardware-accelerated background bubble animation
 * that tracks the cursor across the portfolio with liquid fluidity,
 * an ambient luminous bubble glow, delicate bubble membrane ring,
 * and trailing micro-bubble particles.
 */
export const CursorBubbleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Only run on desktop / fine pointer devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates (interpolated vs target)
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      speed: 0
    };

    // Trailing micro-bubbles pool
    const bubbles = [];
    const MAX_BUBBLES = 40;

    // Expanding shockwave ripples on click
    const ripples = [];

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;

      // Spawn a trailing micro-bubble when cursor moves
      if (Math.random() > 0.4 && bubbles.length < MAX_BUBBLES) {
        bubbles.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          radius: Math.random() * 7 + 3,
          maxRadius: Math.random() * 12 + 6,
          vx: (Math.random() - 0.5) * 1.1,
          vy: -Math.random() * 1.3 - 0.4, // Floats upward
          opacity: Math.random() * 0.4 + 0.3,
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
          color: Math.random() > 0.45 ? 'rgba(49, 91, 221,' : 'rgba(7, 59, 50,'
        });
      }
    };

    const handleMouseDown = (e) => {
      // Spawn expanding click ripple
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 12,
        maxRadius: 75,
        opacity: 0.5,
        decay: 0.025
      });

      // Spawn burst of micro-bubbles on click
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        bubbles.push({
          x: e.clientX,
          y: e.clientY,
          radius: Math.random() * 5 + 3,
          maxRadius: Math.random() * 11 + 5,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.7,
          opacity: 0.5,
          life: 1,
          decay: Math.random() * 0.025 + 0.02,
          color: 'rgba(49, 91, 221,'
        });
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.025;

      // Smooth lerp towards mouse position (0.16 factor gives tight real-time responsive feel)
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      mouse.x += dx * 0.16;
      mouse.y += dy * 0.16;

      // Calculate instantaneous movement speed for dynamic expansion
      const curSpeed = Math.sqrt(dx * dx + dy * dy);
      mouse.speed += (curSpeed - mouse.speed) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // 1. PRIMARY CURSOR BUBBLE (Luminous ambient glow & organic shape)
      const baseRadius = 85;
      const speedExpansion = Math.min(mouse.speed * 1.2, 45);
      const wobble = Math.sin(time * 2) * 4;
      const bubbleRadius = baseRadius + speedExpansion + wobble;

      // Soft radial glow aura
      const auraGradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        bubbleRadius * 1.8
      );
      auraGradient.addColorStop(0, 'rgba(49, 91, 221, 0.13)');
      auraGradient.addColorStop(0.4, 'rgba(7, 59, 50, 0.07)');
      auraGradient.addColorStop(0.75, 'rgba(245, 200, 91, 0.03)');
      auraGradient.addColorStop(1, 'rgba(243, 239, 229, 0)');

      ctx.fillStyle = auraGradient;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, bubbleRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Delicate bubble membrane ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, bubbleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(49, 91, 221, 0.22)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Bubble top-left specular reflection highlight
      const specX = mouse.x - bubbleRadius * 0.35;
      const specY = mouse.y - bubbleRadius * 0.35;
      const specRadius = bubbleRadius * 0.32;
      const specGrad = ctx.createRadialGradient(specX, specY, 0, specX, specY, specRadius);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      specGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.1)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.arc(specX, specY, specRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. EXPANDING CLICK RIPPLES
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += (rip.maxRadius - rip.radius) * 0.12 + 0.8;
        rip.opacity -= rip.decay;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(49, 91, 221, ${rip.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // 3. FLOATING TRAILING MICRO-BUBBLES
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life -= b.decay;

        // Subtle horizontal wobble as bubble ascends
        b.x += Math.sin(time * 3 + i) * 0.4;

        if (b.life <= 0) {
          bubbles.splice(i, 1);
          continue;
        }

        const currentOpacity = b.opacity * b.life;
        const curRadius = b.radius + (1 - b.life) * (b.maxRadius - b.radius);

        ctx.save();
        // Bubble body
        ctx.beginPath();
        ctx.arc(b.x, b.y, curRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${b.color} ${currentOpacity * 0.25})`;
        ctx.fill();

        // Bubble outer edge
        ctx.strokeStyle = `${b.color} ${currentOpacity * 0.6})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Tiny specular dot on micro-bubble
        ctx.beginPath();
        ctx.arc(b.x - curRadius * 0.35, b.y - curRadius * 0.35, Math.max(curRadius * 0.25, 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cursor-bubble-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
