# Pushpavana Green Energy — Cinematic Landing Page & Scrollytelling Experience

A high-performance, portfolio-grade scrollytelling web application built for **Pushpavana Green Energy**, showcasing India's tree-free industrial biomass fuel pellets.

🌐 **Live Demo:** [https://pushpavana-site.vercel.app/](https://pushpavana-site.vercel.app/)  
📦 **Repository:** [https://github.com/si980/pushpavana-site](https://github.com/si980/pushpavana-site)

---

## ✨ Features

- **Cinematic Canvas Image Sequence (287 Frames):**
  - Continuous biomass densification sequence scrubbed in real-time on a single High-DPI HTML5 canvas.
  - Natural video pacing (~42fps / 6.8s) calibrated to replicate live physical transformation footage.
  - Zero distortion with dynamic retina aspect-ratio cover scaling.

- **Seamless Video-to-Canvas Crossfade:**
  - Starts with an idle looping HTML5 video background.
  - Crossfades smoothly into the interactive canvas sequence upon scroll with zero flicker or blank frames.

- **Gesture-Driven Hero Auto-Scroll:**
  - Slight downward wheel or swipe gesture triggers smooth cinematic progression to the final frame.
  - Settles accurately at Frame 287 before cleanly releasing into the subsequent sections.
  - Upward gesture smoothly reverses the sequence back to the initial video state.

- **Piecewise Scrollytelling Caption Windows:**
  - **Phase 1 (Raw Harvest Residue):** Sustained reading window from 18% to 36% progress.
  - **Phase 2 (Molecular Centrifugal Spiral):** Sustained reading window from 48% to 66% progress.
  - **Phase 3 (Industrial Fuel Pellet):** Holds through settlement onto Frame 287.

- **Infinite Lateral Process Flow:**
  - Continuous marquee manufacturing ribbon with native pause-on-hover / pause-on-touch.

- **Full Section Suite:**
  - Why Switch (Comparative cost & sustainability analysis)
  - Products (Standardized 6mm & 8mm industrial pellet specifications)
  - Manufacturing Process (Field residue collection to pellet dispatch)
  - Industries Served (Boilers, furnaces, textile, food processing)
  - Financial & Carbon Calculator
  - Quality Standards & Testing
  - Bulk Quote Request Form & Interactive FAQ

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Bundler:** Vite 5
- **Styling:** Tailwind CSS + Custom Design Tokens
- **Animation & Scrollytelling:** GSAP 3 (ScrollTrigger, ScrollToPlugin)
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/si980/pushpavana-site.git

# Navigate into project directory
cd pushpavana-site

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be live at `http://localhost:5173/`.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

Proprietary — Developed for Pushpavana Green Energy.
