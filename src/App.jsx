// Initialize GSAP globally before any components mount
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Global GSAP defaults - reveal once and keep visible (prevents disappearing content on scroll)
gsap.defaults({ ease: 'power2.out', duration: 0.8 });
ScrollTrigger.defaults({ toggleActions: 'play none none none', start: 'top 85%' });

// Respect prefers-reduced-motion
const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
if (mq.matches) {
  gsap.globalTimeline.timeScale(50); // Instant — no motion
}

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Hero from './sections/Hero.jsx';
import WhySwitch from './sections/WhySwitch.jsx';
import Products from './sections/Products.jsx';
import Manufacturing from './sections/Manufacturing.jsx';
import Industries from './sections/Industries.jsx';
import Calculator from './sections/Calculator.jsx';
import Quality from './sections/Quality.jsx';
import HowToBuy from './sections/HowToBuy.jsx';
import About from './sections/About.jsx';
import FAQ from './sections/FAQ.jsx';
import Blog from './sections/Blog.jsx';
import QuoteForm from './sections/QuoteForm.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#1D2C20] antialiased selection:bg-[#C6A56A] selection:text-[#073D2B]">
      <Navbar />
      <main>
        <Hero />
        <WhySwitch />
        <Products />
        <Manufacturing />
        <Industries />
        <Calculator />
        <Quality />
        <HowToBuy />
        <About />
        <FAQ />
        <Blog />
        <QuoteForm />
      </main>
      <Footer />
    </div>
  );
}
