gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll Setup & GSAP Sync (ANTI LAG)
const lenis = new Lenis({ 
    duration: 1.2, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) 
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// 2. Opening Parallax
const openingSec = document.getElementById('opening');
const enterBtn = document.getElementById('enter-btn');

function handleParallax(e) {
    if(openingSec.style.display === 'none') return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = (clientY / window.innerHeight) * 2 - 1;
    
    gsap.to('#layer-back-img', { x: x * -15, y: y * -15, duration: 1, ease: 'power2.out' });
    gsap.to('#layer-bg', { x: x * -10, y: y * -10, duration: 1, ease: 'power2.out' });
    gsap.to('#layer-left', { x: x * 15, y: y * 15, duration: 1, ease: 'power2.out' });
    gsap.to('#layer-right', { x: x * 15, y: y * 15, duration: 1, ease: 'power2.out' });
}

document.addEventListener('mousemove', handleParallax);
document.addEventListener('touchmove', handleParallax);

enterBtn.addEventListener('click', () => {
    document.removeEventListener('mousemove', handleParallax);
    document.removeEventListener('touchmove', handleParallax);

    const audio = document.getElementById('bgm');
    audio.play();
    document.getElementById('musicText').innerText = "Pause Music";
    
    gsap.to('.opening-text-container, .opening-footer', { opacity: 0, duration: 0.4 });
    gsap.to('#layer-back-img', { scale: 2.5, opacity: 0, duration: 1.5, ease: "power3.inOut" });
    gsap.to('#layer-bg', { scale: 3, opacity: 0, duration: 1.5, ease: "power3.inOut" });
    gsap.to('#layer-left', { xPercent: -150, opacity: 0, duration: 1.5, ease: "power3.inOut" });
    gsap.to('#layer-right', { xPercent: 150, opacity: 0, duration: 1.5, ease: "power3.inOut", 
        onComplete: () => {
            openingSec.style.display = 'none';
            document.getElementById('main-nav').style.pointerEvents = 'auto'; 
            gsap.to('.hero-image-wrapper', { opacity: 1, duration: 0.8 });
            gsap.to('.top-nav', { opacity: 1, duration: 0.8 });
            gsap.from('.hero-center, .scroll-indicator', { y: 30, opacity: 0, duration: 1.2, stagger: 0.3, ease: "power2.out" });
        }
    });
});

// 2.5. SCROLL-TO-SHRINK & GALLERY REVEAL (MATCHMEDIA)
let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
    const tlShrink = gsap.timeline({ scrollTrigger: { trigger: "#homepage-trigger", start: "top top", end: "bottom bottom", scrub: 1, pin: "#homepage-pin-container" }});
    tlShrink.to('.hero-image-wrapper', { width: "35vw", height: "70vh", borderRadius: "24px", ease: "power2.inOut" }, 0);
    tlShrink.to('.hero-names', { scale: 0.6, ease: "power2.inOut" }, 0);
    tlShrink.to('.guest-name, .scroll-indicator, .hero-overlay', { opacity: 0, ease: "power2.inOut" }, 0);
    
    tlShrink.to('#sg-1', { xPercent: -130, yPercent: -90, opacity: 1, scale: 1, ease: "power2.inOut" }, 0); 
    tlShrink.to('#sg-2', { xPercent: -110, yPercent: 40, opacity: 1, scale: 1, ease: "power2.inOut" }, 0);  
    tlShrink.to('#sg-3', { xPercent: 110, yPercent: -80, opacity: 1, scale: 1, ease: "power2.inOut" }, 0); 
    tlShrink.to('#sg-4', { xPercent: 130, yPercent: 50, opacity: 1, scale: 1, ease: "power2.inOut" }, 0);  
    tlShrink.to('.nav-logo, .nav-link', { color: "#111111", ease: "power2.inOut" }, 0);
});

mm.add("(max-width: 767px)", () => {
    const tlShrinkMobile = gsap.timeline({ scrollTrigger: { trigger: "#homepage-trigger", start: "top top", end: "bottom bottom", scrub: 1, pin: "#homepage-pin-container" }});
    tlShrinkMobile.to('.hero-image-wrapper', { width: "75vw", height: "55vh", borderRadius: "20px", ease: "power2.inOut" }, 0);
    tlShrinkMobile.to('.hero-names', { scale: 0.8, ease: "power2.inOut" }, 0);
    tlShrinkMobile.to('.guest-name, .scroll-indicator, .hero-overlay', { opacity: 0, ease: "power2.inOut" }, 0);
    
    tlShrinkMobile.to('#sg-1', { xPercent: -90, yPercent: -110, opacity: 1, scale: 1, ease: "power2.inOut" }, 0);
    tlShrinkMobile.to('#sg-3', { xPercent: 90, yPercent: -100, opacity: 1, scale: 1, ease: "power2.inOut" }, 0);
    tlShrinkMobile.to('#sg-2', { xPercent: -80, yPercent: 110, opacity: 1, scale: 1, ease: "power2.inOut" }, 0);
    tlShrinkMobile.to('#sg-4', { xPercent: 80, yPercent: 120, opacity: 1, scale: 1, ease: "power2.inOut" }, 0);
    tlShrinkMobile.to('.nav-logo, .nav-link', { color: "#111111", ease: "power2.inOut" }, 0);
});

// 3. STORY TRANSITION REVEAL
gsap.from("#story-transition .transition-content p, #story-transition .transition-content h2", {
    scrollTrigger: { trigger: "#story-transition", start: "top 75%" },
    y: 50, opacity: 0, duration: 1.2, stagger: 0.3, ease: "power2.out"
});

// 4. LOVE STORY BLOCKS
gsap.utils.toArray('.story-block').forEach((block) => {
    gsap.to(block, { scrollTrigger: { trigger: block, start: "top 85%" }, y: 0, opacity: 1, duration: 1, ease: "power2.out" });
});

// 5. BRIDE & GROOM FADE IN
gsap.utils.toArray('.person-details .fade-text').forEach((text) => {
    gsap.from(text, { scrollTrigger: { trigger: text, start: "top 85%" }, y: 30, opacity: 0, duration: 1.2, ease: "power2.out" });
});
gsap.from(".groom-frame", { scrollTrigger: { trigger: "#groom-sec", start: "top 70%" }, y: -100, opacity: 0, rotation: -5, duration: 1.5, ease: "power2.out" });
gsap.from(".bride-frame", { scrollTrigger: { trigger: "#bride-sec", start: "top 70%" }, y: -100, opacity: 0, rotation: 5, duration: 1.5, ease: "power2.out" });

// 6. GALLERY POLAROID STACK (DIBALIK: DARI BAWAH KE ATAS)
const galleryAssets = [
    'DSC00284.webp', 'DSC00329.webp', 'DSC00339.webp', 'DSC00345.webp', 
    'DSC00347.webp', 'DSC00348.webp', 'DSC00371.webp', 'DSC00384.webp'
]; 
const galleryContainer = document.querySelector('.gallery-stack');
galleryContainer.innerHTML = ''; 
galleryAssets.forEach((src, i) => {
    const card = document.createElement('div');
    card.className = 'polaroid-card';
    card.style.zIndex = i; 
    card.innerHTML = `<img src="${src}" onerror="this.src='https://via.placeholder.com/300x400/000/fff?text=Gallery+Image'"><div class="polaroid-caption">Memory ${i+1}</div>`;
    galleryContainer.appendChild(card);
});

const cards = gsap.utils.toArray('.polaroid-card');
gsap.set(cards[0], { rotation: -3 });
// MENGUBAH EFFECT DARI BAWAH KE ATAS
gsap.set(cards.slice(1), { yPercent: 200, opacity: 0 });

const tlGallery = gsap.timeline({
    scrollTrigger: { trigger: "#gallery-trigger", start: "top top", end: "bottom bottom", scrub: 1, pin: "#gallery-pin" }
});

cards.slice(1).forEach((card, i) => {
    tlGallery.to(card, {
        yPercent: 0, opacity: 1, rotation: () => Math.random() * 12 - 6, ease: "power2.out", force3D: true 
    }, i * 0.5); 
});

// 7. WISHES AUTO-SCROLL SIMULATION (100% SMOOTH CSS)
const wishWrapper = document.querySelector('.wish-wrapper');
wishWrapper.innerHTML += wishWrapper.innerHTML; 

// 8. RSVP FORM LOGIC & TICKET GENERATOR
document.getElementById('rsvp-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('guestName').value;
    const attend = document.getElementById('attendance').value;
    
    // Parseint untuk menjumlahkan pax
    const adults = parseInt(document.getElementById('adults').value) || 0;
    const kids = parseInt(document.getElementById('children').value) || 0;
    const totalPax = adults + kids;
    
    const wish = document.getElementById('wishMsg').value;
    
    const qrModal = document.getElementById('qr-modal');
    const ticketName = document.getElementById('ticket-name');
    const ticketPax = document.getElementById('ticket-pax');
    const qrImg = document.getElementById('qr-code-img');

    if(attend === 'yes') {
        // Mode Tiket
        document.querySelector('.ticket-title').innerText = "E-TICKET INVITATION";
        document.querySelector('.qr-wrapper').style.display = "flex";
        document.querySelector('.ticket-instruction').style.display = "block";
        
        ticketName.innerText = name;
        ticketPax.innerText = `${totalPax} People`;
        
        // Memakai API public QR Code generator beneran!
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VIP-${encodeURIComponent(name)}`;
        
        if(wish) {
            const newWish = document.createElement('div');
            newWish.className = 'wish-item';
            newWish.innerHTML = `<strong>${name}</strong><br><span style="font-size: 0.9rem; color: var(--grey);">${wish}</span>`;
            document.querySelector('.wish-wrapper').prepend(newWish); 
        }
    } else {
        // Mode Decline / Tidak Hadir
        document.querySelector('.ticket-title').innerText = "THANK YOU";
        document.querySelector('.qr-wrapper').style.display = "none";
        document.querySelector('.ticket-instruction').style.display = "none";
        
        ticketName.innerText = name;
        ticketPax.innerText = "We will miss you on our special day!";
    }
    
    // Munculkan modal
    qrModal.style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', () => { document.getElementById('qr-modal').style.display = 'none'; });

// 9. COPY TO CLIPBOARD
function copyText(id) {
    navigator.clipboard.writeText(document.getElementById(id).innerText).then(() => alert("Account Number Copied!"));
}

// 10. MUSIC CONTROL (FOOTER)
const musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', () => {
    const audio = document.getElementById('bgm');
    const icon = document.getElementById('musicIcon');
    const text = document.getElementById('musicText');
    
    if (audio.paused) {
        audio.play(); text.innerText = "Pause Music"; icon.style.animationPlayState = 'running';
    } else {
        audio.pause(); text.innerText = "Play Music"; icon.style.animationPlayState = 'paused';
    }
});