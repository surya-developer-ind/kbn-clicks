let galleryData = {};
let heroData = { desktop: [], mobile: [] };

document.addEventListener('DOMContentLoaded', async () => {

    try {
        const [galleryRes, heroRes] = await Promise.all([
            fetch('gallery.json').catch(() => null),
            fetch('hero.json').catch(() => null)
        ]);
        if (galleryRes && galleryRes.ok) galleryData = await galleryRes.json();
        if (heroRes && heroRes.ok) heroData = await heroRes.json();
    } catch (e) {
        console.error('Failed to load gallery data:', e);
    }

    // 0. Hero Slider Initialization
    const heroSlider = document.getElementById('heroSlider');
    if (heroSlider) {
        const isMobile = window.innerWidth <= 768;
        const hasMobileImages = heroData.mobile && heroData.mobile.length > 0;
        
        let landingImages = (isMobile && hasMobileImages) ? [...heroData.mobile] : [...(heroData.desktop || [])];
        const imagePath = (isMobile && hasMobileImages) ? 'Landing/Hero/Mobile/' : 'Landing/Hero/';
        
        // Shuffle images array
        landingImages.sort(() => 0.5 - Math.random());
        
        let currentSlide = 0;
        
        // Inject images
        landingImages.forEach((imgSrc, index) => {
            const img = document.createElement('img');
            img.src = `${imagePath}${imgSrc}`;
            img.classList.add('slider-img');
            if (index === 0) img.classList.add('active');
            heroSlider.appendChild(img);
        });

        // Hide Preloader once first image is loaded
        const preloader = document.getElementById('preloader');
        if (preloader) {
            const firstImg = heroSlider.querySelector('img.active');
            if (firstImg) {
                if (firstImg.complete) {
                    preloader.classList.add('loaded');
                } else {
                    firstImg.addEventListener('load', () => {
                        preloader.classList.add('loaded');
                    });
                    // Fallback if image fails or takes too long
                    setTimeout(() => preloader.classList.add('loaded'), 6000);
                }
            } else {
                preloader.classList.add('loaded');
            }
        }

        // Setup interval to change photo every 5 seconds
        if (landingImages.length > 1) {
            setInterval(() => {
                const slides = heroSlider.querySelectorAll('.slider-img');
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 5000);
        }
    }
    // 1. Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        // Animate hamburger icon
        const spans = menuBtn.querySelectorAll('span');
        if (mobileMenu.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            const spans = menuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide on scroll down, show on scroll up
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollY = window.scrollY;
    });

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // 4. Number Counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const updateCount = () => {
                    const inc = target / 50; // adjust speed
                    if (count < target) {
                        count += inc;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(updateCount, 40);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 5. Parallax Effect
    const heroImg = document.querySelector('.hero-img-wrapper');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
        }
    });

    // 6. Floating Petals
    const petalsContainer = document.getElementById('petals');
    const colors = ['#F3EAE7', '#D8B8B1', '#ffffff'];
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.style.position = 'absolute';
        petal.style.width = Math.random() * 15 + 10 + 'px';
        petal.style.height = Math.random() * 10 + 5 + 'px';
        petal.style.background = colors[Math.floor(Math.random() * colors.length)];
        petal.style.borderRadius = '50% 0 50% 0';
        petal.style.opacity = Math.random() * 0.5 + 0.3;
        petal.style.left = Math.random() * 100 + '%';
        petal.style.top = -20 + 'px';
        
        // Random fall speed and rotation
        const fallDuration = Math.random() * 10 + 10; // 10 to 20s
        const rotation = Math.random() * 360;
        
        petal.animate([
            { transform: `translateY(0) rotate(0deg) translateX(0)`, opacity: petal.style.opacity },
            { transform: `translateY(120vh) rotate(${rotation + 360}deg) translateX(${Math.random() * 100 - 50}px)`, opacity: 0 }
        ], {
            duration: fallDuration * 1000,
            easing: 'linear'
        });
        
        petalsContainer.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, fallDuration * 1000);
    }
    
    setInterval(createPetal, 2000); // Create a petal every 2 seconds

    // 7. Lightbox / Modal Logic
    const categoryCards = document.querySelectorAll('.category-card');
    const modal = document.getElementById('galleryModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalGallery = document.getElementById('modalGallery');
    const modalCategoryTitle = document.getElementById('modalCategoryTitle');

    // Access galleryData from data.js
    // Format: galleryData = { "Haldhi": ["img1.png", ...], ... }
    
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const category = card.getAttribute('data-category');
            openModal(category);
        });
    });

    closeModalBtn.addEventListener('click', () => {
        closeModal();
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal(category) {
        modalCategoryTitle.innerText = category;
        modalGallery.innerHTML = ''; // Clear previous

        if (galleryData && galleryData[category] && galleryData[category].length > 0) {
            const images = galleryData[category];
            images.forEach((imgFile, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.style.opacity = '0';
                imgContainer.style.transform = 'translateY(20px)';
                imgContainer.style.transition = `all 0.5s ease ${index * 0.1}s`;

                // Dynamically assign random masonry shapes
                const rand = Math.random();
                if (rand > 0.8) {
                    imgContainer.classList.add('large');
                } else if (rand > 0.6) {
                    imgContainer.classList.add('wide');
                } else if (rand > 0.4) {
                    imgContainer.classList.add('tall');
                }

                const img = document.createElement('img');
                img.src = `${category}/${imgFile}`;
                img.alt = `${category} photo ${index + 1}`;
                img.loading = 'lazy';
                
                imgContainer.appendChild(img);
                modalGallery.appendChild(imgContainer);

                // Trigger animation after adding to DOM
                setTimeout(() => {
                    imgContainer.style.opacity = '1';
                    imgContainer.style.transform = 'translateY(0)';
                }, 10);
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.style.gridColumn = '1 / -1';
            emptyState.style.textAlign = 'center';
            emptyState.style.padding = '50px 0';
            emptyState.style.fontFamily = 'var(--font-heading)';
            emptyState.style.fontSize = '2rem';
            emptyState.style.color = 'var(--light-text)';
            emptyState.innerText = 'No images available.';
            modalGallery.appendChild(emptyState);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalGallery.innerHTML = '';
        }, 500); // Clear after fade out
    }
});
