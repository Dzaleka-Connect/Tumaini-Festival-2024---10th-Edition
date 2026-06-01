const getAssetUrl = (assetPath) => {
    const mainScript = document.querySelector('script[src*="assets/js/main.js"]');

    if (mainScript && mainScript.src) {
        return new URL(`../${assetPath}`, mainScript.src).href;
    }

    return `/assets/${assetPath}`;
};

// Initialize dynamic content loading
const loadFestivalData = async () => {
    try {
        const response = await fetch(getAssetUrl('data/festival-data.json'));
        if (!response.ok) throw new Error(`Festival data request failed: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading festival data:', error);
        return null;
    }
};

// Timeline Navigation
const initializeTimeline = async () => {
    const timelineContent = document.querySelector('.timeline-content');
    
    if (timelineContent) {
        showLoading(timelineContent);
        
        try {
            const data = await loadFestivalData();
            
            if (data && data.festivals) {
                Object.entries(data.festivals)
                    .filter(([, festival]) => festival.timeline_visible !== false)
                    .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
                    .forEach(([year, festival]) => {
                    const timelineCard = createTimelineCard(year, festival);
                    timelineContent.appendChild(timelineCard);
                });
            } else {
                showTimelineFallback(timelineContent);
            }
        } catch (error) {
            console.error('Error initializing timeline:', error);
            showTimelineFallback(timelineContent);
        } finally {
            hideLoading(timelineContent);
        }
    }
};

const showTimelineFallback = (timelineContent) => {
    if (!timelineContent) return;

    timelineContent.innerHTML = `
        <div class="timeline-empty">
            <h3>Timeline temporarily unavailable</h3>
            <p>The festival history data could not be loaded in this view. The archive pages and program record are still available from the navigation.</p>
        </div>
    `;
};

// Create timeline cards
const createTimelineCard = (year, festival) => {
    const card = document.createElement('div');
    card.className = 'timeline-card fade-up';

    const notablePerformersHTML = festival.notable_performers ? `
        <div class="timeline-performers">
            <h4>Notable Performers</h4>
            <div class="performer-grid">
                ${festival.notable_performers.map(performer => `
                    <div class="performer-card">
                        <strong>${performer.name}</strong>
                        <p>${performer.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const sourcesHTML = festival.sources ? `
        <div class="timeline-sources">
            <h4>
                <i class="fas fa-link" aria-hidden="true"></i> Sources
            </h4>
            <ul class="timeline-source-list">
                ${festival.sources.map(source => `
                    <li>
                        <a href="${source.url}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                            <span>
                                <strong>${source.publisher}</strong> - ${source.title}
                            </span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    const noteHTML = festival.note ? `
        <div class="timeline-note">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            <strong>Note:</strong> ${festival.note}
        </div>
    ` : '';

    card.innerHTML = `
        <div class="timeline-year">${year}</div>
        <h3>${festival.theme}</h3>
        <p class="timeline-date">${festival.date}</p>
        <p>${festival.description}</p>
        <div class="timeline-highlights">
            ${festival.highlights.map(highlight => `
                <div class="highlight-item">
                    <h4>${highlight.title}</h4>
                    <p>${highlight.description}</p>
                </div>
            `).join('')}
        </div>
        ${notablePerformersHTML}
        ${sourcesHTML}
        ${noteHTML}
    `;
    return card;
};

// Gallery Lightbox
class GalleryLightbox {
    constructor() {
        this.initializeLightbox();
        this.bindEvents();
    }

    initializeLightbox() {
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'lightbox';
        this.lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <img src="" alt="Gallery image">
                <div class="lightbox-caption"></div>
                <button class="lightbox-prev">&lt;</button>
                <button class="lightbox-next">&gt;</button>
            </div>
        `;
        document.body.appendChild(this.lightbox);
    }

    bindEvents() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => this.openLightbox(item));
        });

        this.lightbox.querySelector('.lightbox-close').addEventListener('click', 
            () => this.closeLightbox());
    }

    openLightbox(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        
        this.lightbox.querySelector('img').src = img.src;
        this.lightbox.querySelector('.lightbox-caption').textContent = 
            caption ? caption.textContent : '';
        
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Mobile Menu Handler
const initializeMobileMenu = () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        // Track menu state
        let isMenuOpen = false;
        
        // Toggle menu function
        const toggleMenu = () => {
            isMenuOpen = !isMenuOpen;
            navLinks.classList.toggle('active', isMenuOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isMenuOpen);
            
            const toggleIcon = mobileMenuToggle.querySelector('i');
            if (toggleIcon) {
                if (isMenuOpen) {
                    toggleIcon.classList.remove('fa-bars');
                    toggleIcon.classList.add('fa-times');
                } else {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            }
            
            // Focus trap when menu is open
            if (isMenuOpen) {
                // Get all focusable elements in nav
                const focusableElements = navLinks.querySelectorAll('a, button');
                if (focusableElements.length > 0) {
                    // Focus the first element after opening
                    setTimeout(() => {
                        focusableElements[0].focus();
                    }, 100);
                }
            }
        };
        
        // Click event
        mobileMenuToggle.addEventListener('click', toggleMenu);
        
        // Keyboard events for accessibility
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
        
        // Close menu when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
                mobileMenuToggle.focus(); // Return focus to toggle button
            }
        });
        
        // Handle clicks outside the menu to close it
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navLinks.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                toggleMenu();
            }
        });
    }
};

// Newsletter Form - Handled inline in index.html with Formspree
// No additional JavaScript needed as the form submission is managed by Formspree

// Initialize all components
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Core functionality
        handleNavbarScroll();
        initializeMobileMenu();
        initializeSmoothScroll();

        // Initialize timeline with festival data
        await initializeTimeline();

        // Initialize dynamic program archive page if present in DOM
        if (document.getElementById('program-schedule-container')) {
            await initializeProgramPage();
        }

        // Initialize Gallery Lightbox if gallery items exist in DOM
        if (document.querySelector('.gallery-item')) {
            new GalleryLightbox();
        }

        // Initialize animations if needed
        if (typeof initializeAnimations === 'function') {
            initializeAnimations();
        }
    } catch (error) {
        console.error('Error initializing components:', error);
    }
});

// Intersection Observer for animations
const initializeAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-up, .stat-item, .media-card, .timeline-card').forEach((el) => {
        observer.observe(el);
    });
};

// Navbar scroll behavior
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 50;
    if (scrolled) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Initialize navbar scroll behavior
window.addEventListener('scroll', handleNavbarScroll);
handleNavbarScroll(); // Call once on load to set initial state

// Smooth Scroll for Anchor Links
const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.body.classList.add('page-hidden');
    } else {
        document.body.classList.remove('page-hidden');
    }
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}



// Pagination
const initializePagination = () => {
    const paginationContainer = document.querySelector('.pagination');
    // Guard clause - return early if pagination elements don't exist
    if (!paginationContainer) {
        return;
    }

    const prevButton = document.querySelector('.pagination-prev');
    const nextButton = document.querySelector('.pagination-next');
    const pageButtons = document.querySelectorAll('.pagination-page');
    
    if (!prevButton || !nextButton || !pageButtons.length) {
        return;
    }

    let currentPage = 1;
    const totalPages = pageButtons.length;

    const updatePaginationButtons = () => {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        pageButtons.forEach((button, index) => {
            button.classList.toggle('active', index + 1 === currentPage);
        });
    };

    prevButton?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePaginationButtons();
        }
    });

    nextButton?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePaginationButtons();
        }
    });

    pageButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            currentPage = index + 1;
            updatePaginationButtons();
        });
    });

    // Initialize button states
    updatePaginationButtons();
};

// Program Navigation
const initializeProgramNavigation = () => {
    const programNav = document.querySelector('.program-nav');
    const programDays = document.querySelectorAll('.program-day');

    if (!programNav) return;

    programNav.addEventListener('click', (e) => {
        const button = e.target.closest('.program-nav-btn');
        if (!button) return;

        // Remove active class from all buttons and days
        document.querySelectorAll('.program-nav-btn').forEach(btn => 
            btn.classList.remove('active'));
        programDays.forEach(day => day.classList.remove('active'));

        // Add active class to clicked button and corresponding day
        button.classList.add('active');
        const dayId = button.dataset.day;
        document.getElementById(dayId)?.classList.add('active');
    });
};

// Loading indicator functions
const showLoading = (container) => {
    if (!container) return;
    
    // Create loading spinner if it doesn't exist
    if (!container.querySelector('.loading-spinner')) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner-circle"></div><p>Loading...</p>';
        container.appendChild(spinner);
    }
    
    // Show the spinner
    const spinner = container.querySelector('.loading-spinner');
    spinner.style.display = 'flex';
};

const hideLoading = (container) => {
    if (!container) return;
    
    // Hide the spinner if it exists
    const spinner = container.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
};

// ============================================
// DYNAMIC PROGRAM ARCHIVE RENDERER
// ============================================
const initializeProgramPage = async () => {
    const container = document.getElementById('program-schedule-container');
    const searchInput = document.getElementById('program-search');
    const clearBtn = document.getElementById('program-clear');
    const countEl = document.getElementById('program-count');
    const timeToggleBtn = document.getElementById('time-toggle');
    const tzToggleBtn = document.getElementById('tz-toggle');
    const tzIndicator = document.getElementById('local-time-indicator');
    const stagePills = document.querySelectorAll('.stage-pill');
    const programNav = document.querySelector('.program-nav');

    if (!container) return;

    // State Variables
    let programData = null;
    let activeDay = ''; // e.g. 'thursday', 'friday'
    let searchQuery = '';
    let activeStages = new Set(['elikiva', 'khizera', 'cultural', 'theater', 'workshops', 'poetry']);
    let timeFormat = localStorage.getItem('tf_time_format') || '24';
    let tzPref = localStorage.getItem('tf_tz_pref') || 'local';

    // Set Initial Text for Toggles
    if (timeToggleBtn) timeToggleBtn.textContent = timeFormat === '24' ? 'Switch to 12h' : 'Switch to 24h';
    if (tzToggleBtn) tzToggleBtn.textContent = tzPref === 'local' ? 'Use Africa/Blantyre' : 'Use Local Time';
    if (tzIndicator) tzIndicator.textContent = tzPref === 'local' ? `(showing browser local time)` : `(showing Camp time, CAT/UTC+2)`;

    // Fetch Program Schedule JSON
    try {
        const response = await fetch(getAssetUrl('data/program-schedule.json'));
        if (!response.ok) throw new Error('Failed to load schedule data');
        const json = await response.json();
        programData = json.program;

        // Extract and render day tabs
        if (programNav && programData) {
            programNav.innerHTML = '';
            Object.entries(programData).forEach(([dayKey, dayVal], idx) => {
                const btn = document.createElement('button');
                btn.className = `program-nav-btn ${idx === 0 ? 'active' : ''}`;
                btn.textContent = dayVal.name.split('·')[0].trim(); // Get Thursday/Friday/Saturday
                btn.dataset.day = dayKey;
                
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.program-nav-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeDay = dayKey;
                    renderSchedule();
                });
                programNav.appendChild(btn);

                if (idx === 0) activeDay = dayKey;
            });
        }

        renderSchedule();
    } catch (error) {
        console.error('Error rendering program page:', error);
        container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #ff0000; font-weight: 600;"><i class="fas fa-exclamation-triangle"></i> Error loading program schedule. Please try again later.</div>`;
    }

    // Helper: Parse HH:MM range to local/target Date objects
    const parseTimeRange = (dateStr, timeStr) => {
        const parts = timeStr.split('–');
        const startPart = parts[0].trim();
        const endPart = parts[1] ? parts[1].trim() : null;

        // Camp Time is CAT (UTC+02:00)
        const toDate = (hm) => {
            const h = parseInt(hm.split(':')[0], 10);
            let d = dateStr;
            // Rollover support for late night acts after midnight
            if (h < 6) {
                const dt = new Date(dateStr + 'T12:00:00+02:00');
                dt.setDate(dt.getDate() + 1);
                d = dt.toISOString().slice(0, 10);
            }
            return new Date(`${d}T${hm}:00+02:00`);
        };

        const startDate = toDate(startPart);
        const endDate = endPart ? toDate(endPart) : new Date(startDate.getTime() + 30 * 60 * 1000);
        return { start: startDate, end: endDate };
    };

    // Helper: Format Date object to string based on format & timezone preference
    const formatClock = (d) => {
        const opts = timeFormat === '12' 
            ? { hour: 'numeric', minute: '2-digit', hour12: true } 
            : { hour: '2-digit', minute: '2-digit', hour12: false };
        
        if (tzPref === 'blantyre') {
            opts.timeZone = 'Africa/Blantyre';
        }
        return d.toLocaleTimeString([], opts);
    };

    // Render Function
    const renderSchedule = () => {
        if (!programData || !activeDay) return;
        
        container.innerHTML = '';
        const dayData = programData[activeDay];
        const dateStr = dayData.date;
        let matchCount = 0;
        let totalCount = 0;

        // Render layout grid
        const grid = document.createElement('div');
        grid.className = 'program-grid';

        // Iterate stages
        Object.entries(dayData.stages).forEach(([stageId, acts]) => {
            totalCount += acts.length;

            // Check if stage is active
            if (!activeStages.has(stageId)) return;

            // Filter acts by search query
            const filteredActs = acts.filter(act => {
                if (!searchQuery) return true;
                return act.act.toLowerCase().includes(searchQuery);
            });

            if (filteredActs.length === 0) return;
            matchCount += filteredActs.length;

            // Stage Card
            const stageCard = document.createElement('div');
            stageCard.className = 'stage-section';
            stageCard.innerHTML = `<h3 class="stage-title">${stageId.charAt(0).toUpperCase() + stageId.slice(1)} Stage</h3>`;

            const list = document.createElement('div');
            list.className = 'performance-list';

            filteredActs.forEach(act => {
                const times = parseTimeRange(dateStr, act.time);
                const displayTime = `${formatClock(times.start)} – ${formatClock(times.end)}`;
                
                // Highlight matches in artist name
                let artistHTML = act.act;
                if (searchQuery) {
                    const idx = act.act.toLowerCase().indexOf(searchQuery);
                    if (idx >= 0) {
                        artistHTML = act.act.substring(0, idx) + 
                                     `<mark class="match">${act.act.substring(idx, idx + searchQuery.length)}</mark>` + 
                                     act.act.substring(idx + searchQuery.length);
                    }
                }

                const item = document.createElement('div');
                item.className = 'performance-item';

                item.innerHTML = `
                    <div style="flex: 1;">
                        <span class="time">${displayTime}</span>
                        <div class="performance-details" style="margin-top: 0.25rem;">
                            <span class="artist" style="font-size: 1.1rem; font-weight: 600;">${artistHTML}</span>
                        </div>
                    </div>
                `;

                // Add to calendar button
                const calBtn = document.createElement('button');
                calBtn.className = 'ics-download-btn';
                calBtn.title = 'Add to Calendar';
                calBtn.innerHTML = '<i class="far fa-calendar-plus"></i>';
                calBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadCalendarEvent(act.act, times.start, times.end, stageId);
                });
                item.appendChild(calBtn);

                list.appendChild(item);
            });

            stageCard.appendChild(list);
            grid.appendChild(stageCard);
        });

        container.appendChild(grid);

        // Update matches count label
        if (countEl) {
            if (searchQuery) {
                countEl.textContent = `${matchCount} of ${totalCount} acts matched`;
            } else {
                countEl.textContent = '';
            }
        }

        // Show empty state if no matches
        if (matchCount === 0 && searchQuery) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 0; color: var(--muted-color);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1.5rem; opacity: 0.5;"></i>
                    <p style="font-size: 1.1rem; font-weight: 500;">No performers match "${searchQuery}" on this day.</p>
                </div>
            `;
        }
    };

    // Live Search Listeners
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value.trim().toLowerCase();
            renderSchedule();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                renderSchedule();
            }
        });
    }

    // Toggle Preferences Listeners
    if (timeToggleBtn) {
        timeToggleBtn.addEventListener('click', () => {
            timeFormat = timeFormat === '24' ? '12' : '24';
            localStorage.setItem('tf_time_format', timeFormat);
            timeToggleBtn.textContent = timeFormat === '24' ? 'Switch to 12h' : 'Switch to 24h';
            renderSchedule();
        });
    }

    if (tzToggleBtn) {
        tzToggleBtn.addEventListener('click', () => {
            tzPref = tzPref === 'local' ? 'blantyre' : 'local';
            localStorage.setItem('tf_tz_pref', tzPref);
            tzToggleBtn.textContent = tzPref === 'local' ? 'Use Africa/Blantyre' : 'Use Local Time';
            if (tzIndicator) tzIndicator.textContent = tzPref === 'local' ? `(showing browser local time)` : `(showing Camp time, CAT/UTC+2)`;
            renderSchedule();
        });
    }

    // Stage Pills Selection Listeners
    stagePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const stage = pill.dataset.stage;
            const isPressed = pill.getAttribute('aria-pressed') === 'true';
            
            if (isPressed) {
                pill.setAttribute('aria-pressed', 'false');
                pill.classList.remove('active');
                activeStages.delete(stage);
            } else {
                pill.setAttribute('aria-pressed', 'true');
                pill.classList.add('active');
                activeStages.add(stage);
            }
            renderSchedule();
        });
    });
};

// ============================================
// CALENDAR DOWNLOAD GENERATOR (ICS)
// ============================================
const downloadCalendarEvent = (actName, startDate, endDate, stageId) => {
    const pad = (num) => String(num).padStart(2, '0');
    
    // Format to ICS format YYYYMMDDTHHMMSSZ (UTC time format)
    const toICSDate = (d) => {
        const utcDate = new Date(d.toISOString());
        return utcDate.getUTCFullYear() + 
               pad(utcDate.getUTCMonth() + 1) + 
               pad(utcDate.getUTCDate()) + 'T' + 
               pad(utcDate.getUTCHours()) + 
               pad(utcDate.getUTCMinutes()) + 
               pad(utcDate.getUTCSeconds()) + 'Z';
    };

    const title = `Tumaini Archive: ${actName}`;
    const desc = `Celebrating the Tumaini Festival Legacy at Dzaleka Refugee Camp.\nStage: ${stageId.charAt(0).toUpperCase() + stageId.slice(1)}`;
    const location = `Dzaleka Refugee Camp, Dowa, Malawi`;
    
    const ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Dzaleka//Tumaini Festival Archive//EN',
        'BEGIN:VEVENT',
        `UID:${actName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${startDate.getTime()}@tumaini-festival.dzaleka.com`,
        `DTSTAMP:${toICSDate(new Date())}`,
        `DTSTART:${toICSDate(startDate)}`,
        `DTEND:${toICSDate(endDate)}`,
        `SUMMARY:${title}`,
        `DESCRIPTION:${desc}`,
        `LOCATION:${location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${actName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-schedule.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => { URL.revokeObjectURL(a.href); }, 2000);
};
