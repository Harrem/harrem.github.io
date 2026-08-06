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


// GSAP Animations & Dynamic Project Loading
document.addEventListener("DOMContentLoaded", async () => {
    
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

    // About Section Card Animations
    const aboutCards = document.querySelectorAll(".about-card");
    aboutCards.forEach((card, index) => {
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

    // ===== FETCH & RENDER PROJECTS =====
    let projectsData = [];
    try {
        const response = await fetch('./projects.json');
        projectsData = await response.json();
    } catch (err) {
        console.error('Failed to load projects:', err);
    }

    // Build category filter buttons
    const filtersContainer = document.getElementById('projectFilters');
    const categories = [...new Set(projectsData.map(p => p.category))];
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filtersContainer.appendChild(btn);
    });

    // Render project cards
    const grid = document.getElementById('projectsGrid');

    function renderProjects(filter = 'all') {
        grid.innerHTML = '';
        const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter);

        filtered.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.project = project.slug;
            card.style.animationDelay = `${index * 0.05}s`;

            const techPreview = project.techStack.slice(0, 3).join(' · ');
            const techMore = project.techStack.length > 3 ? ` +${project.techStack.length - 3}` : '';

            const coverHTML = project.cover
                ? `<img src="${project.cover}" alt="${project.title}" loading="lazy" onerror="this.parentElement.classList.add('no-cover')">`
                : '';

            card.innerHTML = `
                <div class="project-card-image${!project.cover ? ' no-cover' : ''}">
                    ${coverHTML}
                    <div class="project-card-overlay"></div>
                    <span class="project-card-category">${project.category}</span>
                </div>
                <div class="project-card-body">
                    <div class="project-card-year">${project.year}</div>
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-summary">${project.summary}</p>
                    <div class="project-card-tech">${techPreview}<span class="tech-more">${techMore}</span></div>
                    <span class="project-card-link">
                        View Details
                        <svg class="arrow-mini" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </span>
                </div>
            `;
            grid.appendChild(card);
        });

        // Animate cards in
        gsap.from('.project-card', {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "all"
        });

        // Attach click handlers
        document.querySelectorAll('.project-card[data-project]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a[href^="http"]')) return;
                const slug = card.dataset.project;
                const project = projectsData.find(p => p.slug === slug);
                if (project) openProjectModal(project);
            });
        });
    }

    renderProjects();

    // Filter click handlers
    filtersContainer.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;
        filtersContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProjects(e.target.dataset.filter);
    });

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    window.addEventListener("mousemove", (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // Cursor Interactions
    const interactiveElements = document.querySelectorAll("a, button, .about-card, .project-card");
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
                    offset: -100,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    lock: true,
                    force: true
                });
            }
        });
    });

    // ===== PROJECT DETAIL MODAL =====
    const modal = document.getElementById('projectModal');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = modal.querySelector('.modal-backdrop');
    const modalScrollEl = modal.querySelector('.modal-scroll');

    // Block Lenis from intercepting scroll events inside the modal
    modalScrollEl.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
    modalScrollEl.addEventListener('touchmove', (e) => { e.stopPropagation(); }, { passive: true });
    modal.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });
    modal.addEventListener('touchmove', (e) => { e.stopPropagation(); }, { passive: true });

    // ===== INLINE IMAGE ZOOM =====
    // Single zoomable image overlay — no nested modal chrome
    const zoomOverlay = document.getElementById('imageZoomOverlay');
    const zoomImg = document.getElementById('zoomImg');
    const zoomCaption = document.getElementById('zoomCaption');
    let zoomImages = []; // all images for the current project
    let zoomIndex = 0;

    function openZoom(images, index) {
        zoomImages = images;
        zoomIndex = index;
        renderZoomImage();
        zoomOverlay.classList.add('active');
        document.body.classList.add('zoom-open');
    }

    function renderZoomImage() {
        const current = zoomImages[zoomIndex];
        zoomImg.src = current.src;
        zoomImg.alt = current.alt;
        zoomCaption.textContent = current.caption || '';
        // Update counter
        document.getElementById('zoomCounter').textContent = `${zoomIndex + 1} / ${zoomImages.length}`;
        // Hide nav if only 1 image
        const nav = zoomOverlay.querySelectorAll('.zoom-nav');
        nav.forEach(b => b.style.display = zoomImages.length > 1 ? '' : 'none');
    }

    function closeZoom() {
        zoomOverlay.classList.remove('active');
        document.body.classList.remove('zoom-open');
    }

    function zoomPrev() {
        zoomIndex = (zoomIndex - 1 + zoomImages.length) % zoomImages.length;
        renderZoomImage();
    }

    function zoomNext() {
        zoomIndex = (zoomIndex + 1) % zoomImages.length;
        renderZoomImage();
    }

    // Zoom overlay events
    document.getElementById('zoomClose').addEventListener('click', closeZoom);
    document.getElementById('zoomPrev').addEventListener('click', zoomPrev);
    document.getElementById('zoomNext').addEventListener('click', zoomNext);
    zoomOverlay.addEventListener('click', (e) => {
        if (e.target === zoomOverlay || e.target.classList.contains('zoom-backdrop')) closeZoom();
    });

    // Keyboard for zoom
    document.addEventListener('keydown', (e) => {
        if (!zoomOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeZoom();
        if (e.key === 'ArrowLeft') zoomPrev();
        if (e.key === 'ArrowRight') zoomNext();
    });

    // Touch swipe for zoom on mobile
    let touchStartX = 0;
    zoomOverlay.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    zoomOverlay.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) dx < 0 ? zoomNext() : zoomPrev();
    }, { passive: true });

    // ===== MODAL OPEN / CLOSE =====
    let currentModalData = null;

    function openProjectModal(data) {
        currentModalData = data;

        // Populate header
        document.getElementById('modalCategory').textContent = data.category;
        document.getElementById('modalYear').textContent = data.year;
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalRole').textContent = data.role || '';
        document.getElementById('modalSubtitle').textContent = data.summary;

        // Outcome Highlight
        const highlightSection = document.getElementById('modalHighlightSection');
        const highlightEl = document.getElementById('modalHighlight');
        if (data.outcomeHighlight) {
            highlightEl.textContent = data.outcomeHighlight;
            highlightSection.style.display = '';
        } else {
            highlightSection.style.display = 'none';
        }

        // Tech Stack
        document.getElementById('modalTechStack').innerHTML =
            data.techStack.map(t => `<span class="tag">${t}</span>`).join('');

        // Features
        const featuresContainer = document.getElementById('modalFeatures');
        if (data.features && data.features.length > 0) {
            featuresContainer.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
            featuresContainer.closest('.modal-section').style.display = '';
        } else {
            featuresContainer.innerHTML = '';
            featuresContainer.closest('.modal-section').style.display = 'none';
        }

        // Gallery — full-width showcase images, click to zoom
        const gallerySection = document.getElementById('modalGallery').closest('.modal-section');
        const galleryContainer = document.getElementById('modalGallery');

        // Build image list: hero cover + gallery images (deduplicated)
        const allImages = data.images && data.images.length > 0 ? data.images : (data.cover ? [{ src: data.cover, alt: data.title, caption: data.title }] : []);

        if (allImages.length > 0) {
            galleryContainer.innerHTML = allImages.map((img, i) => `
                <div class="showcase-image" data-index="${i}">
                    <img src="${img.src}" alt="${img.alt}" loading="${i === 0 ? 'eager' : 'lazy'}" decoding="async">
                    <div class="showcase-zoom-hint">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    </div>
                    ${img.caption ? `<p class="showcase-caption">${img.caption}</p>` : ''}
                </div>
            `).join('');

            // Attach zoom click handlers
            galleryContainer.querySelectorAll('.showcase-image').forEach((el) => {
                el.addEventListener('click', () => {
                    openZoom(allImages, parseInt(el.dataset.index, 10));
                });
            });

            gallerySection.style.display = '';
        } else {
            galleryContainer.innerHTML = '';
            gallerySection.style.display = 'none';
        }

        // Actions/Links
        const actionsContainer = document.getElementById('modalActions');
        if (data.links && data.links.length > 0) {
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

        // Show modal + hash routing
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        lenis.stop();
        history.pushState({ project: data.slug }, '', `#${data.slug}`);
        modal.querySelector('.modal-scroll').scrollTop = 0;
    }

    function closeProjectModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        lenis.start();
        if (window.location.hash) history.pushState({}, '', window.location.pathname);
    }

    // Close modal
    modalClose.addEventListener('click', closeProjectModal);
    modalBackdrop.addEventListener('click', closeProjectModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active') && !zoomOverlay.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // Hash-based deep linking — open modal if URL has a project hash on load
    function openFromHash() {
        const hash = window.location.hash.replace('#', '');
        if (!hash) return;
        const project = projectsData.find(p => p.slug === hash);
        if (project) openProjectModal(project);
    }
    openFromHash();
    window.addEventListener('popstate', () => {
        if (!window.location.hash && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open');
            lenis.start();
        } else {
            openFromHash();
        }
    });

    // ===== FOOTER SECTION ANIMATION =====
    gsap.from('.footer-top', {
        scrollTrigger: {
            trigger: 'footer',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

});
