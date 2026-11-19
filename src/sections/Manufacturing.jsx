import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { processSteps } from '../data/processSteps.js';

gsap.registerPlugin(ScrollTrigger);

// Duplicate steps to create a seamless infinite marquee loop
const LOOP_STEPS = [...processSteps, ...processSteps];

export default function Manufacturing() {
  const [activeCard, setActiveCard] = useState(null);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const counterRef = useRef(null);
  const trackWrapperRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  // Measure single loop width dynamically
  const setupInfiniteLoop = () => {
    const track = trackRef.current;
    if (!track) return;

    const firstSet = track.children;
    if (!firstSet || firstSet.length < processSteps.length) return;

    let singleSetWidth = 0;
    for (let i = 0; i < processSteps.length; i++) {
      const card = firstSet[i];
      const style = window.getComputedStyle(card);
      const marginRight = parseFloat(style.marginRight) || 0;
      singleSetWidth += card.offsetWidth + marginRight;
    }

    if (singleSetWidth === 0) return;

    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    gsap.set(track, { x: 0 });

    // Smooth linear continuous marquee (approx 65px per second)
    const duration = singleSetWidth / 65;

    tweenRef.current = gsap.to(track, {
      x: -singleSetWidth,
      duration: duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % singleSetWidth),
      },
      onUpdate() {
        // Calculate active step based on scroll offset
        const currentX = Math.abs(gsap.getProperty(track, 'x') || 0);
        const cardApproxWidth = singleSetWidth / processSteps.length;
        const currentStep = Math.floor(currentX / cardApproxWidth) % processSteps.length;

        if (counterRef.current) {
          counterRef.current.textContent = String(currentStep + 1).padStart(2, '0');
        }
      },
    });
  };

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const timer = setTimeout(setupInfiniteLoop, 150);

    const handleResize = () => {
      setupInfiniteLoop();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Direct native DOM listeners for instantaneous pause on hover / touch
    const wrapper = trackWrapperRef.current;
    const onEnter = () => {
      tweenRef.current?.pause();
    };
    const onLeave = () => {
      setActiveCard(null);
      tweenRef.current?.play();
    };

    if (wrapper) {
      wrapper.addEventListener('mouseenter', onEnter);
      wrapper.addEventListener('mouseleave', onLeave);
      wrapper.addEventListener('touchstart', onEnter, { passive: true });
      wrapper.addEventListener('touchend', onLeave, { passive: true });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (wrapper) {
        wrapper.removeEventListener('mouseenter', onEnter);
        wrapper.removeEventListener('mouseleave', onLeave);
        wrapper.removeEventListener('touchstart', onEnter);
        wrapper.removeEventListener('touchend', onLeave);
      }
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  // Heading Entrance
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="section-pad bg-[#FAF7EE] text-[#1D2C20] border-t border-[#D9DDCF] overflow-hidden select-none"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* Header row matching exact reference PDF typography */}
        <div ref={headingRef} className="flex items-start justify-between">
          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#456F5C] mb-3">
              HOW IT’S MADE
            </p>
            <h2 className="font-heading font-light text-[clamp(34px,4.5vw,60px)] tracking-[-0.035em] leading-[1.05] text-[#073D2B]">
              Seven steps from<br />
              residue to pellet.
            </h2>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-baseline gap-2 pt-2">
            <span
              ref={counterRef}
              className="font-heading font-light text-5xl sm:text-6xl text-[#073D2B] tracking-tight"
            >
              01
            </span>
            <span className="text-xs opacity-40 font-mono tracking-wider">/ 07</span>
          </div>
        </div>
      </div>

      {/* ── Continuous Lateral Infinite Motion Track ── */}
      <div
        ref={trackWrapperRef}
        className="relative w-full overflow-hidden py-3"
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ width: 'max-content' }}
        >
          {LOOP_STEPS.map((step, idx) => {
            const originalIndex = idx % processSteps.length;
            const isSelected = activeCard === originalIndex;

            return (
              <div
                key={`loop-step-${idx}`}
                onClick={() => {
                  if (activeCard === originalIndex) {
                    setActiveCard(null);
                    tweenRef.current?.play();
                  } else {
                    setActiveCard(originalIndex);
                    tweenRef.current?.pause();
                  }
                }}
                className="w-[280px] sm:w-[340px] md:w-[380px] mr-5 sm:mr-6 flex-shrink-0 flex flex-col group cursor-pointer"
              >
                {/* Photo Box with Lateral Parallax & Shimmer Sweep */}
                <div
                  className={`relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-5 bg-[#EAF3DE] transition-all duration-500 shadow-sm ${
                    isSelected
                      ? 'shadow-xl ring-2 ring-[#073D2B] scale-[1.02]'
                      : 'group-hover:shadow-md group-hover:scale-[1.01]'
                  }`}
                >
                  {/* Background Image with Lateral Pan Parallax */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center will-change-transform"
                    animate={{
                      scale: isSelected ? 1.08 : 1.0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      backgroundImage: `url(${step.image})`,
                    }}
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Lateral Light Sweep Shimmer on Click / Active */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        key={`shimmer-active-${idx}`}
                        initial={{ x: '-100%', opacity: 0.5 }}
                        animate={{ x: '200%', opacity: 0 }}
                        transition={{ duration: 0.85, ease: 'easeOut' }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-20deg] pointer-events-none z-10"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Step Number with Gold Accent */}
                <span className="font-mono text-xs text-[#C6A56A] font-semibold mb-1 tracking-wider">
                  {step.number}
                </span>

                {/* Step Title */}
                <h3 className="font-heading font-normal text-xl sm:text-[22px] text-[#073D2B] mb-2 tracking-tight group-hover:text-[#456F5C] transition-colors">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-[13px] text-[#1D2C20]/75 leading-relaxed font-normal">
                  {step.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
