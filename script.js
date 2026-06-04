document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const welcomeContainer = document.querySelector('.welcome-container');
    const layerBg = document.querySelector('.layer-bg');
    const layerHole = document.querySelector('.layer-hole');
    const layerFgLeft = document.querySelector('.layer-fg-left');
    const layerFgRight = document.querySelector('.layer-fg-right');
    const uiContent = document.querySelector('.ui-content');
    
    const enterBtn = document.querySelector('.enter-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const iconVolOn = document.getElementById('icon-vol-on');
    const iconVolOff = document.getElementById('icon-vol-off');

    // === LOGIKA MUSIC TOGGLE DENGAN ICON ===
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            iconVolOn.style.display = 'block';
            iconVolOff.style.display = 'none';
        } else {
            bgMusic.pause();
            iconVolOn.style.display = 'none';
            iconVolOff.style.display = 'block';
        }
    });

    // === LOGIKA TRANSISI WELCOME SCREEN KE HOME ===
    enterBtn.addEventListener('click', () => {
        if (bgMusic) { bgMusic.play(); }

        const tl = gsap.timeline({
            onComplete: () => {
                welcomeContainer.style.display = 'none';
                
                document.body.style.overflow = 'auto'; 
                document.body.style.touchAction = 'auto'; 
                
                document.getElementById('scroll-wrapper').style.display = 'block';
                document.getElementById('pages-container').style.display = 'block';
                
                // Tampilkan Navigasi Bawah & Tombol Music Atas
                document.getElementById('bottom-nav-bar').style.display = 'flex';
                musicToggle.style.display = 'block';
                
                ScrollTrigger.refresh();
            }
        });

        tl.to(uiContent, { opacity: 0, duration: 0.4, ease: "power1.out" })
          .to(layerFgLeft, { xPercent: -150, duration: 2, ease: "power3.inOut" }, "-=0.2")
          .to(layerFgRight, { xPercent: 150, duration: 2, ease: "power3.inOut" }, "<")
          .to(layerHole, { scale: 4, opacity: 0, duration: 2, ease: "power3.inOut" }, "<")
          .to(layerBg, { scale: 3, opacity: 0, duration: 2, ease: "power3.inOut" }, "<");
    });

    // === INTERCEPT KLIK MENU NAVIGASI BAWAH (SCROLL OTOMATIS) ===
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah loncat bawaan HTML anchor
            
            const targetId = link.getAttribute('href');
            let targetScrollPosition = 0;
            const vh = window.innerHeight;

            // Logika offset jatuh halaman: 
            // Home (0vh) -> Bride jatuh (150vh) -> Groom jatuh (300vh)
            if (targetId === '#home') {
                targetScrollPosition = 0;
            } else if (targetId === '#bride') {
                targetScrollPosition = vh * 1.5; 
            } else if (targetId === '#groom') {
                targetScrollPosition = vh * 3.0; 
            } else {
                return; // RSVP & Gallery belum punya halaman target
            }

            // Gulir layar dengan mulus ke posisi yang dihitung
            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
        });
    });

    // === EFEK TOMBOL SEE MORE MENGGULIR HALAMAN ===
    document.querySelectorAll('.see-more-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.scrollBy({ top: window.innerHeight * 1.5, behavior: 'smooth' });
        });
    });

    // =========================================================================
    // SCROLLYTELLING: TRANSISI HALAMAN BERTINGKAT
    // =========================================================================
    function setupLayerDropAnimation(triggerElement, containerSelector) {
        const fallingLayers = [
            `${containerSelector} .home-content-overlay`, 
            `${containerSelector} .title-marriage, ${containerSelector} .bride-title-last, ${containerSelector} .groom-title-last`, 
            `${containerSelector} .home-bg-pink`,         
            `${containerSelector} .home-couple-img, ${containerSelector} .bride-img, ${containerSelector} .groom-img`, 
            `${containerSelector} .title-just, ${containerSelector} .bride-title-first, ${containerSelector} .groom-title-first`, 
            `${containerSelector} .home-bg-blue`,         
            `${containerSelector} .home-bg-white`         
        ];

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "top top",      
                end: "bottom top",     
                scrub: 1,              
            }
        });

        fallingLayers.forEach((layerSelector, index) => {
            const el = document.querySelectorAll(layerSelector);
            if (el.length > 0) {
                tl.to(el, {
                    y: "110vh",    
                    opacity: 0,    
                    ease: "power1.inOut"
                }, index * 0.15);  
            }
        });
    }

    setupLayerDropAnimation('.scroll-trigger-home', '.home-container');
    setupLayerDropAnimation('.scroll-trigger-bride', '.bride-container');

    // =========================================================================
    // EFEK PARALLAX 3D PADA WELCOME SCREEN
    // =========================================================================
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        const xToBg = gsap.quickTo(layerBg, "x", {duration: 0.8, ease: "power2.out"});
        const yToBg = gsap.quickTo(layerBg, "y", {duration: 0.8, ease: "power2.out"});
        const xToHole = gsap.quickTo(layerHole, "x", {duration: 0.8, ease: "power2.out"});
        const yToHole = gsap.quickTo(layerHole, "y", {duration: 0.8, ease: "power2.out"});
        const xToFgL = gsap.quickTo(layerFgLeft, "x", {duration: 0.8, ease: "power2.out"});
        const yToFgL = gsap.quickTo(layerFgLeft, "y", {duration: 0.8, ease: "power2.out"});
        const xToFgR = gsap.quickTo(layerFgRight, "x", {duration: 0.8, ease: "power2.out"});
        const yToFgR = gsap.quickTo(layerFgRight, "y", {duration: 0.8, ease: "power2.out"});

        const moveHandler = (e) => {
            const xValue = (e.clientX / window.innerWidth - 0.5) * 2;
            const yValue = (e.clientY / window.innerHeight - 0.5) * 2;
            
            xToBg(xValue * 15);     yToBg(yValue * 15);
            xToHole(xValue * -25);  yToHole(yValue * -25);
            xToFgL(xValue * -60);   yToFgL(yValue * -40);
            xToFgR(xValue * -60);   yToFgR(yValue * -40);
        };

        welcomeContainer.addEventListener('mousemove', moveHandler);

        return () => { welcomeContainer.removeEventListener('mousemove', moveHandler); };
    });

    mm.add("(max-width: 768px)", () => {
        function floatElement(target, xMax, yMax, durMin, durMax) {
            gsap.to(target, {
                x: gsap.utils.random(-xMax, xMax),
                y: gsap.utils.random(-yMax, yMax),
                duration: gsap.utils.random(durMin, durMax),
                ease: "sine.inOut",
                onComplete: () => floatElement(target, xMax, yMax, durMin, durMax)
            });
        }

        floatElement(layerBg, 8, 8, 3, 5);
        floatElement(layerHole, 15, 15, 3.5, 5.5);
        floatElement(layerFgLeft, 25, 20, 2.5, 4.5);
        floatElement(layerFgRight, 25, 20, 2.8, 4.8);
    });
});