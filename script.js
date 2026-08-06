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

    // Block Lenis from intercepting scroll inside modal
    modalScrollEl.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    modalScrollEl.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
    modal.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    modal.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });

    // ===== GLOBAL IMAGE ZOOM =====
    // Attaching to window ensures it's callable from anywhere — no closure scope issues
    window._zoom = { images: [], index: 0 };

    window.openZoom = function(idx) {
        const imgs = window._zoom.images;
        if (!imgs || !imgs.length) return;
        window._zoom.index = Math.max(0, Math.min(idx, imgs.length - 1));

        const overlay = document.getElementById('imageZoomOverlay');
        const img     = document.getElementById('zoomImg');
        const caption = document.getElementById('zoomCaption');
        const counter = document.getElementById('zoomCounter');
        const nav     = overlay.querySelectorAll('.zoom-nav');

        const cur = imgs[window._zoom.index];
        img.src            = cur.src;
        img.alt            = cur.alt || '';
        caption.textContent = cur.caption || '';
        counter.textContent = `${window._zoom.index + 1} / ${imgs.length}`;
        nav.forEach(b => b.style.display = imgs.length > 1 ? '' : 'none');

        overlay.classList.add('active');
        document.body.classList.add('zoom-open');
    };

    window.closeZoom = function() {
        const overlay = document.getElementById('imageZoomOverlay');
        if (overlay) overlay.classList.remove('active');
        document.body.classList.remove('zoom-open');
    };

    window.zoomStep = function(dir) {
        const imgs = window._zoom.images;
        if (!imgs.length) return;
        window.openZoom((window._zoom.index + dir + imgs.length) % imgs.length);
    };

    // Wire zoom overlay buttons (static elements, bound once)
    document.getElementById('zoomClose').addEventListener('click', () => window.closeZoom());
    document.getElementById('zoomPrev').addEventListener('click', () => window.zoomStep(-1));
    document.getElementById('zoomNext').addEventListener('click', () => window.zoomStep(1));
    document.getElementById('imageZoomOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'imageZoomOverlay' || e.target.classList.contains('zoom-backdrop')) {
            window.closeZoom();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const overlay = document.getElementById('imageZoomOverlay');
        const isZoomOpen = overlay && overlay.classList.contains('active');
        const isModalOpen = modal.classList.contains('active');

        if (isZoomOpen) {
            if (e.key === 'Escape')     window.closeZoom();
            if (e.key === 'ArrowLeft')  window.zoomStep(-1);
            if (e.key === 'ArrowRight') window.zoomStep(1);
        } else if (isModalOpen && e.key === 'Escape') {
            closeProjectModal();
        }
    });

    // Touch swipe on zoom overlay
    let _zoomTouchX = 0;
    document.getElementById('imageZoomOverlay').addEventListener('touchstart', (e) => {
        _zoomTouchX = e.touches[0].clientX;
    }, { passive: true });
    document.getElementById('imageZoomOverlay').addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - _zoomTouchX;
        if (Math.abs(dx) > 50) window.zoomStep(dx < 0 ? 1 : -1);
    }, { passive: true });

    // ===== CAROUSEL HELPERS =====
    window._carousel = { timer: null };

    function buildCarousel(galleryContainer, allImages) {
        // Store images globally so openZoom can always reach them
        window._zoom.images = allImages;

        let activeIdx = 0;
        const showNav = allImages.length > 1;

        function render() {
            const cur = allImages[activeIdx];
            galleryContainer.innerHTML = `
                <div class="carousel-wrapper">
                    <div class="carousel-main-wrap">
                        <div class="carousel-main">
                            <img class="carousel-slide-img" src="${cur.src}" alt="${cur.alt || ''}" decoding="async" loading="eager">
                        </div>
                        <button class="carousel-expand-btn" data-action="expand" aria-label="View full screen">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                            <span>Expand</span>
                        </button>
                        ${showNav ? `
                            <button class="carousel-arrow carousel-prev" data-action="prev" aria-label="Previous">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                            </button>
                            <button class="carousel-arrow carousel-next" data-action="next" aria-label="Next">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                            </button>
                        ` : ''}
                    </div>
                    ${cur.caption ? `<p class="carousel-caption">${cur.caption}</p>` : ''}
                    ${showNav ? `
                        <div class="carousel-thumbnails">
                            ${allImages.map((img, i) => `
                                <button class="thumb-card ${i === activeIdx ? 'active' : ''}" data-action="thumb" data-index="${i}" aria-label="Screenshot ${i + 1}">
                                    <img src="${img.src}" alt="${img.alt || ''}" loading="lazy">
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>`;
        }

        // Single delegated listener — survives re-renders because it's on the outer container
        galleryContainer.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (!action) return;
            e.stopPropagation();

            if (action === 'expand') {
                window._zoom.index = activeIdx;
                window.openZoom(activeIdx);
            } else if (action === 'prev') {
                activeIdx = (activeIdx - 1 + allImages.length) % allImages.length;
                render();
                resetTimer();
            } else if (action === 'next') {
                activeIdx = (activeIdx + 1) % allImages.length;
                render();
                resetTimer();
            } else if (action === 'thumb') {
                activeIdx = parseInt(e.target.closest('[data-index]').dataset.index, 10);
                render();
                resetTimer();
            }
        });

        // Auto-scroll
        function startTimer() {
            if (!showNav) return;
            if (window._carousel.timer) clearInterval(window._carousel.timer);
            window._carousel.timer = setInterval(() => {
                if (document.getElementById('imageZoomOverlay')?.classList.contains('active')) return;
                activeIdx = (activeIdx + 1) % allImages.length;
                render();
            }, 3500);
        }

        function resetTimer() { startTimer(); }

        // Pause on hover
        galleryContainer.addEventListener('mouseenter', () => {
            if (window._carousel.timer) clearInterval(window._carousel.timer);
        });
        galleryContainer.addEventListener('mouseleave', startTimer);

        render();
        startTimer();
    }

    // ===== MODAL OPEN =====
    function openProjectModal(data) {
        // Stop previous carousel timer
        if (window._carousel.timer) { clearInterval(window._carousel.timer); window._carousel.timer = null; }

        document.getElementById('modalCategory').textContent  = data.category;
        document.getElementById('modalYear').textContent      = data.year;
        document.getElementById('modalTitle').textContent     = data.title;
        document.getElementById('modalRole').textContent      = data.role || '';
        document.getElementById('modalSubtitle').textContent  = data.summary;

        // Outcome highlight
        const hlSection = document.getElementById('modalHighlightSection');
        const hlEl      = document.getElementById('modalHighlight');
        if (data.outcomeHighlight) { hlEl.textContent = data.outcomeHighlight; hlSection.style.display = ''; }
        else { hlSection.style.display = 'none'; }

        // Tech stack
        document.getElementById('modalTechStack').innerHTML =
            data.techStack.map(t => `<span class="tag">${t}</span>`).join('');

        // Features
        const featEl = document.getElementById('modalFeatures');
        if (data.features && data.features.length) {
            featEl.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');
            featEl.closest('.modal-section').style.display = '';
        } else {
            featEl.innerHTML = '';
            featEl.closest('.modal-section').style.display = 'none';
        }

        // Gallery
        const gallerySection    = document.getElementById('modalGallery').closest('.modal-section');
        const galleryContainer  = document.getElementById('modalGallery');
        const allImages = data.images && data.images.length
            ? data.images
            : (data.cover ? [{ src: data.cover, alt: data.title, caption: data.title }] : []);

        if (allImages.length) {
            galleryContainer.innerHTML = '';
            buildCarousel(galleryContainer, allImages);
            gallerySection.style.display = '';
        } else {
            galleryContainer.innerHTML = '';
            gallerySection.style.display = 'none';
        }

        // Links
        const actionsEl = document.getElementById('modalActions');
        if (data.links && data.links.length) {
            actionsEl.innerHTML = data.links.map(link => {
                const cls = link.primary ? 'primary-action' : 'secondary-action';
                return `<a href="${link.url}" target="_blank" class="${cls}">${link.label}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg></a>`;
            }).join('');
            actionsEl.style.display = '';
        } else {
            actionsEl.innerHTML = '';
            actionsEl.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.classList.add('modal-open');
        lenis.stop();
        history.pushState({ project: data.slug }, '', `#${data.slug}`);
        modal.querySelector('.modal-scroll').scrollTop = 0;
    }

    function closeProjectModal() {
        if (window._carousel.timer) { clearInterval(window._carousel.timer); window._carousel.timer = null; }
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        lenis.start();
        if (window.location.hash) history.pushState({}, '', window.location.pathname);
    }

    modalClose.addEventListener('click', closeProjectModal);
    modalBackdrop.addEventListener('click', closeProjectModal);

    // Hash-based deep linking
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



    // ===== FOOTER ANIMATION =====
    gsap.from('.footer-top', {
        scrollTrigger: { trigger: 'footer', start: 'top 80%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, duration: 1, ease: 'power3.out'
    });

});

