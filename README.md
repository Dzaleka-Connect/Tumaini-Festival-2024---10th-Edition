# Tumaini Festival Legacy Record

An independent record of **Tumaini Festival**, the refugee-led arts and culture festival held inside Dzaleka Refugee Camp, Malawi, since 2014. Maintained by **Dzaleka Digital Heritage**.

Live site: https://tumaini-festival.dzaleka.com/

---

## Pages

| Page | What it has |
| --- | --- |
| `index.html` | Overview, headline figures, year-by-year timeline, press highlights |
| `pages/about.html` | Festival origins, founder, program overview |
| `pages/program.html` | 2025 program: search, day tabs, stage filters, 12h/24h and time-zone toggles, add-to-calendar (.ics) |
| `pages/media-coverage.html` | Press and video coverage |
| `pages/gallery.html` | Photo grid with a lightbox |
| `pages/visitor-info.html` | Access and media permits, homestays, travel, FAQ |
| `pages/impact.html` | Economic and social impact figures |

Impact figures are as reported by the organizer, Tumaini Letu.

---

## Project structure

```
├── assets/
│   ├── css/style.css               # All styles (design tokens at the top)
│   ├── js/main.js                  # Nav, timeline, program page, lightbox
│   ├── data/festival-data.json     # Timeline entries, one per edition
│   ├── data/program-schedule.json  # 2025 program by day and stage
│   └── images/                     # Logos and patterns
├── pages/                          # Inner pages
├── index.html                      # Homepage
├── sw.js                           # Service worker (offline cache)
├── sitemap.xml
└── robots.txt
```

To add a festival year, add an entry to `festivals` in `assets/data/festival-data.json`. To update the program, edit `assets/data/program-schedule.json`. Bump `CACHE_NAME` in `sw.js` when you change cached files.

---

## Running locally

Plain HTML, CSS, and JavaScript. There's no build step and nothing to install. The pages load JSON with `fetch`, so serve the folder over HTTP rather than opening files directly:

```bash
npm run dev                   # npx http-server on http://localhost:8080
# or
python3 -m http.server 8080
```

---

## Ownership & Attribution

This website is maintained and published as a compiled archive by **Dzaleka Digital Heritage** (https://services.dzaleka.com/). It is an independent historical record distinct from the official festival organization.

The official festival operations, administration, and contact channels are managed by **Tumaini Letu**. For official inquiries, partnerships, and coordination, please contact:
- **Official Site:** [https://tumainiletu.org](https://tumainiletu.org)
- **Official Contact Form:** [https://tumainiletu.org/contact-us/](https://tumainiletu.org/contact-us/)
- **Official Email:** [info@tumainiletu.org](mailto:info@tumainiletu.org)

---

## License

`package.json` declares MIT, but the repository doesn't include a LICENSE file yet.
