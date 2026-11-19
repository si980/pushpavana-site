import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { specs } from '../data/specs.js';

gsap.registerPlugin(ScrollTrigger);

export default function Quality() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const pelletsRef = useRef([]);
  const specRowsRef = useRef([]);
  const panelRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Left panel (pellet inspection UI) entrance
      gsap.fromTo(panelRef.current,
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Pellet models stagger
      const pellets = pelletsRef.current.filter(Boolean);
      gsap.fromTo(pellets,
        { scale: 0.6, opacity: 0, y: 20 },
        {
          scale: 1, opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
        }
      );

      // Spec rows progressive reveal
      const rows = specRowsRef.current.filter(Boolean);
      gsap.fromTo(rows,
        { x: 20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="quality" className="section-pad bg-[#073D2B] text-[#FAF7EE]">
      <div className="container">
        {/* Eyebrow & Title */}
        <div ref={headingRef} className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A56A] mb-3">
            QUALITY
          </p>
          <h2 className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#FAF7EE]">
            Every lot,<br />
            under the lens.
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-12 sm:gap-16 items-center">
          {/* Left Side: 3 Pellets Under Digital Crosshairs */}
          <div
            ref={panelRef}
            className="md:col-span-6 bg-[#04281c] rounded-2xl p-8 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]"
          >
            {/* Measurement Chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10 text-[10px] font-mono text-[#FAF7EE]/90">
              <span className="px-2.5 py-1 rounded bg-white/10 border border-white/15">GCV —— kcal/kg</span>
              <span className="px-2.5 py-1 rounded bg-white/10 border border-white/15">Moisture &lt; —— %</span>
              <span className="px-2.5 py-1 rounded bg-white/10 border border-white/15">Ash &lt; —— %</span>
            </div>

            {/* 3 Pellets Horizontal Row */}
            <div className="flex items-center justify-center gap-6 my-4 relative z-10">
              {[1, 2, 3].map((p, i) => (
                <div ref={el => pelletsRef.current[i] = el} key={p} className="relative flex flex-col items-center">
                  {/* Digital crosshair bracket */}
                  <div className="absolute -inset-2 border border-dashed border-[#C6A56A]/60 rounded-md pointer-events-none" />
                  {/* Pellet cylinder */}
                  <div
                    className="w-12 h-24 rounded-full shadow-lg"
                    style={{
                      background: 'linear-gradient(to right, #967844, #C6A56A, #755b30)',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), 0 4px 8px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-6 relative z-10">
              Batch Inspection PG-Tested
            </p>
          </div>

          {/* Right Side: Specification Table */}
          <div className="md:col-span-6">
            <div className="space-y-4 max-w-md">
              {specs.map((s, i) => (
                <div
                  key={s.label}
                  ref={el => specRowsRef.current[i] = el}
                  className="flex items-baseline justify-between py-2.5 border-b border-white/10 text-xs sm:text-sm"
                >
                  <span className="opacity-70 font-normal">{s.label}</span>
                  <span className="font-mono font-medium text-white tracking-wide">
                    {s.prefix}{s.value} {s.unit}
                  </span>
                </div>
              ))}

              <div
                ref={el => specRowsRef.current[specs.length] = el}
                className="flex items-baseline justify-between py-2.5 border-b border-white/10 text-xs sm:text-sm opacity-60"
              >
                <span>Lot tested before dispatch</span>
                <span className="font-mono">Lot PG-——</span>
              </div>

              <div className="pt-6" ref={el => specRowsRef.current[specs.length + 1] = el}>
                <a
                  href="#quote"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold bg-white text-[#073D2B] hover:bg-[#FAF7EE] transition-all shadow-md"
                >
                  Download lab reports
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

