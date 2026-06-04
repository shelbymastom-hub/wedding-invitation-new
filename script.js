document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const welcomeContainer = document.querySelector('.welcome-container');
    const welcomeLayerBg = document.querySelector('.welcome-container .layer-bg');
    const welcomeLayerHole = document.querySelector('.welcome-container .layer-hole');
    const welcomeLayerFgLeft = document.querySelector('.welcome-container .layer-fg-left');
    const welcomeLayerFgRight = document.querySelector('.welcome-container .layer-fg-right');
    const uiContent = document.querySelector('.welcome-container .ui-content');
    
    const enterBtn = document.querySelector('.enter-btn');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const iconVolOn = document.getElementById('icon-vol-on');
    const iconVolOff = document.getElementById('icon-vol-off');

    // === LOGIKA MUSIC TOGGLE ===
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
                
                document.getElementById('bottom-nav-bar').style.display = 'flex';
                musicToggle.style.display = 'block';
                
                ScrollTrigger.refresh();
                
                // Memicu animasi running text love story SECARA LANGSUNG SAAT HALAMAN DIBUKA
                startRunningStory();
            }
        });

        tl.to(uiContent, { opacity: 0, duration: 0.4, ease: "power1.out" })
          .to(welcomeLayerFgLeft, { xPercent: -150, duration: 2, ease: "power3.inOut" }, "-=0.2")
          .to(welcomeLayerFgRight, { xPercent: 150, duration: 2, ease: "power3.inOut" }, "<")
          .to(welcomeLayerHole, { scale: 4, opacity: 0, duration: 2, ease: "power3.inOut" }, "<")
          .to(welcomeLayerBg, { scale: 3, opacity: 0, duration: 2, ease: "power3.inOut" }, "<");
    });

    // === INTERCEPT KLIK MENU NAVIGASI BAWAH ===
    document.querySelectorAll('.nav-links a').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            const targetId = link.getAttribute('href');
            let targetScrollPosition = 0;
            const vh = window.innerHeight;

            if (targetId === '#home') targetScrollPosition = 0;
            else if (targetId === '#groom') targetScrollPosition = vh * 1.0; 
            else if (targetId === '#bride') targetScrollPosition = vh * 2.0; 
            else if (targetId === '#gallery') targetScrollPosition = vh * 3.0; 
            else return; 

            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
        });
    });

    document.querySelectorAll('.see-more-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.scrollBy({ top: window.innerHeight * 1.0, behavior: 'smooth' });
        });
    });

    // =========================================================================
    // SCROLLYTELLING: TRANSISI JATUH OTOMATIS (HOME -> GROOM -> BRIDE)
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
                start: "50% top", // Jatuh otomatis setelah dilewati 50%
                toggleActions: "play none none reverse", 
            }
        });

        fallingLayers.forEach((layerSelector, index) => {
            const el = document.querySelectorAll(layerSelector);
            if (el.length > 0) {
                tl.to(el, {
                    y: "120vh",    
                    opacity: 0,    
                    duration: 0.5,
                    ease: "power2.in"
                }, index * 0.1);  
            }
        });
    }

    setupLayerDropAnimation('.scroll-trigger-home', '.home-container');
    setupLayerDropAnimation('.scroll-trigger-groom', '.groom-container'); 
    setupLayerDropAnimation('.scroll-trigger-bride', '.bride-container');

    // =========================================================================
    // RUNNING TEXT LOVE STORY ANIMATION (FIXED & LOOPING)
    // =========================================================================
    function startRunningStory() {
        const storyText = document.querySelector('.running-story-text');
        const container = document.querySelector('.running-story-container');
        
        // Membersihkan animasi lama biar nggak tabrakan
        gsap.killTweensOf(storyText);

        if (storyText && container) {
            gsap.fromTo(storyText, 
                { y: container.offsetHeight }, // Start dari bawah banget container
                { 
                    y: -(storyText.offsetHeight + 100), // Meluncur sampai teks habis ke atas
                    duration: 25, // Durasi scroll text
                    ease: "none", 
                    repeat: -1 // Loop tanpa batas
                }
            );
        }
    }

    // =========================================================================
    // TIMELAPSE GALLERY BACKGROUND (MUNCUL DARI DALAM & TRANSPARANSI OTOMATIS)
    // =========================================================================
    const galSlides = document.querySelectorAll('.gal-slide');
    gsap.set(galSlides, { opacity: 0, scale: 0.8 }); 
    
    let currentSlideIdx = 0;

    function crossfadeSlides() {
        if (galSlides.length <= 1) return;

        let currentSlide = galSlides[currentSlideIdx];
        currentSlideIdx = (currentSlideIdx + 1) % galSlides.length; 
        let nextSlide = galSlides[currentSlideIdx];

        // 1. Munculin gambar selanjutnya (Fade In + Scale Normal)
        gsap.fromTo(nextSlide, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 2, ease: "power2.out" }
        );
        
        // 2. Terus nge-zoom lambat (Muncul dari dalam)
        gsap.to(nextSlide, { scale: 1.15, duration: 6, ease: "none" });

        // 3. Pudar gambar sebelumnya 
        gsap.to(currentSlide, { opacity: 0, duration: 2, ease: "power2.inOut" });

        // Ulangi terus setiap 4 detik
        gsap.delayedCall(4, crossfadeSlides);
    }

    // Eksekusi otomatis gambar pertama
    if (galSlides.length > 0) {
        gsap.set(galSlides[0], { opacity: 1, scale: 1 });
        gsap.to(galSlides[0], { scale: 1.15, duration: 6, ease: "none" });
        gsap.delayedCall(4, crossfadeSlides);
    }

    // =========================================================================
    // EFEK PARALLAX MOUSE / GYRO GLOBAL
    // =========================================================================
    let mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
        const xToBg = gsap.quickTo('.layer-bg, .gal-slide', "x", {duration: 0.8, ease: "power2.out"});
        const yToBg = gsap.quickTo('.layer-bg, .gal-slide', "y", {duration: 0.8, ease: "power2.out"});
        const xToHole = gsap.quickTo('.layer-hole', "x", {duration: 0.8, ease: "power2.out"});
        const yToHole = gsap.quickTo('.layer-hole', "y", {duration: 0.8, ease: "power2.out"});
        const xToFgL = gsap.quickTo('.layer-fg-left', "x", {duration: 0.8, ease: "power2.out"});
        const yToFgL = gsap.quickTo('.layer-fg-left', "y", {duration: 0.8, ease: "power2.out"});
        const xToFgR = gsap.quickTo('.layer-fg-right', "x", {duration: 0.8, ease: "power2.out"});
        const yToFgR = gsap.quickTo('.layer-fg-right', "y", {duration: 0.8, ease: "power2.out"});

        const moveHandler = (e) => {
            const xValue = (e.clientX / window.innerWidth - 0.5) * 2;
            const yValue = (e.clientY / window.innerHeight - 0.5) * 2;
            
            xToBg(xValue * 15);     yToBg(yValue * 15);
            xToHole(xValue * -25);  yToHole(yValue * -25);
            xToFgL(xValue * -60);   yToFgL(yValue * -40);
            xToFgR(xValue * -60);   yToFgR(yValue * -40);
        };

        window.addEventListener('mousemove', moveHandler);
        return () => { window.removeEventListener('mousemove', moveHandler); };
    });

    mm.add("(max-width: 768px)", () => {
        function floatElement(targetSelector, xMax, yMax, durMin, durMax) {
            gsap.to(targetSelector, {
                x: () => gsap.utils.random(-xMax, xMax),
                y: () => gsap.utils.random(-yMax, yMax),
                duration: () => gsap.utils.random(durMin, durMax),
                ease: "sine.inOut",
                onComplete: () => floatElement(targetSelector, xMax, yMax, durMin, durMax)
            });
        }

        floatElement('.layer-bg, .gallery-bg-slider', 8, 8, 3, 5);
        floatElement('.layer-hole', 15, 15, 3.5, 5.5);
        floatElement('.layer-fg-left', 25, 20, 2.5, 4.5);
        floatElement('.layer-fg-right', 25, 20, 2.8, 4.8);
    });
});