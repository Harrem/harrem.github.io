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

});
