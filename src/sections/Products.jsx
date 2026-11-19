import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products } from '../data/products.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Products() {
  const [split, setSplit] = useState(50);
  const sectionRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const handleRef = useRef(null);
  const eyebrowRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      gsap.fromTo(eyebrowRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' },
        }
      );

      // Left panel slides in from left
      gsap.fromTo(leftPanelRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Right panel slides in from right
      gsap.fromTo(rightPanelRef.current,
        { x: 80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Handle pulse animation
      gsap.fromTo(handleRef.current,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      // Continuous subtle handle pulse
      gsap.to(handleRef.current, {
        scale: 1.08,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="section-pad bg-[#FAF7EE] text-[#1D2C20]">
      <div className="container">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <p ref={eyebrowRef} className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#456F5C]">
            PRODUCTS · TWO GRADES
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSplit(Math.max(25, split - 15))}
              className="w-8 h-8 rounded-full border border-[#D9DDCF] flex items-center justify-center hover:border-[#073D2B] transition-colors cursor-pointer"
              aria-label="Shift view left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setSplit(Math.min(75, split + 15))}
              className="w-8 h-8 rounded-full border border-[#D9DDCF] flex items-center justify-center hover:border-[#073D2B] transition-colors cursor-pointer"
              aria-label="Shift view right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Two-Grade Split Presentation Card */}
        <div className="relative rounded-2xl overflow-hidden h-[540px] shadow-lg border border-[#D9DDCF] select-none">
          {/* Left Side: Premium Sawdust */}
          <div
            ref={leftPanelRef}
            className="absolute inset-y-0 left-0 text-[#FAF7EE] p-8 sm:p-12 flex flex-col justify-between"
            style={{
              width: `${split}%`,
              backgroundImage: `linear-gradient(to top, rgba(7, 61, 43, 0.94), rgba(7, 61, 43, 0.65)), url(${products[0].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'width 0.3s ease',
            }}
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/15 backdrop-blur-xs text-[#FAF7EE]">
                {products[0].grade}
              </span>
              <h3 className="font-heading font-light text-4xl sm:text-5xl mt-3 tracking-tight">
                {products[0].title}
              </h3>
            </div>

            <div className="max-w-md">
              <p className="text-xs sm:text-sm text-[#FAF7EE]/85 leading-relaxed mb-8">
                {products[0].description}
              </p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-white/15 mb-6 text-xs">
                <div>
                  <span className="block opacity-60 text-[10px] uppercase">GCV kcal/kg</span>
                  <span className="font-mono text-sm font-medium mt-0.5 block">{products[0].specs.gcv}</span>
                </div>
                <div>
                  <span className="block opacity-60 text-[10px] uppercase">Ash %</span>
                  <span className="font-mono text-sm font-medium mt-0.5 block">{products[0].specs.ash}</span>
                </div>
                <div>
                  <span className="block opacity-60 text-[10px] uppercase">Moisture %</span>
                  <span className="font-mono text-sm font-medium mt-0.5 block">{products[0].specs.moisture}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#quote" className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-[#073D2B] hover:bg-[#FAF7EE] transition-all">
                  Get quote
                </a>
                <a href="#quote" className="px-6 py-2.5 rounded-full text-xs font-medium border border-white/40 text-[#FAF7EE] hover:bg-white/10 transition-all">
                  Spec sheet ↓
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Value Agro-residue */}
          <div
            ref={rightPanelRef}
            className="absolute inset-y-0 right-0 text-[#FAF7EE] p-8 sm:p-12 flex flex-col justify-between"
            style={{
              width: `${100 - split}%`,
              backgroundImage: `linear-gradient(to top, rgba(50, 42, 28, 0.94), rgba(65, 55, 38, 0.7)), url(${products[1].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transition: 'width 0.3s ease',
            }}
          >
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/15 backdrop-blur-xs text-[#FAF7EE]">
                {products[1].grade}
              </span>
              <h3 className="font-heading font-light text-4xl sm:text-5xl mt-3 tracking-tight">
                {products[1].title}
              </h3>
            </div>

            <div className="max-w-md">
              <p className="text-xs sm:text-sm text-[#FAF7EE]/85 leading-relaxed mb-8">
                {products[1].description}
              </p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-white/15 mb-6 text-xs">
                <div>
                  <span className="block opacity-60 text-[10px] uppercase">GCV kcal/kg</span>
                  <span className="font-mono text-sm font-medium mt-0.5 block">{products[1].specs.gcv}</span>
                </div>
                <div>
                  <span className="block opacity-60 text-[10px] uppercase">Ash %</span>
                  <span className="font-mono text-sm font-medium mt-0.5 block">{products[1].specs.ash}</span>
                </div>
                <div>
                  <span className="block opacity-60 text-[10px] uppercase">Moisture %</span>
                  <span className="font-mono text-sm font-medium mt-0.5 block">{products[1].specs.moisture}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="#quote" className="px-6 py-2.5 rounded-full text-xs font-semibold bg-white text-[#073D2B] hover:bg-[#FAF7EE] transition-all">
                  Get quote
                </a>
                <a href="#quote" className="px-6 py-2.5 rounded-full text-xs font-medium border border-white/40 text-[#FAF7EE] hover:bg-white/10 transition-all">
                  Spec sheet ↓
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Split Divider & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/60 shadow-2xl -translate-x-1/2 flex items-center justify-center pointer-events-none z-10"
            style={{ left: `${split}%`, transition: 'left 0.3s ease' }}
          >
            <div ref={handleRef} className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-[#073D2B]">
              <ChevronLeft size={14} />
              <ChevronRight size={14} />
            </div>
          </div>

          <input
            type="range"
            min={20}
            max={80}
            value={split}
            onChange={e => setSplit(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            aria-label="Adjust product split preview"
          />
        </div>
      </div>
    </section>
  );
}

