import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { estimateSavings, inr } from '../utils/calculator.js';

gsap.registerPlugin(ScrollTrigger);

const FUELS = ['Coal', 'Furnace oil', 'Firewood'];
const CITIES = ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad', 'Surat'];

export default function Calculator() {
  const [fuel, setFuel] = useState('Coal');
  const [tonnes, setTonnes] = useState(120);
  const [currentPrice, setCurrentPrice] = useState('');
  const [city, setCity] = useState('');

  const pelletPrice = 6400;
  const { saving } = estimateSavings(tonnes, currentPrice, pelletPrice, fuel);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gstDisplayRef = useRef(null);
  const coalBarRef = useRef(null);
  const pelletBarRef = useRef(null);
  const calcCardRef = useRef(null);
  const animatedGSTRef = useRef(null);

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

      // Animated 18% → (stays at 18, it's a static display — reference shows the contrast)
      // Giant 18% count-up animation
      if (gstDisplayRef.current) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: 18,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() {
            if (gstDisplayRef.current) {
              gstDisplayRef.current.textContent = `${Math.round(obj.val)}%`;
            }
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }

      // Animated counter in hero (5%) for reference
      if (animatedGSTRef.current) {
        const obj2 = { val: 18 };
        gsap.to(obj2, {
          val: 5,
          duration: 1.6,
          ease: 'power3.out',
          delay: 0.6,
          onUpdate() {
            if (animatedGSTRef.current) {
              animatedGSTRef.current.textContent = `${Math.round(obj2.val)}%`;
            }
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        });
      }

      // Coal bar: 0 → 100% width
      gsap.fromTo(coalBarRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        }
      );

      // Pellet bar: 0 → 28% width (already set via inline width in JSX)
      gsap.fromTo(pelletBarRef.current,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.out', delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', once: true },
        }
      );

      // Calculator card entrance
      gsap.fromTo(calcCardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="calculator" className="section-pad bg-[#FAF7EE] text-[#1D2C20] border-t border-[#D9DDCF]">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Column */}
          <div className="md:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#456F5C] mb-3">
              SAVINGS CALCULATOR
            </p>
            <h2 ref={headingRef} className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#073D2B] mb-8">
              Same heat.<br />
              Less tax.
            </h2>

            {/* Giant 18% display — animated count-up */}
            <div className="mb-10">
              <p ref={gstDisplayRef} className="font-heading font-light text-7xl sm:text-8xl tracking-tighter text-[#073D2B] leading-none">
                0%
              </p>
              <p className="text-xs text-[#1D2C20]/70 mt-2 font-medium">
                GST on coal
              </p>
            </div>

            {/* Bar comparison graph */}
            <div className="space-y-4 max-w-sm pt-4 border-t border-[#D9DDCF]">
              <div>
                <div className="flex justify-between text-xs mb-1.5 opacity-80">
                  <span>Coal</span>
                  <span className="font-mono font-medium">18% GST</span>
                </div>
                <div ref={coalBarRef} className="h-2 w-full bg-[#3d3a33] rounded-full" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 opacity-80">
                  <span>Pellets</span>
                  <span className="font-mono font-medium">
                    <span ref={animatedGSTRef}>18%</span> GST
                  </span>
                </div>
                <div ref={pelletBarRef} className="h-2 w-[28%] bg-[#C6A56A] rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Calculator Card */}
          <div ref={calcCardRef} className="md:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D9DDCF] shadow-sm">
              <div className="space-y-6">
                {/* Fuel Toggle Tabs */}
                <div>
                  <span className="text-xs font-semibold text-[#1D2C20] block mb-2">
                    Fuel you use today
                  </span>
                  <div className="inline-flex p-1 bg-[#FAF7EE] rounded-lg border border-[#D9DDCF]">
                    {FUELS.map(f => (
                      <button
                        key={f}
                        onClick={() => setFuel(f)}
                        className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          fuel === f
                            ? 'bg-[#073D2B] text-white shadow-xs'
                            : 'text-[#1D2C20]/70 hover:text-[#1D2C20]'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Use Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-[#1D2C20]">Monthly use</span>
                    <span className="opacity-60 text-[11px]">Drag to set tonnes / month</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={10}
                      max={500}
                      value={tonnes}
                      onChange={e => setTonnes(Number(e.target.value))}
                      className="w-full h-1.5 bg-[#D9DDCF] rounded-lg appearance-none cursor-pointer accent-[#073D2B]"
                    />
                    <span className="font-mono text-xs font-medium w-16 text-right">
                      {tonnes} t
                    </span>
                  </div>
                </div>

                {/* Price and City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">
                      Current fuel price
                    </label>
                    <input
                      type="number"
                      placeholder="₹ per tonne"
                      value={currentPrice}
                      onChange={e => setCurrentPrice(e.target.value)}
                      className="w-full border border-[#D9DDCF] rounded-lg px-3 py-2 text-xs focus:outline-[#073D2B] bg-[#FAF7EE]/40 focus:ring-1 focus:ring-[#073D2B] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">
                      City
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full border border-[#D9DDCF] rounded-lg px-3 py-2 text-xs focus:outline-[#073D2B] bg-[#FAF7EE]/40 focus:ring-1 focus:ring-[#073D2B] transition-all"
                    >
                      <option value="">Choose your city</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Saving Banner */}
                <div className="bg-[#073D2B] text-[#FAF7EE] rounded-xl p-5 mt-6">
                  <p className="text-xs opacity-75 font-normal">Estimated monthly saving</p>
                  <p className="font-heading font-light text-3xl sm:text-4xl mt-1 tracking-tight">
                    {currentPrice ? inr(saving) : '₹ ——'}
                  </p>
                  <p className="text-[10px] opacity-60 mt-1">Based on your inputs and today’s pellet price.</p>
                </div>

                <div className="pt-2">
                  <a
                    href="#quote"
                    className="inline-flex items-center justify-center w-full py-3 rounded-full text-xs font-medium bg-[#073D2B] text-white hover:bg-[#0c573e] transition-colors"
                  >
                    Open full calculator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

