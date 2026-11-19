import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsappUrl } from '../utils/contact.js';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const waUrl = whatsappUrl('Hi, I want to get a bulk quote.');
  const [showTopBtn, setShowTopBtn] = useState(false);

  const footerRef = useRef(null);
  const bannerRef = useRef(null);
  const columnsRef = useRef([]);
  const watermarkRef = useRef(null);
  const topBtnRef = useRef(null);

  // Show back-to-top after 50vh scroll
  useEffect(() => {
    function onScroll() {
      setShowTopBtn(window.scrollY > window.innerHeight * 0.5);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Pre-footer banner entrance
      gsap.fromTo(bannerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      // Link columns stagger
      const cols = columnsRef.current.filter(Boolean);
      gsap.fromTo(cols,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Giant watermark
      gsap.fromTo(watermarkRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 0.6, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: footerRef.current, start: 'top 65%', toggleActions: 'play none none none' },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll to top
  function scrollToTop(e) {
    e.preventDefault();
    gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' });
  }

  return (
    <footer ref={footerRef} id="footer" className="bg-[#073D2B] text-[#FAF7EE] relative overflow-hidden select-none">
      {/* Pre-footer Banner */}
      <div ref={bannerRef} className="border-t border-b border-white/10 py-16 sm:py-20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="font-heading font-light text-[clamp(32px,4vw,60px)] tracking-[-0.04em] text-[#FAF7EE]">
            Ready when your boiler is.
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#quote"
              onClick={e => { e.preventDefault(); document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold bg-white text-[#073D2B] hover:bg-[#FAF7EE] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              Get bulk quote
            </a>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-medium border border-white/30 text-white hover:bg-white/10 transition-all"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container pt-16 pb-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Col 1: Brand */}
          <div ref={el => columnsRef.current[0] = el} className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center bg-white/5">
                <span className="font-heading font-bold text-sm">P</span>
              </div>
              <span className="font-heading text-lg font-normal tracking-tight">pushpavana</span>
            </div>
            <p className="text-xs text-[#FAF7EE]/60 max-w-xs leading-relaxed">
              Tree-free biomass pellets,<br />by the truckload.
            </p>
          </div>

          {/* Col 2: Products */}
          <div ref={el => columnsRef.current[1] = el} className="md:col-span-2 col-span-6">
            <p className="text-[10px] uppercase tracking-widest text-[#C6A56A] font-semibold mb-4">Products</p>
            <ul className="space-y-2.5 text-xs text-[#FAF7EE]/70 font-normal">
              <li><a href="#products" className="hover:text-white transition-colors">Sawdust pellets</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Agro residue pellets</a></li>
              <li><a href="#quote" className="hover:text-white transition-colors">Spec sheets</a></li>
              <li><a href="#quality" className="hover:text-white transition-colors">Lab reports</a></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div ref={el => columnsRef.current[2] = el} className="md:col-span-2 col-span-6">
            <p className="text-[10px] uppercase tracking-widest text-[#C6A56A] font-semibold mb-4">Company</p>
            <ul className="space-y-2.5 text-xs text-[#FAF7EE]/70 font-normal">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#industries" className="hover:text-white transition-colors">Industries</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Col 4: Tools */}
          <div ref={el => columnsRef.current[3] = el} className="md:col-span-2 col-span-6">
            <p className="text-[10px] uppercase tracking-widest text-[#C6A56A] font-semibold mb-4">Tools</p>
            <ul className="space-y-2.5 text-xs text-[#FAF7EE]/70 font-normal">
              <li><a href="#calculator" className="hover:text-white transition-colors">Savings calculator</a></li>
              <li><a href="#quote" className="hover:text-white transition-colors">Get bulk quote</a></li>
            </ul>
          </div>

          {/* Col 5: Contact */}
          <div ref={el => columnsRef.current[4] = el} className="md:col-span-2 col-span-6">
            <p className="text-[10px] uppercase tracking-widest text-[#C6A56A] font-semibold mb-4">Contact</p>
            <ul className="space-y-2 text-xs text-[#FAF7EE]/70 font-normal">
              <li className="leading-relaxed">Level 11, Prestige Trade Tower,<br />Palace Road, Bengaluru</li>
              <li className="pt-2"><a href={waUrl || '#quote'} className="hover:text-white transition-colors">WhatsApp ——</a></li>
              <li><a href="tel:+918000000000" className="hover:text-white transition-colors">Phone ——</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-12 mt-12 border-t border-white/10 text-[11px] text-[#FAF7EE]/50">
          <p>© 2026 Pushpavana Green Energy · GSTIN —— · Privacy · Terms</p>
          <a
            href="#top"
            onClick={scrollToTop}
            aria-label="Back to top"
            className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition-all duration-300 ${
              showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            ↑
          </a>
        </div>
      </div>

      {/* Massive Giant Bottom Watermark */}
      <div
        ref={watermarkRef}
        className="w-full overflow-hidden text-center pointer-events-none select-none -mb-8 sm:-mb-14"
        aria-hidden="true"
      >
        <span className="font-heading font-light text-[18vw] tracking-tighter text-[#0b4d37] opacity-60 leading-none inline-block">
          Pushpavana
        </span>
      </div>
    </footer>
  );
}

