export interface ProjectImage {
    src: string;
    alt: string;
    caption?: string;
}

export interface Project {
    slug: string;
    title: string;
    category: string;
    role: string;
    year: number;
    summary: string;
    cover: string;
    images: ProjectImage[];
    problem: string;
    process: string[];
    outcome: string;
    outcomeHighlight: string;
    techStack: string[];
}

function projectImages(
    slug: string,
    items: { alt: string; caption?: string }[]
): ProjectImage[] {
    return items.map((item, i) => ({
        src: `/images/${slug}/${String(i + 1).padStart(2, "0")}.png`,
        alt: item.alt,
        caption: item.caption ?? item.alt,
    }));
}

export const projects: Project[] = [
    {
        slug: "transcanada-export",
        title: "Transcanada Export Platform",
        category: "Full-Stack System",
        role: "Lead Full-Stack Developer & Product Designer",
        year: 2025,
        summary: "End-to-end logistics & car export ecosystem — web platform, mobile tracking app, and real-time admin portal.",
        cover: "/images/transcanada-export/01.png",
        images: projectImages("transcanada-export", [
            { alt: "Transcanada Export platform overview", caption: "Platform overview" },
            { alt: "Featured Cars Gallery", caption: "Featured Cars Gallery" },
            { alt: "Transcanada-statement", caption: "Statement" },
            { alt: "Mobile tracking companion app", caption: "Mobile companion" },
            { alt: "Transcanada Mission", caption: "Mission" },
        ]),
        problem:
            "Vehicle export logistics were fragmented across legacy spreadsheets, manual WhatsApp updates, and paper documentation, causing tracking delays and customer distrust.",
        process: [
            "Architected a unified multi-surface system with a single API backend driving web, iOS/Android apps, and internal admin panels.",
            "Designed a simplified step-by-step export tracking interface for non-technical buyers.",
            "Implemented automated document generation and real-time status updates via WebSockets."
        ],
        outcome:
            "Reduced vehicle processing time by 65% and onboarded over 10,000 active buyers within the first 3 months of launch.",
        outcomeHighlight: "Shipped in 3 months · 65% faster processing",
        techStack: ["React", "Laravel", "Flutter", "TailwindCSS", "PostgreSQL"],
    },
    {
        slug: "eye-tracking-mouse-controller",
        title: "Eye Tracking Mouse Controller",
        category: "Computer Vision",
        role: "Python Developer",
        year: 2025,
        summary: "A desktop application that transforms eye movements into mouse cursor control using computer vision, enabling hands-free interaction through a standard webcam.",
        cover: "/images/eye-tracking-mouse-controller/01.png",
        images: projectImages("eye-tracking-mouse-controller", [
            { alt: "Eye tracking application overview", caption: "Application overview" },
            { alt: "Five-point calibration interface", caption: "Calibration flow" },
            { alt: "Real-time gaze-to-cursor mapping", caption: "Gaze tracking" },
            { alt: "Webcam capture and landmark detection", caption: "Face mesh detection" },
        ]),
        problem:
            "Traditional cursor interaction depends on physical input devices, making hands-free control difficult. The objective was to develop an accessible desktop application capable of accurately tracking eye movement and translating gaze into smooth, real-time cursor movement using only a webcam.",
        process: [
            "Built a real-time eye tracking pipeline using OpenCV and MediaPipe Face Mesh to detect facial landmarks and estimate iris position for gaze tracking.",
            "Implemented a five-point calibration system that maps each user's gaze range to screen coordinates, improving tracking precision across different users and displays.",
            "Applied exponential smoothing to minimize cursor jitter and produce a more stable, natural interaction experience during continuous eye movement.",
            "Integrated webcam capture, gaze estimation, calibration, and operating system mouse control into a lightweight Python desktop application with simple keyboard controls for calibration and reset."
        ],
        outcome:
            "Successfully developed a functional proof-of-concept capable of controlling the system mouse cursor through eye movement alone, providing accurate real-time tracking with calibration and smoothing for improved usability.",
        outcomeHighlight: "Hands-free mouse control using only a webcam.",
        techStack: [
            "Python",
            "OpenCV",
            "MediaPipe",
            "PyAutoGUI",
            "NumPy",
            "ScreenInfo"
        ],
    },
    {
        slug: "bidit",
        title: "BidIt",
        category: "Full-Stack Solution",
        role: "Full-Stack Developer & UI/UX Designer",
        year: 2026,
        summary: "A real-time auction platform that enables users to participate in live bidding through a Flutter mobile app powered by a Laravel backend with WebSocket broadcasting and automated product cataloging.",
        cover: "/images/bidit/01.png",
        images: projectImages("bidit", [
            { alt: "BidIt live auction home screen", caption: "Live auction home" },
            { alt: "Real-time bidding interface", caption: "Bidding interface" },
            { alt: "Admin dashboard and bid audit trail", caption: "Admin dashboard" },
            { alt: "Bidit landing page footer", caption: "Landing page footer" },
            { alt: "App profile screen", caption: "App Profile" },
        ]),
        problem:
            "Traditional online auction platforms often rely on periodic polling, resulting in delayed bid updates, missed opportunities during the final seconds of auctions, and poor user engagement. Sellers also spend excessive time creating listings manually, while administrators lack comprehensive audit trails and auction insights.",
        process: [
            "Designed and developed a complete auction ecosystem consisting of a Flutter mobile application, Laravel REST API, WebSocket server, and an administrative dashboard.",
            "Implemented real-time bidding using Laravel Reverb and Flutter WebSocket listeners, allowing every bid, price update, and auction event to synchronize instantly across connected devices.",
            "Integrated barcode cataloging to automatically retrieve product information, reducing the effort required for sellers to create auction listings.",
            "Built push notification workflows for outbid alerts, auction reminders, and winning notifications, while providing administrators with detailed bid histories and audit trails for dispute resolution and analytics."
        ],
        outcome:
            "Delivered a scalable real-time auction platform that provides instant bid synchronization, automated product listing, and comprehensive auction management, creating a seamless experience for buyers, sellers, and administrators.",
        outcomeHighlight: "Sub-second real-time bidding powered by WebSockets.",
        techStack: [
            "Flutter",
            "Laravel",
            "PHP",
            "MySQL",
            "Redis",
            "Laravel Reverb",
            "Firebase Cloud Messaging",
            "GetX"
        ],
    },
    {
        slug: "medianexus",
        title: "MediaNexus",
        category: "iOS Application",
        role: "iOS Developer & UI/UX Designer",
        year: 2026,
        summary: "A native iOS entertainment application that delivers a cinematic movie and TV discovery experience using SwiftUI, Combine, and Swift Concurrency, powered by the TMDb API.",
        cover: "/images/medianexus/01.png",
        images: projectImages("medianexus", [
            { alt: "MediaNexus cinematic home screen", caption: "Cinematic home" },
            { alt: "Movie detail with parallax hero", caption: "Detail hero" },
            { alt: "Cast and recommendations section", caption: "Cast & recommendations" },
            { alt: "Full-screen media gallery", caption: "Media gallery" },
        ]),
        problem:
            "Many media discovery applications suffer from slow loading, fragmented content presentation, and uninspiring interfaces. Sequential network requests increase waiting times, while users must navigate between multiple screens to access trailers, cast information, recommendations, and artwork.",
        process: [
            "Designed and developed a native iOS application using SwiftUI with the MVVM architecture, focusing on a cinematic browsing experience with smooth animations and modern interface patterns.",
            "Implemented parallel data loading using Swift Concurrency (`async/await` and `async let`) to fetch movie details, cast, recommendations, trailers, and images simultaneously, significantly improving perceived performance.",
            "Built reusable networking components using URLSession and JSONDecoder, providing efficient API communication, response caching, and scalable endpoint management with TMDb.",
            "Created immersive user interactions including parallax hero headers, auto-advancing carousels, animated rating indicators, full-screen media galleries, and real-time search and filtering."
        ],
        outcome:
            "Delivered a high-performance native iOS application that combines fast concurrent networking with a polished cinematic interface, allowing users to discover movies and TV shows through a responsive and visually engaging experience.",
        outcomeHighlight: "Parallel multi-endpoint loading for a seamless cinematic browsing experience.",
        techStack: [
            "Swift",
            "SwiftUI",
            "Combine",
            "Swift Concurrency",
            "MVVM",
            "URLSession",
            "TMDb API"
        ],
    },
    {
        slug: "topcars",
        title: "TopCars",
        category: "Full-Stack Solution",
        role: "Full-Stack Developer & UI/UX Designer",
        year: 2026,
        summary: "A multi-language automotive marketplace that enables users to browse, buy, sell, and rent vehicles through a Flutter mobile application powered by a secure Laravel REST API.",
        cover: "/images/topcars/01.png",
        images: projectImages("topcars", [
            { alt: "TopCars marketplace home", caption: "Marketplace home" },
            { alt: "Vehicle listing detail page", caption: "Listing detail" },
            { alt: "Advanced search and filters", caption: "Search & filters" },
            { alt: "Multi-language RTL interface", caption: "RTL localization" },
            { alt: "Seller listing submission flow", caption: "Listing submission" },
        ]),
        problem:
            "Regional automotive marketplaces often provide fragmented experiences, lack proper localization, and offer outdated interfaces that make buying, selling, and renting vehicles unnecessarily difficult. Users need a unified, mobile-first platform that supports multiple languages while serving both individuals and dealerships.",
        process: [
            "Designed and developed a complete full-stack solution consisting of a Flutter mobile application and a Laravel REST API with secure OAuth2 authentication.",
            "Built a responsive mobile experience supporting English, Sorani Kurdish, and Arabic, including full RTL compatibility and dynamic light/dark themes.",
            "Implemented vehicle browsing across new, used, and rental categories with advanced search, filtering, watchlists, authentication, and listing submission workflows.",
            "Designed the backend architecture to provide secure RESTful APIs for user management, vehicle listings, authentication, and future transaction workflows while keeping the platform scalable for upcoming features."
        ],
        outcome:
            "Developed a modern automotive marketplace that consolidates buying, selling, and renting vehicles into a single localized platform, establishing a scalable foundation for future marketplace features and integrations.",
        outcomeHighlight: "Unified marketplace for buying, selling, and renting vehicles.",
        techStack: [
            "Flutter",
            "Laravel",
            "PHP",
            "Riverpod",
            "Dio",
            "Hive",
            "Laravel Passport",
            "MySQL"
        ],
    },
    {
        slug: "sportstream",
        title: "SPORTSTREAM",
        category: "Web Application",
        role: "Frontend Developer & UI/UX Designer",
        year: 2026,
        summary: "A lightweight sports streaming hub designed for Smart TVs, desktops, and mobile devices, featuring a cinematic interface, spatial remote navigation, and real-time sports discovery without relying on heavy frontend frameworks.",
        cover: "/images/sportstream/01.png",
        images: projectImages("sportstream", [
            { alt: "SPORTSTREAM featured matches view", caption: "Featured matches" },
            { alt: "Smart TV spatial navigation layout", caption: "TV navigation" },
            { alt: "Live stream player interface", caption: "Stream player" },
        ]),
        problem:
            "Sports fans often rely on multiple websites to find live matches, schedules, and streaming links, resulting in fragmented experiences, intrusive advertisements, and poor usability on Smart TVs. Most existing platforms are built for mouse interaction and perform poorly on lower-powered devices.",
        process: [
            "Designed a 10-foot TV interface optimized for Smart TVs, media centers, keyboards, and traditional desktop navigation, emphasizing readability and effortless remote interaction.",
            "Built the application entirely with semantic HTML, modern CSS, and vanilla JavaScript, eliminating framework overhead while maintaining fast performance and minimal resource usage.",
            "Implemented custom spatial navigation, allowing users to browse the interface naturally using directional keys, gamepads, or TV remotes with automatic focus management and smooth scrolling.",
            "Integrated live sports APIs to display featured matches, upcoming events, categories, search functionality, embedded stream playback, and persistent viewing history using localStorage."
        ],
        outcome:
            "Delivered a fast, responsive sports streaming hub that provides a modern viewing experience across desktops and Smart TVs while maintaining excellent performance through a framework-free architecture.",
        outcomeHighlight: "Framework-free sports streaming platform optimized for Smart TVs.",
        techStack: [
            "HTML5",
            "CSS3",
            "JavaScript (ES6+)",
            "REST API",
            "LocalStorage"
        ],
    },
    {
        slug: "eid-passport-scanner",
        title: "eID & Passport Scanner",
        category: "Mobile Application",
        role: "Flutter Developer",
        year: 2025,
        summary: "A Flutter application that scans passports and electronic identity cards, validates MRZ data, and securely reads biometric information from NFC chips using the ICAO 9303 standard.",
        cover: "/images/eid-passport-scanner/01.png",
        images: projectImages("eid-passport-scanner", [
            { alt: "eID scanner home and scan flow", caption: "Scan flow" },
            { alt: "MRZ camera recognition interface & Document verification review screen", caption: "Document verification" },
            { alt: " NFC chip biometric read result", caption: "NFC biometric read" },
        ]),
        problem:
            "Identity verification often requires manually entering document information before reading NFC chips, making the process slow and error-prone. OCR inaccuracies can produce invalid MRZ data, causing authentication failures, while different document authentication standards require a reliable and seamless reading workflow.",
        process: [
            "Built a real-time MRZ scanning interface using Google ML Kit OCR to recognize passport and eID information directly from the device camera.",
            "Implemented intelligent OCR error correction and ICAO 9303 checksum validation to automatically detect and correct common recognition mistakes before authentication.",
            "Developed secure NFC communication that automatically authenticates using Basic Access Control (BAC) with fallback to Password Authenticated Connection Establishment (PACE) for improved compatibility across electronic identity documents.",
            "Created an interactive verification flow allowing users to review parsed information before securely extracting personal details, biometric portrait, and document data from the NFC chip."
        ],
        outcome:
            "Delivered a secure identity verification application capable of scanning MRZ data, validating document integrity, and reading biometric information from ICAO-compliant electronic passports and identity cards through a streamlined mobile experience.",
        outcomeHighlight: "End-to-end MRZ scanning and secure NFC biometric verification.",
        techStack: [
            "Flutter",
            "Dart",
            "Google ML Kit",
            "Flutter NFC Kit",
            "ICAO 9303",
            "PointyCastle",
            "Crypto"
        ],
    },

];