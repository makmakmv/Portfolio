/* ==========================================================================
   EMAILJS INITIALIZATION
   ========================================================================== */
if (typeof emailjs !== 'undefined') {
    emailjs.init({
        publicKey: "AkCqd2Koxk7HPPS_G",
    });
}

/* ==========================================================================
   INTERACTIVE CANVAS PARTICLE SYSTEM (CONSTELLATION WEB)
   ========================================================================== */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const isLightTheme = canvas.classList.contains('light-canvas');
    
    // Adaptive colors based on page theme
    const particleColor = isLightTheme ? 'rgba(15, 23, 42, 0.22)' : 'rgba(255, 255, 255, 0.7)';
    const webLineColor = isLightTheme ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.18)';
    const mouseGlowColor = isLightTheme ? 'rgba(255, 87, 34, 0.28)' : 'rgba(255, 87, 34, 0.35)';

    let particlesArray = [];
    let mouse = {
        x: null,
        y: null,
        radius: 120 // Interaction radius
    };

    // Mouse tracking
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Class
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius + this.size) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 1.5;
                    const directionY = forceDirectionY * force * 1.5;
                    
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Generate the particle field
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 11000;
        numberOfParticles = Math.min(Math.max(numberOfParticles, 25), 105);
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.8) - 0.4;
            let directionY = (Math.random() * 0.8) - 0.4;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    // Connect particles
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 115) {
                    opacityValue = 1 - (distance / 115);
                    ctx.strokeStyle = isLightTheme ? `rgba(15, 23, 42, ${opacityValue * 0.08})` : `rgba(255, 255, 255, ${opacityValue * 0.18})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particlesArray[a].x - mouse.x;
                let dy = particlesArray[a].y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    opacityValue = 1 - (distance / mouse.radius);
                    ctx.strokeStyle = isLightTheme ? `rgba(255, 87, 34, ${opacityValue * 0.28})` : `rgba(255, 87, 34, ${opacityValue * 0.35})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
}



/* ==========================================================================
   TYPEWRITER CYCLING EFFECT
   ========================================================================== */
const typewriterElement = document.getElementById('typewriter-text');
const roles = [
    "an IT Professional",
    "a Technical Support Specialist",
    "a Digital Operations Expert",
    "a Video Editor",
    "a Community Moderator"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 120;
let erasingDelay = 60;
let newWordDelay = 2000; // Pause at the end of word

function typeEffect() {
    const currentWord = roles[roleIndex];
    
    if (isDeleting) {
        // Erase character
        typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = erasingDelay;
    } else {
        // Type character
        typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 120 - Math.random() * 50; // Add human variance
    }
    
    if (!isDeleting && charIndex === currentWord.length) {
        // Word typed completely, pause then start deleting
        typingDelay = newWordDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Word erased completely, swap to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 500; // brief pause before next word starts typing
    }
    
    setTimeout(typeEffect, typingDelay);
}

// Run typewriter loop on load if the target element exists
document.addEventListener('DOMContentLoaded', () => {
    if (typewriterElement) {
        setTimeout(typeEffect, 800);
    }
});


/* ==========================================================================
   MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        if (navMenu) navMenu.classList.toggle('active');
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
}


/* ==========================================================================
   NAVBAR BACKGROUND ON SCROLL
   ========================================================================== */
const header = document.getElementById('main-header');

window.addEventListener('scroll', () => {
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});


/* ==========================================================================
   SCROLL ACTIVE LINK DETECTION (Intersection Observer)
   ========================================================================== */
const sections = document.querySelectorAll('section');

const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies mid viewport
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const activeId = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});


/* ==========================================================================
   CONTACT FORM SUBMISSION WITH EMAILJS
   ========================================================================== */
const contactForm = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page reload
        
        const submitBtn = document.getElementById('btn-submit-contact');
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";
        
        // Send email via EmailJS
        emailjs.sendForm('service_qnwfqgg', 'template_obncjld', this)
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
                
                // Show modal
                if (successModal) {
                    successModal.classList.add('active');
                }
                
                // Reset Form Fields
                contactForm.reset();
            }, (error) => {
                submitBtn.disabled = false;
                submitBtn.innerText = "Send Message";
                console.error("EmailJS Error details:", error);
                alert("Failed to send message. Please try again or contact me directly at markvincentpeligros@gmail.com.");
            });
    });
}

// Close Success Modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
    });
}

// Close Modal when clicking outside the box
if (successModal) {
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
}

/* ==========================================================================
   SCROLL ENTRANCE ANIMATIONS (Intersection Observer)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if (revealElements.length > 0) {
        const revealObserverOptions = {
            root: null,
            rootMargin: '0px 0px -8% 0px', // Trigger slightly before entering mid-viewport
            threshold: 0.1 // Trigger when 10% of the element is visible
        };
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Stop observing after animation triggers
                }
            });
        }, revealObserverOptions);
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
});

/* ==========================================================================
   CERTIFICATE PREVIEW MODAL
   ========================================================================== */
const certModal = document.getElementById('cert-modal');
const certIframe = document.getElementById('cert-iframe');
const certModalTitle = document.getElementById('cert-modal-title');
const closeCertModalBtn = document.getElementById('close-cert-modal-btn');
const certViewButtons = document.querySelectorAll('.cert-view-btn');

function closeCertModal() {
    if (certModal) {
        certModal.classList.remove('active');
    }
    if (certIframe) {
        certIframe.src = '';
    }
}

if (certViewButtons.length > 0 && certModal && certIframe) {
    certViewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const certSrc = button.getAttribute('data-cert-src');
            const certTitle = button.parentElement.querySelector('h4')?.textContent || 'Certificate Preview';
            
            if (certModalTitle) {
                certModalTitle.textContent = certTitle;
            }
            
            certIframe.src = `${certSrc}#toolbar=0`;
            certModal.classList.add('active');
        });
    });
}

if (closeCertModalBtn) {
    closeCertModalBtn.addEventListener('click', closeCertModal);
}

if (certModal) {
    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeCertModal();
        }
    });
}

// Close on Escape key press
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

/* ==========================================================================
   OJT SHOWCASE INTERACTIVE GALLERY & CAROUSELS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mini-Gallery Slideshow (Carousels inside Pillar Cards)
    const miniGalleries = document.querySelectorAll('.mini-gallery');
    
    miniGalleries.forEach(gallery => {
        const slides = gallery.querySelectorAll('.mini-slide');
        const prevBtn = gallery.querySelector('.mini-arrow.prev');
        const nextBtn = gallery.querySelector('.mini-arrow.next');
        const dots = gallery.querySelectorAll('.mini-dot');
        let currentSlideIndex = 0;
        
        if (slides.length <= 1) return;
        
        function showSlide(index) {
            slides[currentSlideIndex].classList.remove('active');
            dots[currentSlideIndex].classList.remove('active');
            
            currentSlideIndex = (index + slides.length) % slides.length;
            
            slides[currentSlideIndex].classList.add('active');
            dots[currentSlideIndex].classList.add('active');
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox on arrow click
                showSlide(currentSlideIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox on arrow click
                showSlide(currentSlideIndex + 1);
            });
        }
        
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox on dot click
                const slideIndex = parseInt(dot.getAttribute('data-index'), 10);
                showSlide(slideIndex);
            });
        });
    });

    // 1b. Creatives Showcase Filmstrip System (Pillar 3 Redesign)
    const creativeFeatured = document.getElementById('creative-featured-img');
    const filmstripItems = document.querySelectorAll('.filmstrip-item');
    const filmstripPrev = document.querySelector('.filmstrip-arrow.prev');
    const filmstripNext = document.querySelector('.filmstrip-arrow.next');
    const filmstripTrack = document.querySelector('.filmstrip-track');
    const creativeTitle = document.getElementById('creative-title');
    const creativeDesc = document.getElementById('creative-desc');
    
    let creativeIdx = 0;
    
    if (creativeFeatured && filmstripItems.length > 0) {
        function selectCreative(idx) {
            filmstripItems[creativeIdx].classList.remove('active');
            creativeIdx = (idx + filmstripItems.length) % filmstripItems.length;
            const selectedItem = filmstripItems[creativeIdx];
            selectedItem.classList.add('active');
            
            // Smoothly swap featured image and detail texts
            creativeFeatured.style.opacity = '0';
            creativeFeatured.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                creativeFeatured.src = selectedItem.getAttribute('data-img');
                creativeFeatured.alt = selectedItem.querySelector('img').alt;
                creativeFeatured.setAttribute('data-lightbox-src', selectedItem.getAttribute('data-lightbox-src'));
                creativeFeatured.setAttribute('data-lightbox-caption', selectedItem.getAttribute('data-lightbox-caption'));
                
                if (creativeTitle) creativeTitle.textContent = selectedItem.getAttribute('data-title');
                if (creativeDesc) creativeDesc.textContent = selectedItem.getAttribute('data-caption');
                
                creativeFeatured.style.opacity = '1';
                creativeFeatured.style.transform = 'scale(1)';
            }, 150);
            
            // Center the selected item in the horizontally scrollable track
            if (filmstripTrack) {
                const trackWidth = filmstripTrack.clientWidth;
                const itemLeft = selectedItem.offsetLeft;
                const itemWidth = selectedItem.clientWidth;
                filmstripTrack.scrollTo({
                    left: itemLeft - (trackWidth / 2) + (itemWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
        
        filmstripItems.forEach((item, idx) => {
            item.addEventListener('click', () => selectCreative(idx));
        });
        
        if (filmstripPrev) {
            filmstripPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCreative(creativeIdx - 1);
            });
        }
        if (filmstripNext) {
            filmstripNext.addEventListener('click', (e) => {
                e.stopPropagation();
                selectCreative(creativeIdx + 1);
            });
        }
        
        // Connect click event to the existing Lightbox Modal
        const featuredWrapper = creativeFeatured.closest('.featured-wrapper');
        if (featuredWrapper) {
            featuredWrapper.addEventListener('click', () => {
                const items = Array.from(filmstripItems).map(item => {
                    return {
                        src: item.getAttribute('data-lightbox-src') || item.getAttribute('data-img'),
                        caption: item.getAttribute('data-lightbox-caption') || '',
                        badge: 'Content Creation',
                        alt: item.querySelector('img').alt || ''
                    };
                });
                openLightbox(items, creativeIdx);
            });
        }
    }

    // 2. Lightbox Modal Preview System
    const lightboxModal = document.getElementById('photo-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxBadge = document.getElementById('lightbox-badge');
    const lightboxIndexText = document.getElementById('lightbox-index');
    const closeLightboxBtn = document.getElementById('close-lightbox-btn');
    const prevLightboxBtn = lightboxModal ? lightboxModal.querySelector('.lightbox-arrow.prev') : null;
    const nextLightboxBtn = lightboxModal ? lightboxModal.querySelector('.lightbox-arrow.next') : null;

    let lightboxActiveItems = [];
    let lightboxCurrentIdx = 0;

    function openLightbox(itemsList, startIdx) {
        if (!lightboxModal || !lightboxImg) return;
        
        lightboxActiveItems = itemsList;
        lightboxCurrentIdx = startIdx;
        
        updateLightboxContent();
        lightboxModal.classList.add('active');
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
        }
        if (lightboxImg) {
            lightboxImg.src = '';
        }
    }

    function updateLightboxContent() {
        if (!lightboxImg || lightboxActiveItems.length === 0) return;
        
        const item = lightboxActiveItems[lightboxCurrentIdx];
        
        // Temporarily fade out image during swap
        lightboxImg.style.transform = 'scale(0.97)';
        lightboxImg.style.opacity = '0.5';
        
        setTimeout(() => {
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt || 'OJT Capture Preview';
            if (lightboxCaption) lightboxCaption.textContent = item.caption || '';
            if (lightboxBadge) {
                if (item.badge) {
                    lightboxBadge.textContent = item.badge;
                    lightboxBadge.style.display = 'inline-block';
                } else {
                    lightboxBadge.style.display = 'none';
                }
            }
            if (lightboxIndexText) {
                lightboxIndexText.textContent = `${lightboxCurrentIdx + 1} of ${lightboxActiveItems.length}`;
            }
            
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.style.opacity = '1';
        }, 100);
    }

    function navigateLightbox(direction) {
        if (lightboxActiveItems.length <= 1) return;
        lightboxCurrentIdx = (lightboxCurrentIdx + direction + lightboxActiveItems.length) % lightboxActiveItems.length;
        updateLightboxContent();
    }

    // Bind event triggers for lightbox
    // Clicking on main gallery cards
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            // Compute active filtered cards list
            const visibleCards = Array.from(galleryCards).filter(c => !c.classList.contains('hidden'));
            const items = visibleCards.map(c => {
                const img = c.querySelector('img');
                const badge = c.querySelector('.gallery-card-badge');
                return {
                    src: c.getAttribute('data-lightbox-src') || img.src,
                    caption: c.getAttribute('data-lightbox-caption') || '',
                    badge: badge ? badge.textContent : '',
                    alt: img ? img.alt : ''
                };
            });
            const clickedIdx = visibleCards.indexOf(card);
            openLightbox(items, clickedIdx >= 0 ? clickedIdx : 0);
        });
    });

    // Clicking on mini-gallery slides
    const miniSlides = document.querySelectorAll('.mini-slide');
    miniSlides.forEach(slide => {
        slide.addEventListener('click', () => {
            const parentCard = slide.closest('.showcase-card');
            const cardSlides = parentCard.querySelectorAll('.mini-slide');
            const badge = parentCard.querySelector('.card-badge');
            
            const items = Array.from(cardSlides).map(s => {
                return {
                    src: s.getAttribute('data-lightbox-src') || s.src,
                    caption: s.getAttribute('data-lightbox-caption') || '',
                    badge: badge ? badge.textContent : '',
                    alt: s.alt || ''
                };
            });
            const clickedIdx = Array.from(cardSlides).indexOf(slide);
            openLightbox(items, clickedIdx >= 0 ? clickedIdx : 0);
        });
    });

    // Lightbox Controls Events
    if (closeLightboxBtn) {
        closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    if (prevLightboxBtn) {
        prevLightboxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });
    }

    if (nextLightboxBtn) {
        nextLightboxBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard controls for lightbox modal
    window.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });

    // 3. Unified Gallery Filtering Behavior
    const filterChips = document.querySelectorAll('.filter-chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filterValue = chip.getAttribute('data-filter');
            
            // Set active class
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            // Filter grid cards
            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    card.classList.remove('hidden');
                    // Trigger reflow to run transition
                    void card.offsetWidth;
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                    card.style.pointerEvents = 'auto';
                } else {
                    // Hide item
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    card.style.pointerEvents = 'none';
                    // Delay setting display:none/hidden class to match transition
                    setTimeout(() => {
                        if (card.style.opacity === '0') {
                            card.classList.add('hidden');
                        }
                    }, 400);
                }
            });
        });
    });

    // 4. "View all" / "View captures in gallery" quick-link behavior
    const viewGalleryLinks = document.querySelectorAll('.view-gallery-link');
    
    viewGalleryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filterVal = link.getAttribute('data-filter');
            const targetGallery = document.getElementById('ojt-gallery');
            
            if (targetGallery) {
                // Scroll smoothly to target gallery
                targetGallery.scrollIntoView({ behavior: 'smooth' });
                
                // Find matching filter chip and trigger click
                const matchChip = Array.from(filterChips).find(c => c.getAttribute('data-filter') === filterVal);
                if (matchChip) {
                    setTimeout(() => {
                        matchChip.click();
                    }, 500); // Wait for smooth scrolling to start/finish
                }
            }
        });
    });

    // 5. IT Support Rush Easter Egg Mini-Game
    (function() {
        let clickCount = 0;
        let lastClickTime = 0;
        const clickLimit = 5;
        const timeLimit = 3000; // 3 seconds

        const navLogos = document.querySelectorAll('.navbar .logo');
        const gameModal = document.getElementById('game-modal');
        const closeGameBtn = document.getElementById('close-game-btn');
        const restartGameBtn = document.getElementById('restart-game-btn');
        const gameCanvas = document.getElementById('game-canvas');
        const gameOverScreen = document.getElementById('game-over-screen');
        const gameScoreText = document.getElementById('game-score');
        const gameHighScoreText = document.getElementById('game-high-score');
        const gameMilestoneText = document.getElementById('game-milestone-text');
        const gameMilestoneBanner = document.getElementById('game-milestone-banner');
        const coffeeIndicator = document.getElementById('coffee-indicator');
        const gameOverText = document.querySelector('.game-over-text');

        if (!gameCanvas || !gameModal) return;

        const ctx = gameCanvas.getContext('2d');
        
        // Game state variables
        let gameActive = false;
        let isGameOver = false;
        let score = 0;
        let highScore = parseInt(localStorage.getItem('it_support_rush_highscore') || '0');
        let speed = 4;
        let gameFrame = 0;
        let obstacles = [];
        let powerUps = [];
        let coffeeActive = false;
        let coffeeEndTime = 0;
        const coffeeDuration = 5000;
        let inBossBattle = false;
        let bossTriggered = false;
        let bossBattleFrame = 0;
        const bossBattleDurationFrames = 1200;
        let boss = null;
        let bossAttacks = [];
        let nextObstacleSpawnFrame = 100;
        let nextCoffeeSpawnFrame = 240;
        let animationFrameId = null;

        // Player (Runner MV Logo)
        const player = {
            x: 50,
            y: 120, // Canvas height is 200, player size is 40x40
            width: 40,
            height: 40,
            radius: 20,
            yVelocity: 0,
            gravity: 0.5,
            jumpForce: -9.5,
            isJumping: false,
            groundY: 120,
            
            draw() {
                // Glassmorphic circle
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fill();
                ctx.lineWidth = 2.5;
                ctx.strokeStyle = 'rgba(255, 87, 34, 0.85)';
                // Add orange glow shadow
                ctx.shadowBlur = 12;
                ctx.shadowColor = 'rgba(255, 87, 34, 0.6)';
                ctx.stroke();
                ctx.restore();

                // Text "MV"
                ctx.save();
                ctx.font = 'bold 15px Outfit, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Drop shadow
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetY = 1.5;
                ctx.fillText('MV.', this.x + this.radius, this.y + this.radius);
                ctx.restore();
            },
            
            update() {
                // Gravity physics
                this.yVelocity += this.gravity;
                this.y += this.yVelocity;
                
                // Check ground boundary
                if (this.y >= this.groundY) {
                    this.y = this.groundY;
                    this.yVelocity = 0;
                    this.isJumping = false;
                }
            },
            
            jump() {
                if (!this.isJumping && !isGameOver) {
                    this.yVelocity = this.jumpForce;
                    this.isJumping = true;
                }
            }
        };

        const obstacleTypes = [
            { emoji: '🖨️', name: 'Printer Error', width: 46, height: 40, y: 124 },
            { emoji: '💻', name: 'BSOD Screen', width: 52, height: 36, y: 126 },
            { emoji: '🔌', name: 'Network Failure', width: 38, height: 34, y: 130 },
            { emoji: '🔑', name: 'Password Reset Request', width: 36, height: 34, y: 130 },
            { emoji: '📹', name: 'Zoom Issue', width: 34, height: 30, y: 128 }
        ];

        const bossAttackTypes = [
            { emoji: '🧾', width: 28, height: 32, y: 128, label: 'Paper Jam' },
            { emoji: '⚠️', width: 34, height: 34, y: 110, label: 'Error Popup' },
            { emoji: '🖨️', width: 40, height: 34, y: 126, label: 'Ink Warning' },
            { emoji: '🔌', width: 30, height: 30, y: 118, label: 'Offline Alert' }
        ];

        class Obstacle {
            constructor() {
                const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
                this.emoji = type.emoji;
                this.name = type.name;
                this.width = type.width + Math.floor(Math.random() * 6 - 3);
                this.height = type.height;
                this.x = gameCanvas.width + 30 + Math.random() * 90;
                this.y = type.y;
                this.passed = false;
                this.speedOffset = Math.random() * 0.7;
            }

            draw() {
                ctx.save();
                ctx.font = `${Math.floor(this.height * 0.9)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
                ctx.restore();
            }

            update() {
                this.x -= speed + this.speedOffset;
                this.draw();
            }
        }

        class CoffeeBoost {
            constructor() {
                this.width = 30;
                this.height = 30;
                this.x = gameCanvas.width + 40;
                this.y = 88 + Math.random() * 18;
                this.collected = false;
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 138, 34, 0.18)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 167, 38, 0.9)';
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.font = '20px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#fff3e0';
                ctx.fillText('☕', this.x + this.width / 2, this.y + this.height / 2);
                ctx.restore();
            }

            update() {
                this.x -= speed;
                this.draw();
            }
        }

        class Boss {
            constructor() {
                this.x = gameCanvas.width + 140;
                this.y = 32;
                this.width = 110;
                this.height = 76;
                this.targetX = 420;
                this.speed = 1.2;
                this.attackTimer = 0;
            }

            draw() {
                ctx.save();
                ctx.fillStyle = 'rgba(255, 87, 34, 0.12)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.strokeStyle = 'rgba(255, 87, 34, 0.7)';
                ctx.lineWidth = 2;
                ctx.strokeRect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = '#ffb74d';
                ctx.font = '20px Outfit, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🖨️', this.x + this.width / 2, this.y + 22);
                ctx.font = '12px Outfit, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('PRINTER', this.x + this.width / 2, this.y + 48);
                ctx.fillText('FROM HELL', this.x + this.width / 2, this.y + 62);
                ctx.restore();
            }

            update() {
                if (this.x > this.targetX) {
                    this.x -= this.speed;
                }
                this.draw();
            }
        }

        class BossAttack {
            constructor(type) {
                this.emoji = type.emoji;
                this.width = type.width;
                this.height = type.height;
                this.x = boss.x - this.width * 0.5;
                this.y = type.y;
                this.speed = speed + 1.2;
            }

            draw() {
                ctx.save();
                ctx.font = `${Math.floor(this.height * 0.9)}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.emoji, this.x + this.width / 2, this.y + this.height / 2);
                ctx.restore();
            }

            update() {
                this.x -= this.speed;
                this.draw();
            }
        }

        function collideCircleRect(cx, cy, radius, rx, ry, rw, rh) {
            const closestX = Math.max(rx, Math.min(cx, rx + rw));
            const closestY = Math.max(ry, Math.min(cy, ry + rh));
            const dx = cx - closestX;
            const dy = cy - closestY;
            return (dx * dx + dy * dy) < (radius * radius);
        }

        function showGameMessage(message, extraClass = '') {
            gameMilestoneBanner.textContent = message;
            gameMilestoneBanner.className = `milestone-banner active ${extraClass}`.trim();
            setTimeout(() => {
                gameMilestoneBanner.classList.remove('active');
                if (extraClass) {
                    gameMilestoneBanner.classList.remove(extraClass);
                }
            }, 3200);
        }

        function activateCoffeeBoost() {
            coffeeActive = true;
            coffeeEndTime = performance.now() + coffeeDuration;
            if (coffeeIndicator) {
                coffeeIndicator.classList.add('active');
            }
            showGameMessage('☕ Coffee Boost Activated!', 'milestone-coffee');
        }

        function updateCoffeeIndicator() {
            if (!coffeeActive || !coffeeIndicator) return;
            const remainingMs = coffeeEndTime - performance.now();
            if (remainingMs <= 0) {
                coffeeActive = false;
                coffeeIndicator.classList.remove('active');
                return;
            }
            coffeeIndicator.textContent = `☕ Coffee Boost: ${Math.ceil(remainingMs / 1000)}s`;
        }

        function startBossBattle() {
            inBossBattle = true;
            boss = new Boss();
            bossAttacks = [];
            powerUps = [];
            obstacles = [];
            bossBattleFrame = 0;
            showGameMessage('⚠ CRITICAL INCIDENT DETECTED ⚠', 'milestone-critical');
        }

        function completeBossBattle() {
            inBossBattle = false;
            boss = null;
            bossAttacks = [];
            speed += 1.2;
            showGameMessage('You survived IT Support.', 'milestone-boss');
            setTimeout(() => {
                showGameMessage('🏆 Help Desk Legend', 'milestone-boss');
            }, 1200);
        }

        function handleBossBattle() {
            if (!boss) return;
            boss.update();
            boss.attackTimer++;
            if (boss.attackTimer > Math.max(50, 100 - Math.floor(score / 125))) {
                boss.attackTimer = 0;
                bossAttacks.push(new BossAttack(bossAttackTypes[Math.floor(Math.random() * bossAttackTypes.length)]));
            }
            for (let i = bossAttacks.length - 1; i >= 0; i--) {
                bossAttacks[i].update();
                const collided = collideCircleRect(player.x + player.radius, player.y + player.radius, player.radius, bossAttacks[i].x, bossAttacks[i].y, bossAttacks[i].width, bossAttacks[i].height);
                if (collided && !coffeeActive) {
                    endGame('The Printer From Hell overwhelmed the help desk.');
                    return;
                }
                if (bossAttacks[i].x + bossAttacks[i].width < 0) {
                    bossAttacks.splice(i, 1);
                }
            }
            bossBattleFrame++;
            if (bossBattleFrame >= bossBattleDurationFrames && gameActive && !isGameOver) {
                completeBossBattle();
            }
        }

        function scheduleNextObstacle() {
            nextObstacleSpawnFrame = gameFrame + 100 + Math.floor(Math.random() * 80);
        }

        function scheduleNextCoffee() {
            nextCoffeeSpawnFrame = gameFrame + 240 + Math.floor(Math.random() * 100);
        }

        function spawnCoffee() {
            if (coffeeActive || powerUps.length > 0 || inBossBattle) return;
            if (Math.random() < 0.22) {
                powerUps.push(new CoffeeBoost());
            }
            scheduleNextCoffee();
        }

        function spawnObstacle() {
            obstacles.push(new Obstacle());
            scheduleNextObstacle();
        }

        function maybeTriggerBoss() {
            if (!bossTriggered && score >= 1000) {
                bossTriggered = true;
                startBossBattle();
            }
        }

        function handlePowerUps() {
            for (let i = powerUps.length - 1; i >= 0; i--) {
                powerUps[i].update();
                if (collideCircleRect(player.x + player.radius, player.y + player.radius, player.radius, powerUps[i].x, powerUps[i].y, powerUps[i].width, powerUps[i].height)) {
                    activateCoffeeBoost();
                    powerUps.splice(i, 1);
                    continue;
                }
                if (powerUps[i].x + powerUps[i].width < 0) {
                    powerUps.splice(i, 1);
                }
            }
        }

        function handleObstacles() {
            if (gameFrame >= nextObstacleSpawnFrame) {
                spawnObstacle();
            }
            if (gameFrame >= nextCoffeeSpawnFrame) {
                spawnCoffee();
            }
            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].update();
                if (!obstacles[i].passed && obstacles[i].x + obstacles[i].width < player.x) {
                    score += 10;
                    obstacles[i].passed = true;
                    speed += 0.14;
                    gameScoreText.textContent = `Issues Resolved: ${score}`;
                    checkMilestones();
                    maybeTriggerBoss();
                }
                const playerCenterX = player.x + player.radius;
                const playerCenterY = player.y + player.radius;
                const obsCenterX = obstacles[i].x + obstacles[i].width / 2;
                const obsCenterY = obstacles[i].y + obstacles[i].height / 2;
                const dx = playerCenterX - obsCenterX;
                const dy = playerCenterY - obsCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < (player.radius + Math.min(obstacles[i].width, obstacles[i].height) / 2 + 6) && !coffeeActive) {
                    endGame();
                }
                if (obstacles[i].x + obstacles[i].width < 0) {
                    obstacles.splice(i, 1);
                }
            }
            handlePowerUps();
        }

        function updatePlayerGlow() {
            if (!coffeeActive) return;
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.beginPath();
            ctx.arc(player.x + player.radius, player.y + player.radius, player.radius + 8, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 167, 38, 0.16)';
            ctx.fill();
            ctx.restore();
        }

        function drawGround() {
            ctx.beginPath();
            ctx.moveTo(0, 160);
            ctx.lineTo(gameCanvas.width, 160);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        function animate() {
            if (!gameActive) return;
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            drawGround();
            player.update();
            if (inBossBattle) {
                handleBossBattle();
            } else {
                handleObstacles();
            }
            if (coffeeActive) {
                updateCoffeeIndicator();
                updatePlayerGlow();
            }
            player.draw();
            gameFrame++;
            animationFrameId = requestAnimationFrame(animate);
        }

        function startGame() {
            gameActive = true;
            isGameOver = false;
            score = 0;
            speed = 4;
            gameFrame = 0;
            obstacles = [];
            powerUps = [];
            coffeeActive = false;
            coffeeEndTime = 0;
            inBossBattle = false;
            bossTriggered = false;
            bossBattleFrame = 0;
            boss = null;
            bossAttacks = [];
            triggeredMilestones = {};
            scheduleNextObstacle();
            scheduleNextCoffee();
            player.y = player.groundY;
            player.yVelocity = 0;
            player.isJumping = false;
            gameScoreText.textContent = `Issues Resolved: 0`;
            gameHighScoreText.textContent = `Record: ${highScore}`;
            if (gameOverText) gameOverText.textContent = 'Looks like the help desk got overwhelmed.';
            gameOverScreen.classList.add('hidden');
            gameMilestoneBanner.classList.remove('active');
            if (coffeeIndicator) coffeeIndicator.classList.remove('active');
            ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            animate();
        }

        function endGame(message) {
            gameActive = false;
            isGameOver = true;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('it_support_rush_highscore', highScore);
                gameHighScoreText.textContent = `Record: ${highScore}`;
            }
            if (message && gameOverText) {
                gameOverText.textContent = message;
            }
            let milestoneMsg = 'Try again to reach the milestones!';
            if (score >= 1000) {
                milestoneMsg = '🎉 Milestone Reached: IT Support Legend!';
            } else if (score >= 500) {
                milestoneMsg = '🎉 Milestone Reached: Help Desk Hero!';
            } else if (score >= 250) {
                milestoneMsg = '🎉 Milestone Reached: You\'re on Fire!';
            } else if (score >= 100) {
                milestoneMsg = '🎉 Milestone Reached: Great Troubleshooting!';
            }
            gameMilestoneText.textContent = milestoneMsg;
            gameOverScreen.classList.remove('hidden');
        }

        function handleLogoClick(e) {
            const now = Date.now();
            if (now - lastClickTime > timeLimit) {
                clickCount = 0;
            }
            clickCount++;
            lastClickTime = now;
            if (clickCount >= clickLimit) {
                e.preventDefault();
                clickCount = 0;
                openGame();
            }
        }

        // Attach click counts to all header logos
        navLogos.forEach(logo => {
            logo.addEventListener('click', handleLogoClick);
        });
        const milestones = [
            { score: 100, message: 'Great Troubleshooting!', class: 'milestone-100' },
            { score: 250, message: "You're on Fire!", class: 'milestone-250' },
            { score: 500, message: 'Help Desk Hero!', class: 'milestone-500' },
            { score: 1000, message: 'IT Support Legend!', class: 'milestone-1000' }
        ];
        let triggeredMilestones = {};

        function showMilestone(milestone) {
            if (triggeredMilestones[milestone.score]) return;
            triggeredMilestones[milestone.score] = true;

            gameMilestoneBanner.textContent = `${milestone.score} - ${milestone.message}`;
            gameMilestoneBanner.className = `milestone-banner active ${milestone.class}`;
            
            setTimeout(() => {
                gameMilestoneBanner.classList.remove('active');
            }, 3000);
        }

        function checkMilestones() {
            milestones.forEach(m => {
                if (score >= m.score && !triggeredMilestones[m.score]) {
                    showMilestone(m);
                }
            });
        }

        function openGame() {
            gameModal.classList.add('active');
            startGame();
        }

        function closeGame() {
            gameActive = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            gameModal.classList.remove('active');
        }

        // Close game button
        closeGameBtn.addEventListener('click', closeGame);

        // Restart game button
        restartGameBtn.addEventListener('click', startGame);

        // Jump handlers (spacebar/up-arrow/touch)
        window.addEventListener('keydown', (e) => {
            if (gameModal.classList.contains('active')) {
                if (e.key === ' ' || e.key === 'ArrowUp') {
                    e.preventDefault(); // prevent scrolling
                    player.jump();
                }
            }
        });

        // Touch tap or click inside canvas container to jump
        gameCanvas.addEventListener('touchstart', (e) => {
            if (gameModal.classList.contains('active')) {
                e.preventDefault();
                player.jump();
            }
        });
        
        gameCanvas.addEventListener('mousedown', (e) => {
            if (gameModal.classList.contains('active')) {
                player.jump();
            }
        });

        // Esc key close
        window.addEventListener('keydown', (e) => {
            if (gameModal.classList.contains('active') && e.key === 'Escape') {
                closeGame();
            }
        });

        restartGameBtn.addEventListener('click', startGame);

        // Jump handlers (spacebar/up-arrow/touch)
        window.addEventListener('keydown', (e) => {
            if (gameModal.classList.contains('active')) {
                if (e.key === ' ' || e.key === 'ArrowUp') {
                    e.preventDefault(); // prevent scrolling
                    player.jump();
                }
            }
        });

        // Touch tap or click inside canvas container to jump
        gameCanvas.addEventListener('touchstart', (e) => {
            if (gameModal.classList.contains('active')) {
                e.preventDefault();
                player.jump();
            }
        });
        
        gameCanvas.addEventListener('mousedown', (e) => {
            if (gameModal.classList.contains('active')) {
                player.jump();
            }
        });

        // Esc key close
        window.addEventListener('keydown', (e) => {
            if (gameModal.classList.contains('active') && e.key === 'Escape') {
                closeGame();
            }
        });
    })();
});

