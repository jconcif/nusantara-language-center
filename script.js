// ===================================
// NUSANTARA LANGUAGE CENTER - SCRIPT
// Bilingual System & Interactions
// ===================================

// === LANGUAGE SYSTEM ===
class LanguageManager {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.init();
    }

    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('nlc-language');
        if (savedLang) return savedLang;

        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.startsWith('id') ? 'id' : 'en';
    }

    init() {
        // Set initial language
        this.setLanguage(this.currentLang);

        // Add event listeners to language buttons
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('nlc-language', lang);

        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update all translatable elements
        this.updateContent(lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    updateContent(lang) {
        const elements = document.querySelectorAll('[data-en][data-id]');
        elements.forEach(element => {
            const text = element.getAttribute(`data-${lang}`);
            if (text) {
                // Check if element is input/textarea
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.innerHTML = text;
                }
            }
        });
    }
}

// === SMOOTH SCROLL ===
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Add click handlers to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// === NAVBAR SCROLL EFFECT ===
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            } else {
                this.navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
            }
        });
    }
}

// === MOBILE MENU ===
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.menu = document.querySelector('.nav-menu');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => {
            this.toggleMenu();
            // Accessibility: Toggle aria-expanded
            this.toggle.setAttribute('aria-expanded', this.isOpen);
        });

        // Close menu when clicking on a link
        const navLinks = this.menu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isOpen) {
                    this.toggleMenu();
                    // Accessibility: Toggle aria-expanded
                    this.toggle.setAttribute('aria-expanded', this.isOpen);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.menu.contains(e.target) &&
                !this.toggle.contains(e.target)) {
                this.toggleMenu();
            }
        });
    }

    toggleMenu() {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.menu.style.display = 'flex';
            this.menu.style.flexDirection = 'column';
            this.menu.style.position = 'absolute';
            this.menu.style.top = '100%';
            this.menu.style.left = '0';
            this.menu.style.right = '0';
            this.menu.style.background = 'white';
            this.menu.style.padding = '1rem';
            this.menu.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            this.menu.style.animation = 'fadeInDown 0.3s ease';
        } else {
            this.menu.style.display = '';
            this.menu.style.flexDirection = '';
            this.menu.style.position = '';
            this.menu.style.top = '';
            this.menu.style.left = '';
            this.menu.style.right = '';
            this.menu.style.background = '';
            this.menu.style.padding = '';
            this.menu.style.boxShadow = '';
        }

        // Animate toggle button
        const spans = this.toggle.querySelectorAll('span');
        if (this.isOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
}

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards and sections
        const animatedElements = document.querySelectorAll(
            '.advantage-card, .program-card, .instructor-card, .testimonial-card, .contact-item'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
}

// === ACTIVE NAVIGATION HIGHLIGHT ===
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.highlightActiveSection();
        });
    }

    highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active-section');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.style.color = 'var(--nlc-blue)';
                    } else {
                        link.style.color = '';
                    }
                });
            }
        });
    }
}

// === PROGRAM CARD INTERACTIONS ===
class ProgramCards {
    constructor() {
        this.cards = document.querySelectorAll('.program-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.highlightCard(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetCard(card);
            });
        });
    }

    highlightCard(card) {
        const level = card.getAttribute('data-level');
        const colors = {
            '1': 'var(--nlc-blue)',
            '2': 'var(--nlc-green)',
            '3': 'var(--nlc-orange)',
            '4': 'var(--nlc-red)',
            '5': 'var(--nlc-yellow-dark)'
        };

        card.style.borderColor = colors[level] || 'var(--nlc-blue)';
    }

    resetCard(card) {
        if (!card.classList.contains('featured')) {
            card.style.borderColor = '';
        }
    }
}

// === WHATSAPP MODAL INTEGRATION ===
class WhatsAppIntegration {
    constructor() {
        this.phoneNumber = '6285940365407'; // Test number
        this.modal = document.getElementById('enrollModal');
        this.form = document.getElementById('enrollmentForm');
        this.programTitleElement = document.getElementById('modalProgramName');
        this.currentProgram = '';
        this.init();
    }

    init() {
        if (!this.modal) return;

        // Open Modal Triggers
        const enrollButtons = document.querySelectorAll('.btn-program');
        enrollButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.program-card');
                const title = card.querySelector('.program-title').textContent;
                this.openModal(title);
            });
        });

        // Close Modal Triggers
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Form Submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleWhatsAppRedirect();
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    openModal(programTitle) {
        this.currentProgram = programTitle;
        if (this.programTitleElement) {
            this.programTitleElement.textContent = programTitle;
        }
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleWhatsAppRedirect() {
        const name = document.getElementById('applicantName').value;
        const residence = document.getElementById('applicantResidence').value;
        const lang = localStorage.getItem('nlc-language') || 'en';

        // Construct Message
        let message = '';
        if (lang === 'id') {
            message = `Halo! Nama saya ${name} dari ${residence}.\nSaya tertarik mendaftar untuk program: *${this.currentProgram}*.\nMohon info ketersediaan dan jadwalnya. Terima kasih.`;
        } else {
            message = `Hello! My name is ${name} from ${residence}.\nI am interested in enrolling in the *${this.currentProgram}* program.\nPlease let me know about availability and schedules. Thank you.`;
        }

        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;

        // Track and Open
        this.trackEnrollment(this.currentProgram);
        window.open(url, '_blank');

        // Optional: Close modal after short delay
        setTimeout(() => this.closeModal(), 1000);
    }

    trackEnrollment(program) {
        console.log(`Enrollment initiated for: ${program}`);
        // Analytics code would go here
    }
}



// === PERFORMANCE OPTIMIZATION ===
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images when they're about to enter viewport
        this.lazyLoadImages();

        // Preload critical resources
        this.preloadResources();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadResources() {
        // Preload Google Fonts
        const fontLink = document.createElement('link');
        fontLink.rel = 'preconnect';
        fontLink.href = 'https://fonts.googleapis.com';
        document.head.appendChild(fontLink);
    }
}

// === ACCESSIBILITY ENHANCEMENTS ===
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }

    init() {
        // Add keyboard navigation support
        this.addKeyboardNavigation();

        // Add focus visible styles
        this.addFocusStyles();

        // Add skip to content link
        this.addSkipLink();
    }

    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC key closes mobile menu
            if (e.key === 'Escape') {
                const mobileMenu = document.querySelector('.nav-menu');
                if (mobileMenu && window.getComputedStyle(mobileMenu).position === 'absolute') {
                    const toggle = document.querySelector('.mobile-menu-toggle');
                    if (toggle) toggle.click();
                }
            }
        });
    }

    addFocusStyles() {
        // Add visible focus indicators for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 3px solid var(--nlc-blue);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -100px;
            left: 0;
            background: var(--nlc-blue);
            color: white;
            padding: 8px;
            text-decoration: none;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-100px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// === INITIALIZE ALL MODULES ===
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new LanguageManager();
    new SmoothScroll();
    new NavbarScroll();
    new MobileMenu();

    // Animations and interactions
    new ScrollAnimations();
    new ActiveNavigation();
    new ProgramCards();

    // Integrations
    new WhatsAppIntegration();


    // Enhancements
    new PerformanceOptimizer();
    new AccessibilityEnhancer();

    console.log('🎓 Nusantara Language Center website initialized successfully!');
});

// === UTILITY FUNCTIONS ===

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LanguageManager,
        SmoothScroll,
        WhatsAppIntegration
    };
}
