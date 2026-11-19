import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { whatsappUrl } from '../utils/contact.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const navLinks = [
  { label: 'Home',       href: '#top' },
  { label: 'Products',   href: '#products' },
  { label: 'About',      href: '#about' },
  { label: 'Industries', href: '#industries' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'FAQ',        href: '#faq' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const linksRef = useRef([]);
  const waUrl = whatsappUrl('Hi, I want to get a bulk quote for biomass pellets.');

  // Navbar scroll state: add backdrop blur when scrolled
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Navbar entrance on mount
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    gsap.fromTo(headerRef.current,
      { y: -72, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  // Smooth scroll handler using GSAP ScrollToPlugin
  function handleNavClick(e, href) {
    e.preventDefault();
    setOpen(false);
    const target = href === '#top' ? 0 : document.querySelector(href);
    gsap.to(window, {
      scrollTo: target,
      duration: 1.1,
      ease: 'power3.inOut',
    });
  }

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 border-b border-white/10 transition-all duration-300 ${
        scrolled ? 'bg-[#073D2B]/95 backdrop-blur-md' : 'bg-[#073D2B]'
      }`}
      style={{ height: 72 }}
    >
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#top"
          onClick={e => handleNavClick(e, '#top')}
          className="flex items-center gap-2.5 text-[#FAF7EE] no-underline group"
        >
          <div className="w-7 h-7 rounded-full border border-white/25 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
            <span className="font-heading font-bold text-sm tracking-tighter">P</span>
          </div>
          <span className="font-heading tracking-tight text-base font-normal">
            pushpavana
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
          {navLinks.map((l, i) => (
            <a
              key={l.label}
              ref={el => linksRef.current[i] = el}
              href={l.href}
              onClick={e => handleNavClick(e, l.href)}
              className="text-[#FAF7EE] text-xs font-normal opacity-75 hover:opacity-100 transition-opacity relative group"
            >
              {l.label}
              {/* Hover underline slide-in */}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#FAF7EE] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Far Right Action Buttons */}
        <div className="hidden md:flex items-center gap-5">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FAF7EE] text-xs font-normal opacity-85 hover:opacity-100 transition-opacity"
            >
              WhatsApp
            </a>
          )}
          <a
            href="#quote"
            onClick={e => handleNavClick(e, '#quote')}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium bg-[#FAF7EE] text-[#073D2B] hover:bg-white hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xs"
          >
            Get bulk quote
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden text-[#FAF7EE] p-2"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#073D2B]/98 backdrop-blur-md border-t border-white/10 py-5 px-6"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map(l => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-[#FAF7EE] text-sm opacity-80 hover:opacity-100 transition-opacity"
                  onClick={e => handleNavClick(e, l.href)}
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
                {waUrl && (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-[#FAF7EE] text-sm">
                    WhatsApp
                  </a>
                )}
                <a
                  href="#quote"
                  onClick={e => handleNavClick(e, '#quote')}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs font-medium bg-[#FAF7EE] text-[#073D2B]"
                >
                  Get bulk quote
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
