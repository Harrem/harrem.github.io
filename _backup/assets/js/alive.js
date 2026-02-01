/* 
  Alive UX - Optimized Physics Engine
  Author: Harrem M Jalal (Antigravity Update)
  Optimization: RequestAnimationFrame, Caching, & LERP
*/

document.addEventListener('DOMContentLoaded', () => {
    initOptimizedAlive();
    initScrollReveal();
});

function initOptimizedAlive() {
    const cards = document.querySelectorAll('.bento-card');
    const cursor = document.querySelector('.custom-cursor');
    const body = document.body;

    // State management
    let mouse = { x: 0, y: 0 };
    let cursorState = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let isHoveringCard = false;

    // Cache card data to prevent layout thrashing
    let cardCache = new Map();

    // Resize observer to update cache only when necessary
    const resizeObserver = new ResizeObserver(() => {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            cardCache.set(card, rect);
        });
    });

    cards.forEach(card => {
        resizeObserver.observe(card);
        cardCache.set(card, card.getBoundingClientRect());

        // Tilt State
        card.dataset.rotateX = 0;
        card.dataset.rotateY = 0;

        card.addEventListener('mouseenter', () => {
            isHoveringCard = true;
            cursor.classList.add('cursor-hover');
            cardCache.set(card, card.getBoundingClientRect());
        });

        card.addEventListener('mouseleave', () => {
            isHoveringCard = false;
            cursor.classList.remove('cursor-hover');
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // Single passive listener for mouse position
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        cursorState.targetX = e.clientX;
        cursorState.targetY = e.clientY;
    }, { passive: true });

    // Animation Loop (60fps synced)
    function animate() {
        // 1. Cursor Physics (Lerp)
        cursorState.x += (cursorState.targetX - cursorState.x) * 0.15;
        cursorState.y += (cursorState.targetY - cursorState.y) * 0.15;

        if (cursor) {
            cursor.style.transform = `translate(${cursorState.x}px, ${cursorState.y}px)`;
        }

        // 2. Spotlight REMOVED for performance

        // 3. Card Tilt Logic
        if (isHoveringCard) {
            cards.forEach(card => {
                if (card.matches(':hover')) {
                    const rect = cardCache.get(card);
                    if (!rect) return;

                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    const mouseX = mouse.x;
                    const mouseY = mouse.y;

                    const rotateX = ((mouseY - centerY) / (rect.height / 2)) * -5;
                    const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 5;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
                }
            });
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Update cache on scroll
    window.addEventListener('scroll', () => {
        cards.forEach(card => cardCache.set(card, card.getBoundingClientRect()));
    }, { passive: true });
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bento-card').forEach((el, index) => {
        el.style.transitionDelay = `${index * 50}ms`; // Faster stagger
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });
}
