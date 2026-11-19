import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowUpRight, Search, Phone, ChevronDown } from 'lucide-react';
import { whatsappUrl, telUrl } from '../utils/contact.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const TOTAL_FRAMES = 287;
const FRAME_PREFIX = '/assets/sequence/ezgif-frame-';

function getFramePath(index) {
  const num = String(index + 1).padStart(3, '0');
  return `${FRAME_PREFIX}${num}.jpg`;
}

export default function Hero() {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Hero UI overlay refs
  const heroUiRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const statsLeftRef = useRef(null);
  const statsRightRef = useRef(null);
  const ctaRef = useRef(null);
  const watermarkRef = useRef(null);
  const scrollPromptRef = useRef(null);

  // Scrollytelling story caption refs
  const caption1Ref = useRef(null);
  const caption2Ref = useRef(null);
  const caption3Ref = useRef(null);

  // Frame assets storage (no React re-renders on every frame change)
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);
  const isVideoPlayingRef = useRef(true);

  // Loading indicator state
  const [loadProgress, setLoadProgress] = useState(0);
  const [isInitialReady, setIsInitialReady] = useState(false);

  const waUrl = whatsappUrl('Hi, I want to get a bulk quote for biomass pellets.');
  const tel = telUrl();

  // ── High-DPI Canvas Rendering ──────────────────────────────────────────────
  const renderFrame = useCallback((frameIndex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    let img = images[frameIndex];

    // Fallback to nearest loaded frame if current frame is still streaming
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (frameIndex - offset >= 0 && images[frameIndex - offset]?.complete) {
          img = images[frameIndex - offset];
          break;
        }
        if (frameIndex + offset < TOTAL_FRAMES && images[frameIndex + offset]?.complete) {
          img = images[frameIndex + offset];
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Cover scale calculation (maintains aspect ratio, fills canvas without stretching)
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgRatio = imgW / imgH;
    const canvasRatio = width / height;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = width;
      drawH = width / imgRatio;
      drawX = 0;
      drawY = (height - drawH) / 2;
    } else {
      drawH = height;
      drawW = height * imgRatio;
      drawX = (width - drawW) / 2;
      drawY = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }, []);

  // ── Frame Preloading Pipeline ──────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    // 1. Immediately load frame 0 for instant visual presence
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      loadedCount++;
      setIsInitialReady(true);
      renderFrame(0);
    };

    // 2. Preload first 30 frames aggressively
    const INITIAL_BURST = Math.min(30, TOTAL_FRAMES);
    for (let i = 1; i < INITIAL_BURST; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        imagesRef.current[i] = img;
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
      };
      img.onerror = () => {
        loadedCount++;
      };
    }

    // 3. Progressively load remaining frames in small non-blocking chunks
    let nextIndex = INITIAL_BURST;
    const CHUNK_SIZE = 6;

    const loadNextChunk = () => {
      if (nextIndex >= TOTAL_FRAMES) return;
      const end = Math.min(nextIndex + CHUNK_SIZE, TOTAL_FRAMES);
      for (let i = nextIndex; i < end; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          imagesRef.current[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        };
        img.onerror = () => {
          loadedCount++;
        };
      }
      nextIndex = end;
      if (nextIndex < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextChunk, { timeout: 250 });
        } else {
          setTimeout(loadNextChunk, 40);
        }
      }
    };

    const idleTimeout = setTimeout(loadNextChunk, 150);

    // Handle window resize for high-DPI canvas
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(idleTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [renderFrame]);

  // ── Bulletproof HTML5 Looping Video Setup ──────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const tryPlay = () => {
      video.play().catch(() => {
        const retry = () => {
          video.play().catch(() => { });
          window.removeEventListener('click', retry);
          window.removeEventListener('scroll', retry);
          window.removeEventListener('touchstart', retry);
        };
        window.addEventListener('click', retry, { once: true, passive: true });
        window.addEventListener('scroll', retry, { once: true, passive: true });
        window.addEventListener('touchstart', retry, { once: true, passive: true });
      });
    };

    tryPlay();
  }, []);

  // ── GSAP ScrollTrigger Master Scrollytelling Timeline ─────────────────────
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // 1. Initial Page Entrance Animation
      const enterTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      enterTl.fromTo(
        watermarkRef.current,
        { opacity: 0, y: 30 },
        { opacity: 0.45, y: 0, duration: 1.4 },
        0
      );

      const headlineWords = headlineRef.current?.querySelectorAll('.hero-line');
      if (headlineWords?.length) {
        enterTl.fromTo(
          headlineWords,
          { y: 55, opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.95, stagger: 0.1 },
          0.1
        );
      }

      enterTl.fromTo(
        subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 0.85, duration: 0.75 },
        0.35
      );

      enterTl.fromTo(
        [statsLeftRef.current, statsRightRef.current],
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        0.5
      );

      enterTl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        0.65
      );

      enterTl.fromTo(
        scrollPromptRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'sine.out' },
        1.1
      );

      // 2. Master ScrollTrigger Pinning & Frame Scrub
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: stickyRef.current,
        pinSpacing: false,
        scrub: 0.4,
        onUpdate: (self) => {
          const progress = self.progress;

          // Compute exact target frame index [0 to 286]
          const targetFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.floor(progress * (TOTAL_FRAMES - 1)))
          );

          if (targetFrame !== currentFrameRef.current) {
            currentFrameRef.current = targetFrame;
            if (animFrameIdRef.current) {
              cancelAnimationFrame(animFrameIdRef.current);
            }
            animFrameIdRef.current = requestAnimationFrame(() => {
              renderFrame(targetFrame);
            });
          }

          // ── Seamless MP4 Video to Canvas Crossfade ────────────────────────
          const video = videoRef.current;
          const canvas = canvasRef.current;

          if (video && canvas) {
            if (progress <= 0.015) {
              // At rest at very top: video 100% visible, playing
              video.style.opacity = '1';
              canvas.style.opacity = '0';
              if (!isVideoPlayingRef.current) {
                video.play().catch(() => { });
                isVideoPlayingRef.current = true;
              }
            } else if (progress > 0.015 && progress <= 0.08) {
              // Smooth crossfade band [1.5% to 8%]
              const fadeRatio = (progress - 0.015) / 0.065;
              video.style.opacity = String(1 - fadeRatio);
              canvas.style.opacity = String(fadeRatio);
              if (!isVideoPlayingRef.current) {
                video.play().catch(() => { });
                isVideoPlayingRef.current = true;
              }
            } else {
              // In scrollytelling mode: canvas 100% visible, video paused
              video.style.opacity = '0';
              canvas.style.opacity = '1';
              if (isVideoPlayingRef.current) {
                video.pause();
                isVideoPlayingRef.current = false;
              }
            }
          }

          // ── Hero UI Overlay Fade-out ─────────────────────────────────────
          const heroUi = heroUiRef.current;
          if (heroUi) {
            if (progress <= 0.12) {
              const uiAlpha = 1 - progress / 0.12;
              heroUi.style.opacity = String(Math.max(0, uiAlpha));
              heroUi.style.transform = `translateY(${-progress * 220}px)`;
              heroUi.style.pointerEvents = uiAlpha > 0.3 ? 'auto' : 'none';
            } else {
              heroUi.style.opacity = '0';
              heroUi.style.pointerEvents = 'none';
            }
          }

          // ── Narrative Story Captions Timed Scrub ──────────────────────────
          // Caption 1: Phase 1 (Raw Harvest Residue) [12% to 40%] (~2.0s sustained reading)
          const c1 = caption1Ref.current;
          if (c1) {
            if (progress >= 0.12 && progress <= 0.40) {
              const localP = (progress - 0.12) / 0.28;
              const alpha = localP < 0.20 ? localP / 0.20 : localP > 0.80 ? (1 - localP) / 0.20 : 1;
              c1.style.opacity = String(alpha);
              c1.style.transform = `translateY(${(1 - alpha) * 20}px)`;
            } else {
              c1.style.opacity = '0';
            }
          }

          // Caption 2: Phase 2 (Molecular Centrifugal Spiral) [42% to 70%] (~2.0s sustained reading)
          const c2 = caption2Ref.current;
          if (c2) {
            if (progress >= 0.42 && progress <= 0.70) {
              const localP = (progress - 0.42) / 0.28;
              const alpha = localP < 0.20 ? localP / 0.20 : localP > 0.80 ? (1 - localP) / 0.20 : 1;
              c2.style.opacity = String(alpha);
              c2.style.transform = `translateY(${(1 - alpha) * 20}px)`;
            } else {
              c2.style.opacity = '0';
            }
          }

          // Caption 3: Phase 3 (High-Calorie Pellet Stream) [72% to 96%] (~2.0s sustained reading)
          const c3 = caption3Ref.current;
          if (c3) {
            if (progress >= 0.72 && progress <= 0.96) {
              const localP = (progress - 0.72) / 0.24;
              const alpha = localP < 0.20 ? localP / 0.20 : localP > 0.85 ? (1 - localP) / 0.15 : 1;
              c3.style.opacity = String(alpha);
              c3.style.transform = `translateY(${(1 - alpha) * 20}px)`;
            } else {
              c3.style.opacity = '0';
            }
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [renderFrame]);

  // ── Hero Section Auto-Scroll (Triggered by slight gesture, stops at last frame) ──
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let isAutoScrolling = false;
    let touchStartY = 0;
    let lastTriggerTime = 0;
    let activeTween = null;

    const getHeroScrollDistance = () => {
      if (!containerRef.current) return 0;
      return containerRef.current.offsetHeight - window.innerHeight;
    };

    const scrollToHeroTarget = (targetY) => {
      const now = Date.now();
      if (isAutoScrolling || now - lastTriggerTime < 500) return;
      isAutoScrolling = true;
      lastTriggerTime = now;

      if (activeTween) {
        activeTween.kill();
      }

      const scrollObj = { y: window.scrollY };

      activeTween = gsap.to(scrollObj, {
        y: targetY,
        duration: 6.8, // Natural video speed matching 95s reference video pacing (~40fps playback)
        ease: 'power1.inOut',
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
          ScrollTrigger.update();
        },
        onComplete: () => {
          window.scrollTo(0, targetY);
          ScrollTrigger.update();
          setTimeout(() => {
            isAutoScrolling = false;
            activeTween = null;
          }, 100);
        },
      });
    };

    const handleWheel = (e) => {
      const heroDist = getHeroScrollDistance();
      if (heroDist <= 0) return;

      const currentY = window.scrollY;

      // 1. Outside Hero section completely (in WhySwitch, Products, etc.) -> 100% normal native scroll
      if (currentY > heroDist + 15) {
        return;
      }

      // 2. If actively auto-scrolling inside Hero, prevent wheel jitter
      if (isAutoScrolling) {
        e.preventDefault();
        return;
      }

      // 3. Going DOWN: User is in upper part of Hero and scrolls DOWN -> smooth 3x glide to last frame
      // Once near heroDist, downward scroll is allowed naturally into next sections
      if (currentY < heroDist - 40 && e.deltaY > 6) {
        e.preventDefault();
        scrollToHeroTarget(heroDist);
        return;
      }

      // 4. Going UP: User is at bottom of Hero (or entering back into Hero) and scrolls UP -> smooth 3x glide to top frame
      if (currentY > 40 && currentY <= heroDist + 15 && e.deltaY < -6) {
        e.preventDefault();
        scrollToHeroTarget(0);
        return;
      }
    };

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const heroDist = getHeroScrollDistance();
      if (heroDist <= 0) return;

      const currentY = window.scrollY;
      if (currentY > heroDist + 15) return;

      if (isAutoScrolling) {
        e.preventDefault();
        return;
      }

      const touchY = e.touches[0].clientY;
      const diff = touchStartY - touchY; // positive = swipe up (scroll down)

      if (currentY < heroDist - 40 && diff > 15) {
        e.preventDefault();
        scrollToHeroTarget(heroDist);
      } else if (currentY > 40 && currentY <= heroDist + 15 && diff < -15) {
        e.preventDefault();
        scrollToHeroTarget(0);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      if (activeTween) activeTween.kill();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative w-full bg-[#073D2B] text-[#FAF7EE] select-none"
      style={{ height: '380vh' }} // Pinned scroll track (3.8x viewport)
    >
      {/* ── Sticky Fullscreen Viewport Window (Stays locked during scroll) ── */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        {/* ── LAYER 1: Fullscreen High-DPI Canvas Image Sequence ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300"
          style={{ opacity: 0 }}
          aria-label="Interactive scroll-driven biomass densification sequence"
        />

        {/* ── LAYER 2: Initial Looping HTML5 Video (Plays before scroll) ── */}
        <video
          ref={videoRef}
          src="/assets/Biomass_sphere_rotating_animation_e2d77056.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-1 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: 1 }}
          aria-label="Looping idle biomass sphere"
        />

        {/* ── LAYER 3: Ambient Atmosphere & Vignette Overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none z-2"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(7,61,43,0.1) 0%, rgba(7,61,43,0.45) 80%, rgba(7,61,43,0.85) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Massive Background Watermark */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-2"
          aria-hidden="true"
        >
          <span className="font-heading font-light text-[17vw] tracking-tight text-[#FAF7EE] opacity-10 whitespace-nowrap">
            Pushpavana
          </span>
        </div>

        {/* ── LAYER 4: Hero Editorial UI Overlay (Fades out when scrolling) ── */}
        <div
          ref={heroUiRef}
          className="relative z-10 h-full flex flex-col justify-between pt-[100px] pb-10 px-4 sm:px-6 lg:px-8 container max-w-7xl mx-auto transition-transform duration-200"
        >
          {/* Top Header Row */}
          <div className="grid md:grid-cols-12 gap-8 items-start my-auto">
            <div className="md:col-span-7">
              <h1
                ref={headlineRef}
                className="font-heading font-light text-[clamp(44px,6.2vw,86px)] tracking-[-0.045em] leading-[0.98] text-[#FAF7EE] overflow-hidden"
              >
                <span className="hero-line block">Fuel from what’s</span>
                <span className="hero-line block">left over.</span>
              </h1>
            </div>
            <div className="md:col-span-5 md:pt-3">
              <p
                ref={subRef}
                className="text-xs sm:text-[13.5px] text-[#FAF7EE]/85 font-normal leading-[1.6] max-w-sm md:ml-auto"
              >
                Tree-free biomass pellets for boilers, furnaces and dryers. Lab-tested lots, supplied by the truckload.
              </p>
            </div>
          </div>

          {/* Bottom Row: Proof Stats & CTA */}
          <div className="grid grid-cols-12 gap-4 items-end mt-auto">
            {/* Left Proof Stat */}
            <div ref={statsLeftRef} className="col-span-6 sm:col-span-4">
              <p className="font-heading font-light text-5xl sm:text-6xl tracking-tight text-[#FAF7EE]">
                5%
              </p>
              <p className="text-[11px] sm:text-xs text-[#FAF7EE] opacity-75 mt-1 font-normal">
                GST · coal pays 18%
              </p>
            </div>

            {/* Center Pill Badge, CTA & Scroll Indicator */}
            <div
              ref={ctaRef}
              className="col-span-12 sm:col-span-4 order-last sm:order-none flex flex-col items-center justify-center gap-3 pt-3 sm:pt-0"
            >
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-normal tracking-wide text-[#FAF7EE] bg-[#0c4e38]/80 backdrop-blur-md border border-white/10">
                Biomass pellets
              </span>
              <a
                href="#quote"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold bg-[#FAF7EE] text-[#073D2B] hover:bg-white transition-all shadow-md group"
              >
                Get bulk quote
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Scroll prompt cue */}
              <div
                ref={scrollPromptRef}
                className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-[#FAF7EE]/60 uppercase pt-2 animate-bounce"
              >
                <span>Scroll to explore</span>
                <ChevronDown size={12} />
              </div>
            </div>

            {/* Right Proof Stat */}
            <div ref={statsRightRef} className="col-span-6 sm:col-span-4 text-right">
              <p className="font-heading font-light text-5xl sm:text-6xl tracking-tight text-[#FAF7EE]">
                0
              </p>
              <p className="text-[11px] sm:text-xs text-[#FAF7EE] opacity-75 mt-1 font-normal">
                Trees cut. Ever.
              </p>
            </div>
          </div>
        </div>

        {/* ── LAYER 5: Scrollytelling Story Captions (Emerge during scrub) ── */}
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center p-6 sm:p-12">
          {/* Phase 1 Caption */}
          <div
            ref={caption1Ref}
            className="absolute left-6 sm:left-16 bottom-24 sm:bottom-28 max-w-sm p-6 rounded-2xl bg-[#073D2B]/85 backdrop-blur-md border border-white/10 opacity-0 transition-all duration-300 shadow-2xl"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C6A56A] mb-2 font-semibold">
              01 · RAW HARVEST RESIDUE
            </p>
            <h3 className="font-heading text-xl sm:text-2xl font-light text-white mb-2 leading-snug">
              Equilibrium of agricultural residue.
            </h3>
            <p className="text-xs sm:text-[13px] text-[#FAF7EE]/80 leading-relaxed font-normal">
              Field straw, timber shavings, and crop husks collected from rural agricultural catchments across India.
            </p>
          </div>

          {/* Phase 2 Caption */}
          <div
            ref={caption2Ref}
            className="absolute right-6 sm:right-16 top-32 sm:top-40 max-w-sm p-6 rounded-2xl bg-[#073D2B]/85 backdrop-blur-md border border-white/10 opacity-0 transition-all duration-300 shadow-2xl text-right sm:text-left"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C6A56A] mb-2 font-semibold">
              02 · KINETIC DENSIFICATION
            </p>
            <h3 className="font-heading text-xl sm:text-2xl font-light text-white mb-2 leading-snug">
              Centrifugal spiral compression.
            </h3>
            <p className="text-xs sm:text-[13px] text-[#FAF7EE]/80 leading-relaxed font-normal">
              High-pressure mechanical dies crush moisture and extract natural lignins, binding loose residue into continuous fuel ribbons.
            </p>
          </div>

          {/* Phase 3 Caption */}
          <div
            ref={caption3Ref}
            className="absolute left-6 sm:left-16 bottom-24 sm:bottom-28 max-w-sm p-6 rounded-2xl bg-[#073D2B]/85 backdrop-blur-md border border-white/10 opacity-0 transition-all duration-300 shadow-2xl"
          >
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C6A56A] mb-2 font-semibold">
              03 · INDUSTRIAL FUEL PELLET
            </p>
            <h3 className="font-heading text-xl sm:text-2xl font-light text-white mb-2 leading-snug">
              High calorific combustion fuel.
            </h3>
            <p className="text-xs sm:text-[13px] text-[#FAF7EE]/80 leading-relaxed font-normal">
              Standardised 6mm & 8mm cylinders engineered for automated industrial boiler feeds and heavy heat generation.
            </p>
          </div>
        </div>

        {/* ── LAYER 6: Subtle Preload Progress Line (Fades out once ready) ── */}
        {!isInitialReady || loadProgress < 95 ? (
          <div
            className="absolute top-0 inset-x-0 h-[2px] bg-white/10 z-50 pointer-events-none transition-opacity duration-700"
            style={{ opacity: loadProgress >= 100 ? 0 : 0.7 }}
          >
            <div
              className="h-full bg-[#C6A56A] transition-all duration-200"
              style={{ width: `${Math.max(10, loadProgress)}%` }}
            />
          </div>
        ) : null}

        {/* Floating Bottom Right Action Circles */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <a
            href="#products"
            aria-label="Search and browse products"
            className="w-11 h-11 rounded-full bg-[#0a4833]/90 backdrop-blur-xs border border-white/15 text-[#FAF7EE] flex items-center justify-center shadow-lg hover:bg-[#0c573e] transition-colors"
          >
            <Search size={18} />
          </a>
          {tel ? (
            <a
              href={tel}
              aria-label="Call sales"
              className="w-11 h-11 rounded-full bg-[#C6A56A] text-[#073D2B] flex items-center justify-center shadow-lg hover:bg-[#d6b57a] transition-colors"
            >
              <Phone size={18} />
            </a>
          ) : (
            <a
              href="#quote"
              aria-label="Contact sales"
              className="w-11 h-11 rounded-full bg-[#C6A56A] text-[#073D2B] flex items-center justify-center shadow-lg hover:bg-[#d6b57a] transition-colors"
            >
              <Phone size={18} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
