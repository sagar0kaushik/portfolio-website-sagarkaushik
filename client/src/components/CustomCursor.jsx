import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on non-touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList?.contains('cursor-pointer') ||
        target.closest?.('.cursor-pointer') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest?.('.project-card') ||
        target.closest?.('.blog-card') ||
        target.closest?.('.editorial-card')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.75 : isHovered ? 1.6 : 1})`,
          backgroundColor: isHovered ? '#315BDD' : '#073B32'
        }}
      />
      <div
        className="custom-cursor-ring"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isMouseDown ? 0.85 : isHovered ? 1.7 : 1})`,
          borderColor: isHovered ? 'rgba(49, 91, 221, 0.7)' : 'rgba(7, 59, 50, 0.22)',
          backgroundColor: isHovered ? 'rgba(49, 91, 221, 0.06)' : 'transparent'
        }}
      />
    </>
  );
};
