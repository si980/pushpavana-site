import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const images = [
    'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
  ];

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const manifestoRef = useRef(null);
  const metaRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // Eyebrow entrance
      gsap.fromTo(eyebrowRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        }
      );

      // Manifesto text: line-by-line clip-path mask reveal
      const lines = manifestoRef.current?.querySelectorAll('.manifesto-line');
      if (lines?.length) {
        gsap.fromTo(lines,
          { y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)',
            duration: 1.0, stagger: 0.18, ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', toggleActions: 'play none none none' },
          }
        );
      }

      // Meta row
      gsap.fromTo(metaRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 72%', toggleActions: 'play none none none' },
        }
      );

      // Image strip stagger
      const imgs = imagesRef.current.filter(Boolean);
      gsap.fromTo(imgs,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="section-pad bg-[#FAF7EE] text-[#1D2C20] border-t border-[#D9DDCF]">
      <div className="container">
        {/* Eyebrow */}
        <p ref={eyebrowRef} className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#456F5C] mb-6">
          ABOUT
        </p>

        {/* Large Editorial Manifesto — line by line mask reveal */}
        <div ref={manifestoRef} className="max-w-4xl mb-8 overflow-hidden">
          <p className="font-heading font-light text-[clamp(28px,3.8vw,52px)] tracking-[-0.035em] leading-[1.12] text-[#073D2B]">
            <span className="manifesto-line block overflow-hidden">We make fuel from what’s left over —</span>
            <span className="manifesto-line block overflow-hidden">husk, straw and sawdust — and never</span>
            <span className="manifesto-line block overflow-hidden">from cut trees. Dense, dry, lab-tested</span>
            <span className="manifesto-line block overflow-hidden">pellets for factories that run on heat.</span>
          </p>
        </div>

        {/* Meta Row */}
        <div ref={metaRef} className="flex flex-wrap items-center gap-6 text-xs text-[#1D2C20]/75 font-normal pb-12">
          <span>Tree-free</span>
          <span>B2B only</span>
          <span>Bengaluru</span>
          <a href="#quote" className="text-[#073D2B] font-medium underline underline-offset-4 hover:opacity-75 transition-opacity">
            Read our story →
          </a>
        </div>

        {/* 3-Image Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div
              key={i}
              ref={el => imagesRef.current[i] = el}
              className="h-56 sm:h-64 rounded-xl overflow-hidden shadow-xs bg-[#EAF3DE] group cursor-default"
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

