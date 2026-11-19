import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { articles } from '../data/articles.js';

gsap.registerPlugin(ScrollTrigger);

export default function Blog() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

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

      // Cards stagger entrance
      const cards = cardsRef.current.filter(Boolean);
      gsap.fromTo(cards,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="blog" className="section-pad bg-[#FAF7EE] text-[#1D2C20] border-t border-[#D9DDCF]">
      <div className="container">
        {/* Header Row */}
        <div ref={headingRef} className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#456F5C] mb-3">
              BLOG
            </p>
            <h2 className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#073D2B]">
              Notes on<br />
              cleaner heat.
            </h2>
          </div>

          <a href="#quote" className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-[#073D2B] hover:opacity-75 transition-opacity">
            All articles
            <div className="w-8 h-8 rounded-full bg-[#073D2B] text-white flex items-center justify-center hover:bg-[#0c573e] transition-colors">
              <ArrowRight size={14} />
            </div>
          </a>
        </div>

        {/* Article Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((a, i) => (
            <a
              key={a.id}
              ref={el => cardsRef.current[i] = el}
              href={a.url}
              className="group flex flex-col no-underline text-[#1D2C20]"
            >
              {/* Photo Box — image zoom on hover */}
              <div
                className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-[#EAF3DE]"
              >
                <div
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${a.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>

              {/* Category & Read Time */}
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#456F5C] mb-2">
                <span>{a.category}</span>
                <span className="opacity-40">·</span>
                <span className="font-normal opacity-70 lowercase">{a.readMinutes} min read</span>
              </div>

              {/* Title */}
              <h3 className="font-heading font-normal text-base text-[#073D2B] group-hover:text-[#0b5f43] transition-colors leading-snug">
                {a.title}
              </h3>
            </a>
          ))}
        </div>

        {/* Pagination dashes */}
        <div className="flex items-center gap-2 mt-10">
          <span className="w-8 h-1 bg-[#073D2B] rounded-full" />
          <span className="w-2 h-1 bg-[#D9DDCF] rounded-full" />
          <span className="w-2 h-1 bg-[#D9DDCF] rounded-full" />
          <span className="w-2 h-1 bg-[#D9DDCF] rounded-full" />
        </div>
      </div>
    </section>
  );
}

