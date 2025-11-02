// Initialize dynamic content loading
const loadFestivalData = async () => {
    try {
        const response = await fetch('/assets/data/festival-data.json');
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
                Object.entries(data.festivals).reverse().forEach(([year, festival]) => {
                    const timelineCard = createTimelineCard(year, festival);
                    timelineContent.appendChild(timelineCard);
                });
            }
        } catch (error) {
            console.error('Error initializing timeline:', error);
        } finally {
            hideLoading(timelineContent);
        }
    }
};

// Create timeline cards
const createTimelineCard = (year, festival) => {
    const card = document.createElement('div');
    card.className = 'timeline-card fade-up';

    const notablePerformersHTML = festival.notable_performers ? `
        <div class="timeline-performers">
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--color-primary, #FF4D00); font-size: 1rem;">Notable Performers</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
                ${festival.notable_performers.map(performer => `
                    <div style="padding: 0.75rem; background: rgba(255, 77, 0, 0.05); border-radius: 8px; border-left: 3px solid var(--color-primary, #FF4D00);">
                        <strong style="color: var(--color-primary, #FF4D00);">${performer.name}</strong>
                        <p style="margin: 0.25rem 0 0 0; font-size: 0.875rem; color: #666;">${performer.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const sourcesHTML = festival.sources ? `
        <div class="timeline-sources" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
            <h4 style="margin-bottom: 0.75rem; color: #666; font-size: 0.875rem; font-weight: 600;">
                <i class="fas fa-link" style="margin-right: 0.5rem;"></i>Sources
            </h4>
            <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.875rem;">
                ${festival.sources.map(source => `
                    <li style="margin-bottom: 0.5rem;">
                        <a href="${source.url}" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary, #FF4D00); text-decoration: none; display: flex; align-items: start; gap: 0.5rem;">
                            <i class="fas fa-external-link-alt" style="margin-top: 0.25rem; font-size: 0.75rem; opacity: 0.7;"></i>
                            <span>
                                <strong>${source.publisher}</strong> - ${source.title}
                                <span style="color: #999; font-size: 0.8rem; display: block;">Accessed: ${source.accessed}</span>
                            </span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
    ` : '';

    const noteHTML = festival.note ? `
        <div class="timeline-note" style="margin-top: 1.5rem; padding: 1rem; background: #fffbea; border-left: 4px solid #ffa500; font-size: 0.875rem; color: #856404; border-radius: 4px;">
            <i class="fas fa-info-circle" style="margin-right: 0.5rem;"></i>
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
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Core functionality
        handleNavbarScroll();
        initializeMobileMenu();
        initializeSmoothScroll();

        // Initialize timeline with festival data
        initializeTimeline();

        // Initialize animations if needed
        if (typeof initializeAnimations === 'function') {
            initializeAnimations();
        }

        // Newsletter form is handled inline with Formspree in index.html
        // Contact form handled separately if needed
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

// Disclaimer Banner
const initializeDisclaimer = () => {
    const disclaimer = document.getElementById('disclaimer');
    const disclaimerClose = document.querySelector('.disclaimer-close');
    const navbar = document.querySelector('.navbar');
    const main = document.querySelector('main');
    
    if (!disclaimer || !disclaimerClose || !navbar || !main) return;
    
    // Check if disclaimer was previously closed
    const isDisclaimerClosed = localStorage.getItem('disclaimerClosed');
    
    if (isDisclaimerClosed) {
        disclaimer.classList.add('closed');
        navbar.classList.add('disclaimer-closed');
        main.classList.add('disclaimer-closed');
    }
    
    disclaimerClose.addEventListener('click', () => {
        disclaimer.classList.add('closed');
        navbar.classList.add('disclaimer-closed');
        main.classList.add('disclaimer-closed');
        
        // Store the state in localStorage
        localStorage.setItem('disclaimerClosed', 'true');
    });
};

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