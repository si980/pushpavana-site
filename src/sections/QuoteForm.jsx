import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsappUrl, telUrl } from '../utils/contact.js';

gsap.registerPlugin(ScrollTrigger);

const FUELS = ['', 'Coal', 'Furnace oil', 'Firewood', 'Other'];

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: '', company: '', phone: '', city: '', fuel: '', tonnage: '', grade: '',
  });

  const waUrl = whatsappUrl('Hi, I want to get a bulk quote for biomass pellets.');
  const tel = telUrl();

  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);

  function handleSubmit(e) {
    e.preventDefault();
    const msg = `Bulk Quote Request:\n- Name: ${form.name || 'N/A'}\n- Company: ${form.company || 'N/A'}\n- Phone: ${form.phone || 'N/A'}\n- City: ${form.city || 'N/A'}\n- Current Fuel: ${form.fuel || 'N/A'}\n- Monthly Tonnage: ${form.tonnage || 'N/A'}\n- Grade: ${form.grade || 'Not sure'}`;
    const url = whatsappUrl(msg);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Thank you! Your quote request has been recorded.');
    }
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Left content slides in from left
      gsap.fromTo(leftRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        }
      );

      // Form card slides in from right
      gsap.fromTo(formRef.current,
        { x: 50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', toggleActions: 'play none none none' },
        }
      );

      // Form fields stagger
      const fields = fieldsRef.current.filter(Boolean);
      gsap.fromTo(fields,
        { y: 15, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const inputClass = 'w-full border border-[#D9DDCF] rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#073D2B] focus:border-[#073D2B] bg-white transition-all duration-200';

  return (
    <section ref={sectionRef} id="quote" className="section-pad bg-[#073D2B] text-[#FAF7EE]">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Column */}
          <div ref={leftRef} className="md:col-span-6 flex flex-col justify-between min-h-[460px]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A56A] mb-3">
                GET A BULK QUOTE
              </p>
              <h2 className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#FAF7EE] mb-6">
                Tell us your boiler.<br />
                We’ll send the numbers.
              </h2>
              <p className="text-xs sm:text-sm text-[#FAF7EE]/75 leading-relaxed max-w-md mb-8">
                Share your boiler, monthly tonnage and city. We’ll reply with grade, price per tonne and a delivery schedule.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold bg-white text-[#073D2B] hover:bg-[#FAF7EE] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Chat on WhatsApp
                  </a>
                )}
                {tel ? (
                  <a href={tel} className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-medium border border-white/30 text-white hover:bg-white/10 transition-all">
                    Call sales
                  </a>
                ) : (
                  <a href="tel:+918000000000" className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-medium border border-white/30 text-white hover:bg-white/10 transition-all">
                    Call sales
                  </a>
                )}
              </div>
            </div>

            <p className="text-[11px] text-[#FAF7EE]/50 font-normal pt-4 border-t border-white/10">
              Level 11, Prestige Trade Tower, Palace Road, Bengaluru
            </p>
          </div>

          {/* Right Column: Form Card */}
          <div ref={formRef} className="md:col-span-6">
            <form
              onSubmit={handleSubmit}
              className="bg-[#FAF7EE] text-[#1D2C20] rounded-2xl p-6 sm:p-10 shadow-xl border border-[#D9DDCF]"
            >
              <h3 className="font-heading font-normal text-xl text-[#073D2B] mb-6">Request a quote</h3>

              <div className="space-y-4">
                {/* Row 1: Name & Company */}
                <div ref={el => fieldsRef.current[0] = el} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">Company</label>
                    <input
                      type="text"
                      placeholder="Company name"
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 2: Phone & City */}
                <div ref={el => fieldsRef.current[1] = el} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+91"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="Delivery city"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 3: Fuel & Tonnage */}
                <div ref={el => fieldsRef.current[2] = el} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">Fuel used today</label>
                    <select
                      value={form.fuel}
                      onChange={e => setForm({ ...form, fuel: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Choose</option>
                      {FUELS.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">Monthly tonnage</label>
                    <input
                      type="text"
                      placeholder="e.g. 120 t"
                      value={form.tonnage}
                      onChange={e => setForm({ ...form, tonnage: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 4: Grade */}
                <div ref={el => fieldsRef.current[3] = el}>
                  <label className="text-xs font-semibold text-[#1D2C20] block mb-1.5">Grade</label>
                  <select
                    value={form.grade}
                    onChange={e => setForm({ ...form, grade: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Sawdust, agro residue or not sure</option>
                    <option value="sawdust">Sawdust (Premium)</option>
                    <option value="agro">Agro-residue (Value)</option>
                    <option value="unsure">Not sure</option>
                  </select>
                </div>

                {/* Submit */}
                <div ref={el => fieldsRef.current[4] = el} className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full text-xs font-semibold bg-[#073D2B] text-white hover:bg-[#0c573e] active:scale-[0.98] transition-all shadow-md cursor-pointer"
                  >
                    Request quote
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

