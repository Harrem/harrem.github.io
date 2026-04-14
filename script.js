// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


// GSAP Animations
document.addEventListener("DOMContentLoaded", () => {
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero Text Reveal
    const tl = gsap.timeline();
    
    tl.from(".reveal-text", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out"
    })
    .from(".reveal-opacity", {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.5")
    .from(".glass-nav", {
        y: -100,
        duration: 0.8,
        ease: "power3.out"
    }, "-=1");

    // Remove loading class
    document.body.classList.remove("loading");

    // Bento Grid Animations
    const cards = document.querySelectorAll(".bento-card");
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.05,
            ease: "power3.out"
        });
    });

    // Project Parallax/Fade
    const projects = document.querySelectorAll(".project-item");
    projects.forEach((item) => {
        gsap.from(item.querySelector(".project-image-wrapper"), {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
            },
            scale: 0.9,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
        
        gsap.from(item.querySelector(".project-info"), {
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
            },
            x: item.classList.contains("reverse") ? -50 : 50,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "power3.out"
        });
    });

    // Custom Cursor
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with lag (using GSAP for smoothness)
        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Cursor Interactions
    const interactiveElements = document.querySelectorAll("a, button, .bento-card");
    interactiveElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            gsap.to(cursorOutline, {
                scale: 1.5,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderColor: "transparent",
                duration: 0.2
            });
        });
        el.addEventListener("mouseleave", () => {
             gsap.to(cursorOutline, {
                scale: 1,
                backgroundColor: "transparent",
                borderColor: "rgba(255, 255, 255, 0.5)",
                duration: 0.2
            });
        });
    });

    // Smooth Scroll for Anchor Links (Lenis)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -100, // Offset for fixed header
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease out
                    lock: true,
                    force: true
                });
            }
        });
    });

    // ===== Project Detail Modal =====
    const projectData = {
        transcanada: {
            category: 'Full-Stack Solution',
            title: 'Transcanada Export',
            subtitle: 'A comprehensive car export platform built for Transcanada Export. The project includes a full marketing website with landing page, portfolio, contact, and gallery sections. A cross-platform mobile app keeps customers informed about their car export status with real-time push notifications. An admin panel provides full control over car inventory, customer management, and notification dispatch.',
            heroImage: 'assets/img/transcanada-hero.jpg',
            techStack: ['Flutter', 'Laravel', 'Firebase Cloud Messaging', 'MySQL', 'REST API', 'Blade Templates', 'HTML/CSS/JS'],
            features: [
                'Responsive marketing website',
                'Car portfolio & gallery showcase',
                'Mobile app for export status tracking',
                'Push notifications via FCM',
                'Admin panel for car & customer management',
                'Contact forms & inquiry system',
                'Real-time status updates',
                'Image gallery management'
            ],
            gallery: [
                'assets/img/transcanada-web.jpg',
                'assets/img/transcanada-mobile.jpg',
            ],
            links: [
                { label: 'Visit Website', url: 'https://transcanadaexport.com', primary: true },
            ]
        },
        smartretail: {
            category: 'Desktop Application',
            title: 'SmartRetail',
            subtitle: 'A comprehensive retail management system designed for small businesses. SmartRetail provides everything a shop needs — from point-of-sale and inventory tracking to supplier and customer debt management, expense logging, sales history, and revenue reporting. Built as a desktop application with multi-user support for managers and employees.',
            heroImage: 'assets/img/smartretail-hero.jpg',
            techStack: ['Electron.js', 'TypeScript', 'ShadCN UI', 'SQLite', 'React', 'Node.js', 'Tailwind CSS'],
            features: [
                'Multi-user roles (Manager & Employee)',
                'Point of Sale (POS) system',
                'Inventory management',
                'Supplier & customer management',
                'Customer & supplier debt tracking',
                'Expense logging & categorization',
                'Sales history & reporting',
                'Revenue & procurement analytics'
            ],
            gallery: [
                'assets/img/smartretail-1.jpg',
                'assets/img/smartretail-2.jpg',
                'assets/img/smartretail-3.jpg'
            ],
            links: []
        },
        mrtravel: {
            category: 'Flutter App',
            title: 'mrtravel App',
            subtitle: 'A personalized trip planning application that provides real-time updates and travel recommendations. Built with Flutter for a seamless cross-platform experience.',
            heroImage: 'assets/img/Portfolio-0.png',
            techStack: ['Flutter', 'Dart', 'REST API'],
            features: [
                'Personalized trip planning',
                'Real-time travel updates',
                'Cross-platform (iOS & Android)',
                'Intuitive booking interface'
            ],
            gallery: [],
            links: [
                { label: 'App Store', url: 'https://apps.apple.com/us/app/mrtravel/id6473445431', primary: true },
            ]
        },
        arwayfinding: {
            category: 'Unity / AR',
            title: 'AR Wayfinding',
            subtitle: 'A next-generation indoor navigation system using Augmented Reality markers and pathfinding algorithms. Built with Unity for immersive real-world wayfinding experiences.',
            heroImage: 'assets/img/Portfolio-1.jpg',
            techStack: ['Unity', 'C#', 'AR Foundation', 'Vuforia'],
            features: [
                'AR-based indoor navigation',
                'Real-time pathfinding algorithms',
                'Marker-based positioning',
                'Immersive user experience'
            ],
            gallery: [],
            links: [
                { label: 'View Code', url: 'https://github.com/Harrem/ArWayfindingProject', primary: true },
            ]
        },
        realtimechat: {
            category: 'Firebase',
            title: 'Real-time Chat',
            subtitle: 'An instant messaging application with seamless real-time synchronization powered by Firebase. Supports rich messaging features and a clean, modern UI.',
            heroImage: 'assets/img/Portfolio-5.jpg',
            techStack: ['Flutter', 'Firebase', 'Cloud Firestore', 'Firebase Auth'],
            features: [
                'Real-time message sync',
                'User authentication',
                'Rich messaging features',
                'Online/offline status'
            ],
            gallery: [],
            links: [
                { label: 'View Code', url: 'https://github.com/Harrem/messagingApp', primary: true },
            ]
        }
    };

    // Modal elements
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal.querySelector('.modal-backdrop');
    const modalScrollEl = modal.querySelector('.modal-scroll');

    // Block Lenis from intercepting scroll events inside the modal
    modalScrollEl.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
    modalScrollEl.addEventListener('touchmove', (e) => { e.stopPropagation(); }, { passive: true });
    modal.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
    modal.addEventListener('touchmove', (e) => { e.stopPropagation(); }, { passive: true });

    function openProjectModal(projectKey) {
        const data = projectData[projectKey];
        if (!data) return;

        // Populate modal
        document.getElementById('modalHeroImg').src = data.heroImage;
        document.getElementById('modalHeroImg').alt = data.title;
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalSubtitle').textContent = data.subtitle;

        // Tech Stack
        const techContainer = document.getElementById('modalTechStack');
        techContainer.innerHTML = data.techStack.map(t => `<span class="tag">${t}</span>`).join('');

        // Features
        const featuresContainer = document.getElementById('modalFeatures');
        featuresContainer.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

        // Gallery
        const galleryContainer = document.getElementById('modalGallery');
        if (data.gallery.length > 0) {
            galleryContainer.innerHTML = data.gallery.map(img => 
                `<div class="modal-gallery-item"><img src="${img}" alt="${data.title}" loading="lazy"></div>`
            ).join('');
            galleryContainer.parentElement.style.display = '';
        } else {
            galleryContainer.innerHTML = '';
            galleryContainer.parentElement.style.display = 'none';
        }

        // Actions/Links
        const actionsContainer = document.getElementById('modalActions');
        if (data.links.length > 0) {
            actionsContainer.innerHTML = data.links.map(link => {
                const cls = link.primary ? 'primary-action' : 'secondary-action';
                return `<a href="${link.url}" target="_blank" class="${cls}">${link.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </a>`;
            }).join('');
            actionsContainer.style.display = '';
        } else {
            actionsContainer.innerHTML = '';
            actionsContainer.style.display = 'none';
        }

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        lenis.stop();

        // Reset scroll position
        modal.querySelector('.modal-scroll').scrollTop = 0;
    }

    function closeProjectModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        lenis.start();
    }

    // Event listeners for project items
    document.querySelectorAll('.project-item[data-project]').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking an actual external link
            if (e.target.closest('a[href^="http"]')) return;
            const projectKey = item.dataset.project;
            openProjectModal(projectKey);
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeProjectModal);
    modalBackdrop.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });

});
