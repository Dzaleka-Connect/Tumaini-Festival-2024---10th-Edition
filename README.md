# Tumaini Festival Legacy Record

Celebrating the legacy of the **Tumaini Festival** at Dzaleka Refugee Camp, Malawi—the world's first and only refugee camp-based arts and culture festival, uniting refugees, host communities, and international visitors since 2014.

This website is a compiled independent historical archive managed by **Dzaleka Digital Heritage**. It serves to document and celebrate the festival's themes, performing arts, media visibility, and social milestones.

---

## Project Overview

Founded by Menes La Plume, the Tumaini Festival is Malawi's largest multicultural celebration. This interactive digital archive compiles its rich history, offering visitors access to interactive timelines, a dynamic program database, a media archive, and safe community tourism guidelines.

### Historical Impact
- **$150,000+ Annual Revenue:** Generates vital commercial income inside the camp community.
- **2,335 Entrepreneurs Supported:** Opens direct market access for refugee-owned businesses.
- **1,500 Seasonal Jobs:** Creates local jobs in stagecraft, building, catering, and security.
- **2,000+ Homestay Beneficiaries:** Provides decentralized income to over 400 refugee host families.
- **230,000+ Patrons:** Welcomed regional and global visitors inside Dzaleka camp since 2014.
- **61M+ Media Reach:** Counters negative narratives by sharing stories of refugee resilience.
- **Coexistence:** Promotes inter-cultural harmony between refugees and Malawian hosts.

---

## Features

- **Interactive Timeline:** A comprehensive history detailing themes, highlights, performers, and verified sources for all editions (including the 10th anniversary in 2025).
- **Dynamic Program Database:** A fully searchable schedule interface with day-by-day filter controls, active search queries, and a live "Now & Next" performance tracker.
- **Media Coverage Hub:** Curated video highlights, articles, and coverage links documenting the festival's global visibility.
- **Photo Gallery:** Resilient neobrutalist grid layouts with full-screen lightbox overlays for immersive photo browsing.
- **Visitor Guide:** Comprehensive travel guidelines, transit directions, and direct booking coordination for the **Dzaleka Homestay Program**.
- **Visit Dzaleka CTA:** Direct promotion of the official [Visit Dzaleka](https://visit.dzaleka.com/) tourism portal.
- **PWA Capabilities:** Offline access enabled via a persistent service worker cache.
- **Neobrutalist UI Design:** High-contrast design tokens, thick flat borders, and straight alignments designed for high accessibility (A11y) and responsiveness.

---

## Project Structure

```
Tumaini-Festival-2024---10th-Edition/
├── assets/
│   ├── css/
│   │   └── style.css          # Neobrutalist design system (colors, layout, variables)
│   ├── js/
│   │   └── main.js           # Core JS (timeline rendering, schedule query engine, lightbox)
│   ├── data/
│   │   └── festival-data.json # Central JSON repository containing all schedules and timeline entries
│   └── images/                # Brand SVGs, icons, and static images
├── components/
│   └── social-links.html      # Shared component for footer social links
├── pages/
│   ├── about.html             # History, impact stats, and cultural bridge mission
│   ├── gallery.html           # Neobrutalist photo gallery grid with lightbox hooks
│   ├── impact.html            # Verified economic statistics and homestay program details
│   ├── media-coverage.html    # Media grid of news articles, reports, and videos
│   ├── program.html           # Searchable program schedule database and interactive filters
│   └── visitor-info.html      # Travel permit alerts, transit guides, and homestay info
├── index.html                 # Homepage (Hero, statistics highlights, sitemap entry point)
├── package.json               # NPM scripts for local development
├── robots.txt                 # Search engine bot instructions
├── sitemap.xml                # SEO URL sitemap
└── sw.js                      # Service Worker script for offline asset caching
```

---

## Development Setup

The project is built entirely on standard, modern web technologies (HTML5, Vanilla CSS, and Client-Side Javascript) served by a lightweight local web server. No heavy build pipelines or compilation steps are required.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
- A modern web browser with PWA/Service Worker support

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dzaleka-Connect/Tumaini-Festival-2024---10th-Edition.git
   cd Tumaini-Festival-2024---10th-Edition
   ```
2. Install the lightweight development server:
   ```bash
   npm install
   ```

### Running Locally
To launch a hot-reloading development server locally:
- **Using NPM / Node.js (Recommended):**
  ```bash
  npm run dev
  ```
  This runs `npx http-server` serving the files on `http://localhost:8080`.
  
- **Using Python (Fallback):**
  ```bash
  python3 -m http.server 8080
  ```
  Open `http://localhost:8080` in your browser.

---

## Ownership & Attribution

This website is maintained and published as a compiled archive by **Dzaleka Digital Heritage** (https://services.dzaleka.com/). It is an independent historical record distinct from the official festival organization.

The official festival operations, administration, and contact channels are managed by **Tumaini Letu**. For official inquiries, partnerships, and coordination, please contact:
- **Official Site:** [https://tumainiletu.org](https://tumainiletu.org)
- **Official Contact Form:** [https://tumainiletu.org/contact-us/](https://tumainiletu.org/contact-us/)
- **Official Email:** [info@tumainiletu.org](mailto:info@tumainiletu.org)

---

## License

This project is licensed under the [MIT License](LICENSE)—see the LICENSE file for details.
