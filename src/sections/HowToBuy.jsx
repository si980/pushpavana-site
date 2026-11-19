import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buyingSteps } from '../data/buyingSteps.js';
import { whatsappUrl, telUrl } from '../utils/contact.js';

gsap.registerPlugin(ScrollTrigger);

export default function HowToBuy() {
  const [active, setActive] = useState(4);
  const current = buyingSteps[active];

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const stepListRef = useRef(null);
  const activeCardRef = useRef(null);
  const watermarkRef = useRef(null);
  const prevActive = useRef(4);

  const waUrl = whatsappUrl('Hi, I want to discuss a trial order for biomass pellets.');
  const tel = telUrl();

  // Animate card when active changes
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!activeCardRef.current) return;

    // Slide card content out then in
    gsap.fromTo(activeCardRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    );

    // Watermark numeral
    if (watermarkRef.current) {
      gsap.fromTo(watermarkRef.current,
        { opacity: 0, y: 10 },
        { opacity: 0.05, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }

    prevActive.current = active;
  }, [active]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', toggleActions: 'play none none none' },
        }
      );

      // Step list items stagger
      const items = stepListRef.current?.querySelectorAll('button');
      if (items?.length) {
        gsap.fromTo(items,
          { x: -25, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
          }
        );
      }

      // Active card entrance
      gsap.fromTo(activeCardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="buy" className="section-pad bg-[#FAF7EE] text-[#1D2C20] border-t border-[#D9DDCF]">
      <div className="container">
        {/* Eyebrow & Headline */}
        <div ref={headingRef} className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#456F5C] mb-3">
            HOW TO BUY
          </p>
          <h2 className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#073D2B]">
            From first call<br />
            to regular supply.
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Side: Step List */}
          <div ref={stepListRef} className="md:col-span-5 space-y-3">
            {buyingSteps.map((step, i) => {
              const isSelected = active === i;
              return (
                <button
                  key={step.id}
                  onClick={() => setActive(i)}
                  className={`w-full text-left py-3 px-4 rounded-xl transition-all duration-300 flex items-center gap-4 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-white text-[#073D2B] font-semibold shadow-xs border border-[#D9DDCF]'
                      : 'text-[#1D2C20]/60 hover:text-[#1D2C20] hover:bg-white/50'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className={`font-mono text-xs transition-all duration-300 ${isSelected ? 'text-[#073D2B]' : 'opacity-40'}`}>
                    {step.number}
                  </span>
                  <span className="text-xs sm:text-sm">{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side: Active Step Card */}
          <div className="md:col-span-7">
            <div className="relative rounded-2xl bg-[#073D2B] text-[#FAF7EE] p-8 sm:p-12 overflow-hidden shadow-lg min-h-[340px] flex flex-col justify-between">
              {/* Giant numeral watermark */}
              <div
                ref={watermarkRef}
                className="absolute top-4 right-8 font-heading font-light text-9xl text-white/5 pointer-events-none select-none"
                aria-hidden="true"
              >
                {current.number}
              </div>

              <div ref={activeCardRef}>
                <span className="font-mono text-4xl sm:text-5xl font-light text-white block mb-4">
                  {current.number}
                </span>
                <h3 className="font-heading font-normal text-2xl sm:text-3xl text-white mb-3 tracking-tight">
                  {current.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF7EE]/80 leading-relaxed max-w-md">
                  {current.text}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-white/10">
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white text-[#073D2B] hover:bg-[#FAF7EE] transition-all shadow-xs"
                  >
                    Chat on WhatsApp
                  </a>
                )}
                {tel ? (
                  <a href={tel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-white/30 text-white hover:bg-white/10 transition-all">
                    Call sales
                  </a>
                ) : (
                  <a href="#quote" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium border border-white/30 text-white hover:bg-white/10 transition-all">
                    Call sales
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

