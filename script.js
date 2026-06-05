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
});
