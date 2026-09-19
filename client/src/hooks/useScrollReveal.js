import { useEffect } from 'react';

/**
 * 120fps Hardware-Accelerated Scroll-To-Load & Flip Reveal Observer
 * Continuously animates elements into view whenever the user scrolls down,
 * and resets cleanly when elements leave viewport so animations re-trigger without page reload.
 */
export const useScrollReveal = () => {
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          // When the element scrolls out of the viewport, reset the class
          // so whenever the user scrolls back to it, it re-animates smoothly
          const rect = entry.boundingClientRect;
          if (rect.top > window.innerHeight || rect.bottom < 0) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const observeAllTargets = () => {
      const elements = document.querySelectorAll(
        '.reveal-on-scroll, .flip-on-scroll'
      );
      elements.forEach((el) => observer.observe(el));
    };

    // Initial observation pass
    observeAllTargets();

    // Observe dynamically inserted elements (route changes, data fetches)
    const mutationObserver = new MutationObserver(() => {
      observeAllTargets();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};
