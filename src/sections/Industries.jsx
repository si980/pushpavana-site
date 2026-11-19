import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shirt, Utensils, Flame, Pill, FlaskConical, Scroll, Milk, Zap } from 'lucide-react';
import { industries } from '../data/industries.js';

gsap.registerPlugin(ScrollTrigger);

const ICONS = {
  shirt: Shirt,
  utensils: Utensils,
  flame: Flame,
  pill: Pill,
  beaker: FlaskConical,
  scroll: Scroll,
  milk: Milk,
  zap: Zap,
};

export default function Industries() {
  const [active, setActive] = useState(0);
  const current = industries[active];
  const IconComponent = ICONS[current.icon] ?? Shirt;

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const listRef = useRef(null);
  const descriptorRef = useRef(null);
  const iconRef = useRef(null);

  // Animate descriptor on active change
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    if (!descriptorRef.current) return;

    gsap.fromTo(descriptorRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
    gsap.fromTo(iconRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
    );
  }, [active]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Heading entrance
      gsap.fromTo(headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );

      // Industry list items stagger
      const items = listRef.current?.querySelectorAll('li');
      if (items?.length) {
        gsap.fromTo(items,
          { x: 30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="industries" className="section-pad bg-[#073D2B] text-[#FAF7EE]">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Column */}
          <div className="md:col-span-5 flex flex-col justify-between min-h-[440px]">
            <div ref={headingRef}>
              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A56A] mb-3">
                INDUSTRIES
              </p>
              <h2 className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#FAF7EE] mb-6">
                Built for factories<br />
                that run on heat.
              </h2>
            </div>

            {/* Active Industry Descriptor */}
            <div className="pt-8">
              <div className="flex items-center gap-4 mb-4">
                <div ref={iconRef} className="w-12 h-12 rounded-full bg-[#EAF3DE] flex items-center justify-center text-[#073D2B] shrink-0">
                  <IconComponent size={22} />
                </div>
                <p ref={descriptorRef} className="text-sm sm:text-base text-[#FAF7EE] opacity-90 font-normal">
                  {current.descriptor}
                </p>
              </div>
              <p className="font-mono text-xs opacity-40">
                0{active + 1} / 0{industries.length}
              </p>
            </div>
          </div>

          {/* Right Column: Giant Typography Vertical List */}
          <div className="md:col-span-7">
            <ul ref={listRef} className="space-y-1">
              {industries.map((ind, i) => {
                const isSelected = active === i;
                return (
                  <li key={ind.id}>
                    <button
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      className={`w-full text-left py-2.5 flex items-center gap-4 cursor-pointer select-none group transition-all duration-300 ${
                        isSelected ? 'text-[#FAF7EE] opacity-100' : 'text-[#FAF7EE] opacity-40 hover:opacity-75'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {/* Arrow indicator with GSAP-compatible transition */}
                      <span
                        className={`text-[#C6A56A] text-xl font-light leading-none transition-all duration-300 ${
                          isSelected ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 w-0'
                        }`}
                      >
                        →
                      </span>
                      <span className={`font-heading tracking-tight transition-all duration-300 ${
                        isSelected
                          ? 'text-2xl sm:text-3xl font-light text-white'
                          : 'text-2xl sm:text-3xl font-light'
                      }`}>
                        {ind.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

