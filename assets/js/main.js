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

// Newsletter Form
class NewsletterForm {
    constructor(form) {
        this.form = form;
        this.bindEvents();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        const email = this.form.querySelector('input[type="email"]').value;
        
        try {
            this.form.classList.add('loading');
            // Add your newsletter API endpoint here
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            if (response.ok) {
                this.showSuccess();
            } else {
                throw new Error('Newsletter subscription failed');
            }
        } catch (error) {
            this.showError(error);
        } finally {
            this.form.classList.remove('loading');
        }
    }

    showSuccess() {
        // Add success message implementation
    }

    showError(error) {
        // Add error message implementation
    }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Core functionality
        handleNavbarScroll();
        initializeMobileMenu();
        initializeSmoothScroll();

        // Initialize animations if needed
        if (typeof initializeAnimations === 'function') {
            initializeAnimations();
        }
        
        // Initialize forms if they exist
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            new NewsletterForm(newsletterForm);
        }

        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            new ContactForm(contactForm);
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