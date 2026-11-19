/**
 * GSAP Initialization Utility
 * Registers ScrollTrigger + ScrollToPlugin and sets global defaults.
 * Import this ONCE at the app root (main.jsx or App.jsx).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global defaults
gsap.defaults({
  ease: 'power2.out',
  duration: 0.8,
});

// ScrollTrigger defaults for smooth entrance and persistent visibility
ScrollTrigger.defaults({
  toggleActions: 'play none none none',
  start: 'top 85%',
});

// Respect prefers-reduced-motion
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) {
  gsap.globalTimeline.timeScale(0); // Instant — no motion
  ScrollTrigger.getAll().forEach(t => t.kill());
}

export { gsap, ScrollTrigger };
export default gsap;
