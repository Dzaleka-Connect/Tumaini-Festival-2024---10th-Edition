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
    const data = await loadFestivalData();
    const timelineContent = document.querySelector('.timeline-content');
    
    if (data && data.festivals) {
        Object.entries(data.festivals).reverse().forEach(([year, festival]) => {
            const timelineCard = createTimelineCard(year, festival);
            timelineContent.appendChild(timelineCard);
        });
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

// Mobile Menu
class MobileMenu {
    constructor() {
        this.menu = document.querySelector('.mobile-menu');
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.bindEvents();
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleMenu());
        
        // Close menu on click outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// Newsletter Form
class NewsletterForm {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeAnimations();
        initializeNavbar();
        initializeMobileMenu();
        initializeSmoothScroll();
        initializeNewsletterForm();
        
        // Initialize disclaimer if it exists
        const disclaimer = document.getElementById('disclaimer');
        if (disclaimer) {
            initializeDisclaimer();
        }

        initializePagination();
        initializeProgramNavigation();
    } catch (error) {
        console.error('Error initializing components:', error);
    }
});

// Initialize Intersection Observer for animations
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

// Handle Navbar Scroll Effect
const initializeNavbar = () => {
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

// Mobile Menu Handler
const initializeMobileMenu = () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Guard clause - return early if elements don't exist
    if (!menuToggle || !navLinks) {
        console.warn('Mobile menu elements not found');
        return;
    }

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        // Check if menu is active and elements exist before handling click
        if (menuToggle.classList.contains('active') && 
            !menuToggle.contains(e.target) && 
            !navLinks.contains(e.target)) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
};

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

// Newsletter Form Handler
const initializeNewsletterForm = () => {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button[type="submit"]');
        
        try {
            // Add loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showNotification('Successfully subscribed!', 'success');
            form.reset();
        } catch (error) {
            // Show error message
            showNotification('Subscription failed. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = 'Subscribe';
        }
    });
};

// Notification Helper
const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Program Schedule Filter
const initializeProgramFilter = () => {
    const filterButtons = document.querySelectorAll('.program-filter');
    const programDays = document.querySelectorAll('.program-day');

    filterButtons?.forEach(button => {
        button.addEventListener('click', () => {
            const day = button.dataset.day;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show/hide program days
            programDays.forEach(programDay => {
                if (day === 'all' || programDay.dataset.day === day) {
                    programDay.style.display = 'block';
                } else {
                    programDay.style.display = 'none';
                }
            });
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
    const articlesPerPage = 6;
    const mediaGrid = document.querySelector('.media-grid');
    const articles = Array.from(mediaGrid.querySelectorAll('.media-card'));
    const totalPages = Math.ceil(articles.length / articlesPerPage);
    let currentPage = 1;

    const updateArticlesDisplay = (page) => {
        articles.forEach((article, index) => {
            const startIndex = (page - 1) * articlesPerPage;
            const endIndex = startIndex + articlesPerPage;
            
            if (index >= startIndex && index < endIndex) {
                article.style.display = 'flex';
            } else {
                article.style.display = 'none';
            }
        });
    };

    const updatePaginationButtons = () => {
        const prevBtn = document.querySelector('[data-page="prev"]');
        const nextBtn = document.querySelector('[data-page="next"]');
        const numberBtns = document.querySelectorAll('.pagination-number');

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        numberBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.page) === currentPage);
        });
    };

    // Event Listeners
    document.querySelectorAll('.pagination-btn, .pagination-number').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.page;
            
            if (action === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (action === 'next' && currentPage < totalPages) {
                currentPage++;
            } else if (action !== 'prev' && action !== 'next') {
                currentPage = parseInt(action);
            }

            updateArticlesDisplay(currentPage);
            updatePaginationButtons();
            
            // Smooth scroll to top of media section
            document.querySelector('.media-coverage').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initialize first page
    updateArticlesDisplay(1);
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