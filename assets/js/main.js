const getAssetUrl = (assetPath) => {
    const mainScript = document.querySelector('script[src*="assets/js/main.js"]');

    if (mainScript && mainScript.src) {
        return new URL(`../${assetPath}`, mainScript.src).href;
    }

    return `/assets/${assetPath}`;
};

const escapeHTML = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const fetchJSON = async (assetPath) => {
    const response = await fetch(getAssetUrl(assetPath));
    if (!response.ok) throw new Error(`${assetPath} request failed: ${response.status}`);
    return response.json();
};

// ============================================
// NAVIGATION
// ============================================
const initializeNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const update = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', update, { passive: true });
    update();
};

const initializeMobileMenu = () => {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    const icon = toggle.querySelector('i');

    const setOpen = (open) => {
        navLinks.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        if (icon) {
            icon.classList.toggle('fa-bars', !open);
            icon.classList.toggle('fa-times', open);
        }
    };
    const isOpen = () => navLinks.classList.contains('active');

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) {
            setOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (isOpen() && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
            setOpen(false);
        }
    });
};

// ============================================
// TIMELINE (homepage)
// ============================================
const createTimelineCard = (year, festival) => {
    const card = document.createElement('article');
    card.className = 'timeline-card';

    const highlights = (festival.highlights || []).map((h) => `
        <div class="highlight-item">
            <h4>${escapeHTML(h.title)}</h4>
            <p>${escapeHTML(h.description)}</p>
        </div>
    `).join('');

    const performers = festival.notable_performers ? `
        <div class="timeline-performers">
            <h4>Notable performers</h4>
            <div class="performer-grid">
                ${festival.notable_performers.map((p) => `
                    <div class="performer-card">
                        <strong>${escapeHTML(p.name)}</strong>
                        <p>${escapeHTML(p.description)}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const sources = festival.sources ? `
        <div class="timeline-sources">
            <h4><i class="fas fa-link" aria-hidden="true"></i> Sources</h4>
            <ul class="timeline-source-list">
                ${festival.sources.map((s) => `
                    <li>
                        <a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                            <span><strong>${escapeHTML(s.publisher)}</strong> - ${escapeHTML(s.title)}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    const note = festival.note ? `
        <div class="timeline-note">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            <strong>Note:</strong> ${escapeHTML(festival.note)}
        </div>
    ` : '';

    card.innerHTML = `
        <div class="timeline-year">${escapeHTML(year)}</div>
        <h3>${escapeHTML(festival.theme)}</h3>
        <p class="timeline-date">${escapeHTML(festival.date)}</p>
        <p>${escapeHTML(festival.description)}</p>
        <div class="timeline-highlights">${highlights}</div>
        ${performers || sources ? `
            <details class="timeline-details">
                <summary>Performers &amp; sources</summary>
                ${performers}
                ${sources}
            </details>
        ` : ''}
        ${note}
    `;
    return card;
};

const initializeTimeline = async () => {
    const container = document.querySelector('.timeline-content');
    if (!container) return;

    showLoading(container);
    try {
        const data = await fetchJSON('data/festival-data.json');
        Object.entries(data.festivals)
            .filter(([, festival]) => festival.timeline_visible !== false)
            .sort(([a], [b]) => Number(b) - Number(a))
            .forEach(([year, festival]) => container.appendChild(createTimelineCard(year, festival)));
    } catch (error) {
        console.error('Error loading timeline:', error);
        container.innerHTML = `
            <div class="timeline-empty">
                <h3>Timeline unavailable</h3>
                <p>The festival history couldn't be loaded. The other pages are still available from the navigation.</p>
            </div>
        `;
    } finally {
        hideLoading(container);
    }
};

// ============================================
// GALLERY LIGHTBOX
// ============================================
const initializeLightbox = () => {
    const items = document.querySelectorAll('.gallery-item');
    if (!items.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Photo viewer');
    lightbox.hidden = true;
    lightbox.innerHTML = `
        <figure class="lightbox-content">
            <button type="button" class="lightbox-close" aria-label="Close">&times;</button>
            <img src="" alt="">
            <figcaption class="lightbox-caption"></figcaption>
        </figure>
    `;
    document.body.appendChild(lightbox);

    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    let opener = null;

    const close = () => {
        lightbox.hidden = true;
        document.body.style.overflow = '';
        if (opener) opener.focus();
    };

    items.forEach((item) => {
        const trigger = item.querySelector('.gallery-open') || item;
        trigger.addEventListener('click', () => {
            const source = item.querySelector('img');
            const text = item.querySelector('.gallery-caption');
            img.src = source.src;
            img.alt = source.alt;
            caption.textContent = text ? text.textContent : '';
            opener = trigger;
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        });
    });

    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.hidden) close();
    });
};

// ============================================
// LOADING INDICATOR
// ============================================
const showLoading = (container) => {
    if (container.querySelector('.loading-spinner')) return;
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '<div class="spinner-circle"></div><p>Loading&hellip;</p>';
    container.appendChild(spinner);
};

const hideLoading = (container) => {
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) spinner.remove();
};

// ============================================
// PROGRAM PAGE
// ============================================
const readPref = (key, fallback) => {
    try {
        return localStorage.getItem(key) || fallback;
    } catch {
        return fallback;
    }
};

const writePref = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Storage unavailable (private mode); the preference just won't persist.
    }
};

// "Saturday · November 1, 2025 — Poetry Program" -> "Saturday: Poetry Program"
const dayTabLabel = (name) => {
    const weekday = name.split('·')[0].trim();
    const variant = name.split('—')[1];
    return variant ? `${weekday}: ${variant.trim()}` : weekday;
};

const initializeProgramPage = async () => {
    const container = document.getElementById('program-schedule-container');
    if (!container) return;

    const searchInput = document.getElementById('program-search');
    const clearBtn = document.getElementById('program-clear');
    const countEl = document.getElementById('program-count');
    const timeToggleBtn = document.getElementById('time-toggle');
    const tzToggleBtn = document.getElementById('tz-toggle');
    const tzIndicator = document.getElementById('local-time-indicator');
    const stagePills = document.querySelectorAll('.stage-pill');
    const programNav = document.querySelector('.program-nav');

    let programData = null;
    let stageNames = {};
    let activeDay = '';
    let searchQuery = '';
    const activeStages = new Set([...stagePills].map((pill) => pill.dataset.stage));
    let timeFormat = readPref('tf_time_format', '24');
    let tzPref = readPref('tf_tz_pref', 'local');

    const updateToggleLabels = () => {
        if (timeToggleBtn) timeToggleBtn.textContent = timeFormat === '24' ? 'Switch to 12h' : 'Switch to 24h';
        if (tzToggleBtn) tzToggleBtn.textContent = tzPref === 'local' ? 'Use camp time' : 'Use local time';
        if (tzIndicator) tzIndicator.textContent = tzPref === 'local' ? 'Showing your local time' : 'Showing camp time (CAT, UTC+2)';
    };

    // Times in the data are camp time (CAT, UTC+2). Acts before 06:00 run past midnight.
    const parseTimeRange = (dateStr, timeStr) => {
        const [startPart, endPart] = timeStr.split('–').map((part) => part && part.trim());

        const toDate = (hm) => {
            let day = dateStr;
            if (parseInt(hm, 10) < 6) {
                const next = new Date(`${dateStr}T12:00:00+02:00`);
                next.setUTCDate(next.getUTCDate() + 1);
                day = next.toISOString().slice(0, 10);
            }
            return new Date(`${day}T${hm}:00+02:00`);
        };

        const start = toDate(startPart);
        const end = endPart ? toDate(endPart) : new Date(start.getTime() + 30 * 60 * 1000);
        return { start, end };
    };

    const formatClock = (date) => {
        const opts = timeFormat === '12'
            ? { hour: 'numeric', minute: '2-digit', hour12: true }
            : { hour: '2-digit', minute: '2-digit', hour12: false };
        if (tzPref === 'blantyre') opts.timeZone = 'Africa/Blantyre';
        return date.toLocaleTimeString([], opts);
    };

    const highlight = (text) => {
        if (!searchQuery) return escapeHTML(text);
        const idx = text.toLowerCase().indexOf(searchQuery);
        if (idx < 0) return escapeHTML(text);
        return escapeHTML(text.slice(0, idx))
            + `<mark class="match">${escapeHTML(text.slice(idx, idx + searchQuery.length))}</mark>`
            + escapeHTML(text.slice(idx + searchQuery.length));
    };

    const renderSchedule = () => {
        if (!programData || !activeDay) return;

        const dayData = programData[activeDay];
        let matchCount = 0;
        let totalCount = 0;

        const grid = document.createElement('div');
        grid.className = 'program-grid';

        Object.entries(dayData.stages).forEach(([stageId, acts]) => {
            totalCount += acts.length;
            if (!activeStages.has(stageId)) return;

            const filteredActs = searchQuery
                ? acts.filter((act) => act.act.toLowerCase().includes(searchQuery))
                : acts;
            if (!filteredActs.length) return;
            matchCount += filteredActs.length;

            const stageCard = document.createElement('section');
            stageCard.className = 'stage-section';
            stageCard.innerHTML = `<h3 class="stage-title">${escapeHTML(stageNames[stageId] || stageId)}</h3>`;

            const list = document.createElement('ul');
            list.className = 'performance-list';

            filteredActs.forEach((act) => {
                const times = parseTimeRange(dayData.date, act.time);
                const item = document.createElement('li');
                item.className = 'performance-item';
                item.innerHTML = `
                    <div class="performance-details">
                        <span class="time">${formatClock(times.start)} – ${formatClock(times.end)}</span>
                        <span class="artist">${highlight(act.act)}</span>
                    </div>
                `;

                const calBtn = document.createElement('button');
                calBtn.type = 'button';
                calBtn.className = 'ics-download-btn';
                calBtn.title = 'Add to calendar';
                calBtn.setAttribute('aria-label', `Add ${act.act} to calendar`);
                calBtn.innerHTML = '<i class="far fa-calendar-plus" aria-hidden="true"></i>';
                calBtn.addEventListener('click', () => {
                    downloadCalendarEvent(act.act, times.start, times.end, stageNames[stageId] || stageId);
                });
                item.appendChild(calBtn);
                list.appendChild(item);
            });

            stageCard.appendChild(list);
            grid.appendChild(stageCard);
        });

        container.innerHTML = '';
        if (matchCount === 0) {
            container.innerHTML = `
                <div class="program-empty">
                    <i class="fas fa-search" aria-hidden="true"></i>
                    <p>${searchQuery
                        ? `No acts match &ldquo;${escapeHTML(searchQuery)}&rdquo; on this day.`
                        : 'No stages selected.'}</p>
                </div>
            `;
        } else {
            container.appendChild(grid);
        }

        if (countEl) countEl.textContent = searchQuery ? `${matchCount} of ${totalCount} acts` : '';
    };

    updateToggleLabels();

    try {
        const json = await fetchJSON('data/program-schedule.json');
        programData = json.program;
        stageNames = Object.fromEntries((json.stages || []).map((stage) => [stage.id, stage.name]));

        if (programNav) {
            programNav.innerHTML = '';
            Object.entries(programData).forEach(([dayKey, dayVal], idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'program-nav-btn';
                btn.textContent = dayTabLabel(dayVal.name);
                btn.setAttribute('aria-pressed', String(idx === 0));
                if (idx === 0) {
                    btn.classList.add('active');
                    activeDay = dayKey;
                }

                btn.addEventListener('click', () => {
                    programNav.querySelectorAll('.program-nav-btn').forEach((b) => {
                        b.classList.toggle('active', b === btn);
                        b.setAttribute('aria-pressed', String(b === btn));
                    });
                    activeDay = dayKey;
                    renderSchedule();
                });
                programNav.appendChild(btn);
            });
        }

        renderSchedule();
    } catch (error) {
        console.error('Error loading program:', error);
        container.innerHTML = `
            <div class="program-empty">
                <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                <p>The program couldn't be loaded. Please try again later.</p>
            </div>
        `;
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            renderSchedule();
        });
    }

    if (clearBtn && searchInput) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            renderSchedule();
            searchInput.focus();
        });
    }

    if (timeToggleBtn) {
        timeToggleBtn.addEventListener('click', () => {
            timeFormat = timeFormat === '24' ? '12' : '24';
            writePref('tf_time_format', timeFormat);
            updateToggleLabels();
            renderSchedule();
        });
    }

    if (tzToggleBtn) {
        tzToggleBtn.addEventListener('click', () => {
            tzPref = tzPref === 'local' ? 'blantyre' : 'local';
            writePref('tf_tz_pref', tzPref);
            updateToggleLabels();
            renderSchedule();
        });
    }

    stagePills.forEach((pill) => {
        pill.addEventListener('click', () => {
            const stage = pill.dataset.stage;
            const nowActive = !activeStages.has(stage);
            if (nowActive) activeStages.add(stage);
            else activeStages.delete(stage);
            pill.classList.toggle('active', nowActive);
            pill.setAttribute('aria-pressed', String(nowActive));
            renderSchedule();
        });
    });
};

// ============================================
// CALENDAR DOWNLOAD (ICS)
// ============================================
const toICSDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// RFC 5545 text escaping
const icsText = (value) => String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');

const downloadCalendarEvent = (actName, startDate, endDate, stageName) => {
    const slug = actName.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Dzaleka//Tumaini Festival Archive//EN',
        'BEGIN:VEVENT',
        `UID:${slug}-${startDate.getTime()}@tumaini-festival.dzaleka.com`,
        `DTSTAMP:${toICSDate(new Date())}`,
        `DTSTART:${toICSDate(startDate)}`,
        `DTEND:${toICSDate(endDate)}`,
        `SUMMARY:${icsText(`Tumaini Festival: ${actName}`)}`,
        `DESCRIPTION:${icsText(`Stage: ${stageName}`)}`,
        `LOCATION:${icsText('Dzaleka Refugee Camp, Dowa, Malawi')}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${slug}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 2000);
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeNavbarScroll();
    initializeMobileMenu();
    initializeLightbox();
    initializeTimeline();
    initializeProgramPage();
});
