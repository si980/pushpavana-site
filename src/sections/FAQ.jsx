import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsappUrl } from '../utils/contact.js';

gsap.registerPlugin(ScrollTrigger);

// Chat messages data — verbatim from reference PDF
const messages = [
  { type: 'user', text: 'What’s the GST on pellets?' },
  { type: 'reply', text: '5% against 18% on coal, since 22 Sep 2025.' },
  { type: 'user', text: 'Are they made from trees?' },
  { type: 'reply', text: 'Never. Only residue: sawdust, husks and stalks.' },
  { type: 'user', text: 'Can we start with a trial order?' },
  { type: 'reply', text: 'Yes: one truckload first, then monthly or annual contracts.' },
];

export default function FAQ() {
  const waUrl = whatsappUrl('Hi, I have a question about Pushpavana biomass pellets.');

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const chatPanelRef = useRef(null);
  const messagesRef = useRef([]);
  const typingRef = useRef(null);

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

      // Chat panel slides in
      gsap.fromTo(chatPanelRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
        }
      );

      // Chat messages stagger with alternating direction
      const bubbles = messagesRef.current.filter(Boolean);
      bubbles.forEach((bubble, i) => {
        const isUser = messages[i]?.type === 'user';
        gsap.fromTo(bubble,
          { x: isUser ? 30 : -30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none none' },
          }
        );
      });

      // Typing dots
      if (typingRef.current) {
        gsap.fromTo(typingRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.4, delay: messages.length * 0.15 + 0.3,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
          }
        );
        // Pulse typing dots
        gsap.to(typingRef.current, {
          opacity: 0.4, duration: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: messages.length * 0.15 + 0.7,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="section-pad bg-[#FAF7EE] text-[#1D2C20] border-t border-[#D9DDCF]">
      <div className="container">
        <div className="grid md:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Column */}
          <div ref={headingRef} className="md:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#456F5C] mb-3">
              FAQ
            </p>
            <h2 className="font-heading font-light text-[clamp(36px,4.5vw,56px)] tracking-[-0.04em] leading-[1.05] text-[#073D2B] mb-6">
              Ask us<br />
              anything.
            </h2>
            <p className="text-xs sm:text-sm text-[#1D2C20]/75 leading-relaxed mb-8 max-w-sm">
              The questions buyers ask most — answered the way sales answers them on WhatsApp.
            </p>

            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-semibold bg-[#073D2B] text-white hover:bg-[#0c573e] transition-all shadow-md mb-8"
              >
                Chat on WhatsApp
              </a>
            )}

            <div>
              <a href="#quote" className="text-xs text-[#073D2B] font-medium underline underline-offset-4 hover:opacity-75 transition-opacity">
                See all questions →
              </a>
            </div>
          </div>

          {/* Right Column: WhatsApp Chat Card */}
          <div ref={chatPanelRef} className="md:col-span-7">
            <div className="bg-[#EAF3DE]/60 rounded-2xl p-6 sm:p-8 border border-[#D9DDCF] shadow-sm max-w-lg">
              {/* Header Pill */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#073D2B] text-[#FAF7EE] mb-6 shadow-xs">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">P</div>
                <div>
                  <p className="text-xs font-medium leading-none">Pushpavana sales</p>
                  <p className="text-[9px] opacity-70 mt-0.5 leading-none">replies on WhatsApp</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 text-xs">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    ref={el => messagesRef.current[i] = el}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.type === 'user' ? (
                      <div className="bg-[#073D2B] text-white px-4 py-2.5 rounded-2xl rounded-tr-xs max-w-[85%] shadow-xs">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="bg-white text-[#1D2C20] px-4 py-2.5 rounded-2xl rounded-tl-xs max-w-[85%] shadow-xs leading-relaxed border border-[#D9DDCF]/50">
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Dots */}
                <div ref={typingRef} className="flex justify-start pt-2">
                  <div className="bg-white/80 text-[#1D2C20]/40 px-4 py-1.5 rounded-full text-xs tracking-widest">
                    •••
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

