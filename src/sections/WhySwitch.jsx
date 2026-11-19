import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { benefits } from '../data/benefits.js';

gsap.registerPlugin(ScrollTrigger);

export default function WhySwitch() {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const eyebrowRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  // Auto-cycle through cards if user is idle and not hovering
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % benefits.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Entrance animations via GSAP ScrollTrigger
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        [eyebrowRef.current, headingRef.current],
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards lateral slide-in entrance
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.children,
          {
            x: 70,
            opacity: 0,
            scale: 0.96,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Keyboard navigation for lateral cards
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((prev) => (prev + 1) % benefits.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((prev) => (prev - 1 + benefits.length) % benefits.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(index);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="why"
      className="section-pad bg-[#FAF7EE] text-[#1D2C20] overflow-hidden select-none"
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching exact PDF typography */}
        <div className="mb-10 sm:mb-14">
          <p
            ref={eyebrowRef}
            className="text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold text-[#456F5C] mb-3"
          >
            WHY SWITCH
          </p>
          <h2
            ref={headingRef}
            className="font-heading font-light text-[clamp(34px,4.5vw,62px)] tracking-[-0.035em] leading-[1.08] text-[#073D2B]"
          >
            Why factories are<br />
            switching to pellets.
          </h2>
        </div>

        {/* 4 Lateral Interactive Accordion Cards */}
        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex flex-col md:flex-row gap-3 sm:gap-4 h-[600px] md:h-[480px] lg:h-[500px] w-full"
          role="tablist"
          aria-label="Benefits of switching to pellets"
        >
          {benefits.map((b, i) => {
            const isSelected = active === i;
            return (
              <motion.div
                key={b.id}
                ref={(el) => (cardsRef.current[i] = el)}
                layout
                transition={{
                  layout: {
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1], // Smooth elastic-deceleration curve
                  },
                }}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                tabIndex={0}
                role="tab"
                aria-selected={isSelected}
                aria-label={`Benefit 0${i + 1}: ${b.title.replace('\n', ' ')}`}
                className={`relative rounded-2xl md:rounded-[22px] overflow-hidden cursor-pointer group transition-[box-shadow,opacity] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A56A] ${
                  isSelected
                    ? 'flex-[3.8] shadow-2xl ring-1 ring-black/10'
                    : 'flex-[1] opacity-90 hover:opacity-100 shadow-md hover:shadow-xl'
                }`}
                style={{
                  minWidth: isSelected ? '280px' : '90px',
                  willChange: 'flex-grow, transform',
                }}
              >
                {/* Lateral Image Container with Parallax Zoom and Pan */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center will-change-transform"
                    animate={{
                      scale: isSelected ? 1.05 : 1.15,
                      x: isSelected ? '0%' : i < active ? '-8%' : '8%',
                    }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      backgroundImage: `url(${b.image})`,
                      backgroundPosition: 'center center',
                    }}
                  />
                </div>

                {/* Ambient Cinematic Vignette / Gradients */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
                    isSelected
                      ? 'bg-gradient-to-t from-black/85 via-black/25 to-black/15'
                      : 'bg-gradient-to-t from-black/90 via-black/40 to-black/25 group-hover:from-black/80'
                  }`}
                />

                {/* Lateral Light Sweep Shimmer Effect on Card Activation */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      key={`shimmer-${b.id}`}
                      initial={{ x: '-100%', opacity: 0.5 }}
                      animate={{ x: '200%', opacity: 0 }}
                      transition={{ duration: 0.85, ease: 'easeOut' }}
                      className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-[-20deg] pointer-events-none z-10"
                    />
                  )}
                </AnimatePresence>

                {/* Card Foreground Content */}
                <div className="relative z-20 h-full p-5 sm:p-7 flex flex-col justify-between text-white pointer-events-none">
                  {/* Top Header: Number exact match with PDF (01, 02, 03, 04) */}
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-xs sm:text-[13px] font-medium tracking-wider text-white/80">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Bottom Text Content with Lateral Slide Stagger */}
                  <div className="w-full overflow-hidden">
                    {/* Active State: Descriptive paragraph sliding in laterally */}
                    <AnimatePresence mode="wait">
                      {isSelected && (
                        <motion.div
                          key={`desc-${b.id}`}
                          initial={{ opacity: 0, x: -28 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{
                            duration: 0.45,
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.05,
                          }}
                          className="mb-3 max-w-md"
                        >
                          <p className="text-xs sm:text-[13px] text-[#FAF7EE]/95 leading-relaxed font-normal">
                            {b.text}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Headline / Title: Smooth lateral morph between collapsed & expanded */}
                    <motion.h3
                      layout="position"
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`font-heading font-light tracking-tight transition-colors duration-300 ${
                        isSelected
                          ? 'text-2xl sm:text-3xl lg:text-[34px] leading-tight text-white'
                          : 'text-sm sm:text-base leading-snug text-white/90 group-hover:text-white whitespace-pre-line'
                      }`}
                    >
                      {isSelected ? b.title.replace('\n', ' ') : (b.shortTitle || b.title)}
                    </motion.h3>
                  </div>
                </div>

                {/* Subtle border outline for active card */}
                {isSelected && (
                  <motion.div
                    layoutId="activeBorder"
                    className="absolute inset-0 rounded-2xl md:rounded-[22px] border border-white/20 pointer-events-none z-30"
                    transition={{ duration: 0.45 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Lateral navigation indicator dots */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {benefits.map((b, i) => (
              <button
                key={`btn-dot-${b.id}`}
                onClick={() => setActive(i)}
                aria-label={`Switch to benefit 0${i + 1}`}
                className={`transition-all duration-400 rounded-full h-1.5 ${
                  active === i
                    ? 'w-8 bg-[#073D2B]'
                    : 'w-2 bg-[#073D2B]/25 hover:bg-[#073D2B]/50'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] font-mono tracking-wider text-[#456F5C] uppercase">
            0{active + 1} / 0{benefits.length} · Hover or Click to expand
          </p>
        </div>
      </div>
    </section>
  );
}

