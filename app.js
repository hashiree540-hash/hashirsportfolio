/* ===================================================================
   MUHAMMAD HASHIR - AI CONTENT CREATOR & CREATIVE DEVELOPER
   Cinematic Motion & Interactive Client Engine (GSAP + ScrollTrigger + Lenis)
   =================================================================== */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
window.ScrollTrigger = ScrollTrigger;
window.gsap = gsap;

function initApp() {
  // -----------------------------------------------------------------
  // 1. Lenis Smooth Scroll Engine
  // -----------------------------------------------------------------
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.8
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;

  // -----------------------------------------------------------------
  // 2. Sticky Reveal Navbar on Scroll & Hero Replay Tracking
  // -----------------------------------------------------------------
  const stickyNavbar = document.getElementById('stickyNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  let hasLeftHero = false;
  let isNavigatingToHome = false;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 150) {
      stickyNavbar?.classList.add('visible');
    } else {
      stickyNavbar?.classList.remove('visible');
    }
    highlightCurrentSection();

    // Replay hero animation whenever user returns/scrolls back to homepage
    if (scrollY > 350) {
      hasLeftHero = true;
    } else if (scrollY <= 80 && hasLeftHero && !isNavigatingToHome) {
      hasLeftHero = false;
      playHeroAnimation();
    }
  });

  function highlightCurrentSection() {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Smooth Scroll for in-page anchors with Lenis
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (href === '#home') {
          // Re-entering hero via navigation click (brand logo, back-to-top, etc.)
          if (window.scrollY > 80) {
            isNavigatingToHome = true;
            hasLeftHero = false;
            lenis.scrollTo(0, {
              duration: 1.1,
              onComplete: () => {
                isNavigatingToHome = false;
                playHeroAnimation(true);
              }
            });
          } else {
            // Already at top, replay if requested
            playHeroAnimation(true);
          }
        } else {
          hasLeftHero = true;
          lenis.scrollTo(target, { offset: -60, duration: 1.2 });
        }
      }
    });
  });

  // Replay hero entrance on browser back/forward history navigation or tab restore
  window.addEventListener('popstate', () => {
    if (!window.location.hash || window.location.hash === '#home') {
      lenis.scrollTo(0, {
        duration: 0.8,
        onComplete: () => {
          hasLeftHero = false;
          playHeroAnimation(true);
        }
      });
    }
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted && window.scrollY < 200) {
      hasLeftHero = false;
      playHeroAnimation(true);
    }
  });

  // -----------------------------------------------------------------
  // 3. Hero Entrance Master Timeline (Exact Reference Video Match)
  // Replays completely on every new homepage entry/revisit/refresh
  // -----------------------------------------------------------------
  let heroMasterTl = null;
  let lastHeroPlayTime = 0;

  function playHeroAnimation(force = false) {
    const now = Date.now();
    // Debounce to prevent rapid duplicate calls within 1.2s unless explicitly forced
    if (!force && (now - lastHeroPlayTime < 1200)) {
      return;
    }
    lastHeroPlayTime = now;

    // Respect reduced-motion accessibility preference (Requirement 10)
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (heroMasterTl) heroMasterTl.kill();
      gsap.set(['.hero-native-header', '.hero-laptop', '.laptop-ambient-glow', '.screen-red-glow',
                '.hero-breakout-character', '.screen-character-wrap', '.hero-script-greeting', 
                '.name-char', '.hero-intro-pill', '.hero-pill-sparkle', '.pill-char', 
                '.bullet-item', '.hero-dock-btn', '.hero-dock-status'], {
        opacity: 1, x: 0, y: 0, scale: 1, filter: 'none'
      });
      gsap.set('.hero-breakout-character', {
        scale: 0.90, y: -25, z: 100,
        filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.48)) drop-shadow(0 22px 45px rgba(0, 0, 0, 0.95))'
      });
      gsap.set('.screen-character-wrap', { opacity: 0.25, filter: 'brightness(0.35)' });
      document.querySelectorAll('.hero-char').forEach(char => {
        const stroke = char.querySelector('.hero-char-stroke');
        const fill = char.querySelector('.hero-char-fill');
        if (stroke) gsap.set(stroke, { opacity: 0.45, scale: 1 });
        if (fill) gsap.set(fill, { opacity: 1, filter: 'none' });
      });
      return;
    }

    const heroChars = document.querySelectorAll('.hero-char');
    const heroLaptop = document.querySelector('.hero-laptop');
    const heroLaptopGlow = document.querySelector('.laptop-ambient-glow');
    const heroScreenGlow = document.querySelector('.screen-red-glow');
    const heroScreenChar = document.querySelector('.screen-character-wrap');
    const heroBreakoutChar = document.querySelector('.hero-breakout-character');
    const heroNav = document.querySelector('.hero-native-header');
    const heroGreeting = document.querySelector('.hero-script-greeting');
    const nameCharsL1 = document.querySelectorAll('.name-line-1 .name-char');
    const nameCharsL2 = document.querySelectorAll('.name-line-2 .name-char');
    const heroPill = document.querySelector('.hero-intro-pill');
    const heroPillSparkle = document.querySelector('.hero-pill-sparkle');
    const heroPillText = document.querySelector('.hero-pill-text');
    const heroBullets = document.querySelectorAll('.hero-intro-bullets .bullet-item');
    const heroDockBtns = document.querySelectorAll('.hero-dock-btn, .hero-dock-status');

    // Split pill text into letters for typing effect (performed once)
    if (heroPillText && !heroPillText.dataset.split) {
      heroPillText.dataset.split = 'true';
      const text = heroPillText.textContent.trim();
      heroPillText.innerHTML = text.split('').map(ch => 
        ch === ' ' ? '<span class="pill-char pill-char-space">&nbsp;</span>' : `<span class="pill-char">${ch}</span>`
      ).join('');
    }
    const pillChars = document.querySelectorAll('.pill-char');

    // Cancel existing timeline and in-flight tweens on hero elements to prevent flicker/overlap
    if (heroMasterTl) {
      heroMasterTl.kill();
    }
    gsap.killTweensOf(['.hero-native-header', '.hero-laptop', '.laptop-ambient-glow',
      '.screen-red-glow', '.screen-character-wrap', '.hero-breakout-character',
      '.hero-script-greeting', '.name-char', '.hero-intro-pill', '.hero-pill-sparkle',
      '.pill-char', '.bullet-item', '.hero-dock-btn', '.hero-dock-status',
      '.hero-char-stroke', '.hero-char-fill']);

    // Reset initial states cleanly (Stationary laptop with character displayed inside screen)
    if (heroNav) gsap.set(heroNav, { y: -20, opacity: 0 });
    if (heroLaptop) gsap.set(heroLaptop, { y: 22, scale: 0.97, opacity: 0 });
    if (heroLaptopGlow) gsap.set(heroLaptopGlow, { opacity: 0, scale: 0.95 });
    if (heroScreenGlow) gsap.set(heroScreenGlow, { opacity: 0 });
    if (heroScreenChar) gsap.set(heroScreenChar, { opacity: 1, filter: 'brightness(0.96) contrast(1.04)' });
    if (heroBreakoutChar) {
      gsap.set(heroBreakoutChar, {
        opacity: 0,
        scale: 0.42,
        y: -110,
        z: 0,
        filter: 'drop-shadow(0 0 0px transparent)'
      });
    }
    if (heroGreeting) gsap.set(heroGreeting, { x: -24, opacity: 0, filter: 'blur(5px)' });
    if (nameCharsL1.length) gsap.set(nameCharsL1, { x: -14, opacity: 0, filter: 'blur(4px)' });
    if (nameCharsL2.length) gsap.set(nameCharsL2, { x: -14, opacity: 0, filter: 'blur(4px)' });
    if (heroPill) gsap.set(heroPill, { opacity: 0, scale: 0.92 });
    if (heroPillSparkle) gsap.set(heroPillSparkle, { scale: 0, opacity: 0 });
    if (pillChars.length) gsap.set(pillChars, { x: -10, opacity: 0, filter: 'blur(3px)' });
    if (heroBullets.length) gsap.set(heroBullets, { x: -22, opacity: 0, filter: 'blur(4px)' });
    if (heroDockBtns.length) gsap.set(heroDockBtns, { x: 35, opacity: 0 });

    heroChars.forEach(char => {
      const stroke = char.querySelector('.hero-char-stroke');
      const fill = char.querySelector('.hero-char-fill');
      if (stroke) gsap.set(stroke, { opacity: 0, scale: 0.98 });
      if (fill) gsap.set(fill, { opacity: 0, filter: 'none' });
    });

    // Master Timeline matching reference video sequence & speed
    heroMasterTl = gsap.timeline({ delay: 0.1 });

    // 1. Top Navbar fade in softly (0.4s) & Stationary Laptop grounding (0.3s)
    if (heroNav) heroMasterTl.to(heroNav, { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' }, 0.4);
    if (heroLaptop) heroMasterTl.to(heroLaptop, { y: 0, scale: 1, opacity: 1, duration: 1.0, ease: 'power2.out' }, 0.3);

    // 2. CREATOR Typography Left-to-Right Letter Tracing (0.0s - 2.7s in video)
    // 7 letters: C R E A T O R. Stagger ~0.34s per letter for exact reference video pace
    heroChars.forEach((char, idx) => {
      const stroke = char.querySelector('.hero-char-stroke');
      const fill = char.querySelector('.hero-char-fill');
      const letterSpacing = heroChars.length <= 7 ? 0.34 : 0.28;
      const letterStartTime = 0.1 + (idx * letterSpacing);

      if (stroke) {
        heroMasterTl.to(stroke, {
          opacity: 1,
          scale: 1,
          duration: 0.38,
          ease: 'power2.out'
        }, letterStartTime);
      }

      if (fill) {
        heroMasterTl.to(fill, {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out'
        }, letterStartTime + 0.12);
      }

      if (stroke) {
        heroMasterTl.to(stroke, {
          opacity: 0.45,
          duration: 0.45,
          ease: 'power2.inOut'
        }, letterStartTime + 0.42);
      }
    });

    // Specular light sweep across completed CREATOR at 2.65s
    heroMasterTl.to('.hero-char-fill', {
      filter: 'brightness(1.5)',
      duration: 0.22,
      stagger: 0.05,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut'
    }, 2.65);

    // Subtle Red Cinematic Glow around laptop screen and ambient field (starts at 2.35s)
    if (heroLaptopGlow) heroMasterTl.to(heroLaptopGlow, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 2.35);
    if (heroScreenGlow) heroMasterTl.to(heroScreenGlow, { opacity: 1, duration: 0.95, ease: 'power2.out' }, 2.45);
    if (heroLaptopGlow) heroMasterTl.to(heroLaptopGlow, { scale: 1.05, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 3.5);

    // 3. Cinematic 3D Screen Breakout Emergence (starts at 2.85s, finishes at 4.3s)
    // The character gradually emerges from the laptop screen using CSS 3D transforms, scale and layered positioning
    if (heroBreakoutChar) {
      heroMasterTl.set(heroBreakoutChar, { opacity: 1 }, 2.85);
      heroMasterTl.to(heroBreakoutChar, {
        scale: 0.90,
        y: -25,
        z: 100,
        duration: 1.45,
        ease: 'power3.out'
      }, 2.85);

      // Subtle red rim lighting and deep shadow wrapping around the emerging silhouette
      heroMasterTl.to(heroBreakoutChar, {
        filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.48)) drop-shadow(0 22px 45px rgba(0, 0, 0, 0.95))',
        duration: 1.35,
        ease: 'power2.out'
      }, 2.95);
    }

    // Inside screen, the character image dims as physical persona steps out into foreground
    if (heroScreenChar) {
      heroMasterTl.to(heroScreenChar, {
        opacity: 0.2,
        filter: 'brightness(0.35)',
        duration: 1.2,
        ease: 'power2.out'
      }, 3.0);
    }

    // 4. "Hello I'm" Entrance (starts at 4.3s)
    if (heroGreeting) {
      heroMasterTl.to(heroGreeting, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power2.out'
      }, 4.3);
    }

    // 5. The Name Letter-by-Letter Reveal with Motion Blur (starts at 4.9s)
    // Line 1: "MUHAMMAD"
    if (nameCharsL1.length) {
      heroMasterTl.to(nameCharsL1, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.45,
        stagger: 0.065,
        ease: 'power2.out'
      }, 4.9);
    }

    // Line 2: "HASHIR"
    if (nameCharsL2.length) {
      heroMasterTl.to(nameCharsL2, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.45,
        stagger: 0.065,
        ease: 'power2.out'
      }, 5.65);
    }

    // 6. Professional Title Pill ("✦ AI CONTENT CREATOR") (starts at 6.3s)
    if (heroPill) {
      heroMasterTl.to(heroPill, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out'
      }, 6.3);
    }

    if (heroPillSparkle) {
      heroMasterTl.to(heroPillSparkle, {
        scale: 1,
        opacity: 1,
        duration: 0.45,
        ease: 'back.out(2)'
      }, 6.35);
    }

    if (pillChars.length) {
      heroMasterTl.to(pillChars, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.38,
        stagger: 0.035,
        ease: 'power2.out'
      }, 6.45);
    }

    // 7. Capability Bullet Items (enters one by one at 7.2s, 7.6s, 8.0s, 8.4s)
    if (heroBullets.length) {
      heroMasterTl.to(heroBullets, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        stagger: 0.35,
        ease: 'power2.out'
      }, 7.2);
    }

    // 8. Social Dock Buttons Cascade (starts at 8.6s)
    if (heroDockBtns.length) {
      heroMasterTl.to(heroDockBtns, {
        x: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.12,
        ease: 'back.out(1.5)'
      }, 8.6);
    }
  }

  // Interactive Mouse Parallax (desktop viewports > 900px, initialized once)
  function initHeroParallax() {
    if (window.innerWidth > 900) {
      window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;

        // Foreground emerging character 3D parallax & subtle tilt
        gsap.to('.hero-breakout-character', {
          x: normX * 18,
          y: -25 + (normY * 10),
          rotateY: normX * 3.5,
          rotateX: -normY * 2.5,
          duration: 1,
          ease: 'power2.out'
        });
        // Stationary background laptop subtle parallax (creates tangible depth contrast)
        gsap.to('.hero-laptop', {
          x: normX * 6,
          y: normY * 4,
          rotateY: normX * 1.5,
          duration: 1.2,
          ease: 'power2.out'
        });
        // CREATOR watermark in opposite parallax
        gsap.to('.hero-portfolio-typography', {
          x: -normX * 14,
          y: -normY * 8,
          duration: 1.3,
          ease: 'power2.out'
        });
      });
    }
  }

  // -----------------------------------------------------------------
  // 4. Typography Word-by-Word Masked Revealing System
  // -----------------------------------------------------------------
  function initTypographyAnimations() {
    // 1. Section Titles & About Title
    const titles = document.querySelectorAll('.section-title, .about-hero-title');
    titles.forEach((title) => {
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue.trim().length > 0) {
          textNodes.push(node);
        }
      }

      textNodes.forEach((textNode) => {
        const words = textNode.nodeValue.split(/\s+/).filter(Boolean);
        const frag = document.createDocumentFragment();
        words.forEach((word) => {
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = word;
          mask.appendChild(inner);
          frag.appendChild(mask);
          frag.appendChild(document.createTextNode(' '));
        });
        textNode.parentNode.replaceChild(frag, textNode);
      });

      const inners = title.querySelectorAll('.word-inner');
      gsap.fromTo(inners, 
        { y: '115%', opacity: 0, filter: 'blur(4px)' },
        {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.85,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 2. Project Titles (Word-by-word reveal matching reference)
    const projectTitles = document.querySelectorAll('.project-title');
    projectTitles.forEach((pTitle) => {
      const card = pTitle.closest('.project-card') || pTitle;
      const text = pTitle.textContent.trim();
      const words = text.split(/\s+/).filter(Boolean);
      pTitle.innerHTML = '';
      words.forEach((word) => {
        const mask = document.createElement('span');
        mask.className = 'word-mask';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = word;
        mask.appendChild(inner);
        pTitle.appendChild(mask);
        pTitle.appendChild(document.createTextNode(' '));
      });

      const inners = pTitle.querySelectorAll('.word-inner');
      gsap.fromTo(inners,
        { y: '105%', opacity: 0, filter: 'blur(3px)' },
        {
          y: '0%',
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.75,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // -----------------------------------------------------------------
  // 5. About Section Animations
  // -----------------------------------------------------------------
  function initAboutAnimations() {
    // Watermark slow parallax
    gsap.to('.about-watermark-bg', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-showcase-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Lead text slide up
    gsap.fromTo('.about-hero-lead',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-hero-lead',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 4 Core Pillars staggered entrance
    gsap.fromTo('.about-pillars-grid .pillar-glass-card',
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-pillars-grid',
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );

    // 3D tilt interaction on hover for Pillar Cards
    document.querySelectorAll('.pillar-glass-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -y * 14,
          rotateY: x * 14,
          y: -6,
          duration: 0.35,
          ease: 'power2.out',
          transformPerspective: 600
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });

    // Milestone Bar entrance
    gsap.fromTo('.about-milestone-bar',
      { y: 35, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-milestone-bar',
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // -----------------------------------------------------------------
  // 6. Services Section Animations
  // -----------------------------------------------------------------
  function initServicesAnimations() {
    // Watermark Parallax
    gsap.to('.services-section .watermark-backdrop', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.services-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Staggered card entrance
    gsap.fromTo('.services-grid .service-card-ref',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Interactive 3D tilt on mousemove
    document.querySelectorAll('.service-card-ref').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: -y * 10,
          rotateY: x * 10,
          y: -8,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 900
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      });

      // Mobile/touch tap toggle
      card.addEventListener('click', () => {
        const isAlreadyActive = card.classList.contains('active');
        document.querySelectorAll('.service-card-ref').forEach((c) => c.classList.remove('active'));
        if (!isAlreadyActive) {
          card.classList.add('active');
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 7. Projects Showcase Animations (Reference Video Style)
  // -----------------------------------------------------------------
  function initProjectsAnimations() {
    // Watermark Parallax
    gsap.to('.projects-section .watermark-backdrop', {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: '.projects-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // Staggered project cards entrance
    gsap.fromTo('.projects-grid .project-card',
      { y: 65, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Parallax vertical window translation for project thumbnails
    document.querySelectorAll('.project-media-wrap').forEach((wrap) => {
      const thumb = wrap.querySelector('.project-thumbnail');
      if (thumb) {
        gsap.fromTo(thumb, 
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2
            }
          }
        );
      }
    });

    // Video preview autoplay & interactions
    document.querySelectorAll('.project-card').forEach((card) => {
      const video = card.querySelector('video.project-video-thumb');
      if (video) {
        card.addEventListener('mouseenter', () => {
          video.play().catch(() => {});
        });
      }
    });

    // Projects Filtering with smooth GSAP transition
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const cardCat = card.getAttribute('data-category') || '';
          const matches = category === 'all' || cardCat.includes(category);

          if (matches) {
            card.style.display = 'flex';
            gsap.to(card, {
              opacity: 1,
              scale: 1,
              duration: 0.45,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          } else {
            gsap.to(card, {
              opacity: 0,
              scale: 0.94,
              duration: 0.3,
              ease: 'power2.in',
              overwrite: 'auto',
              onComplete: () => {
                card.style.display = 'none';
              }
            });
          }
        });
      });
    });
  }

  // -----------------------------------------------------------------
  // 8. Other Sections (Testimonials, Contact)
  // -----------------------------------------------------------------
  function initOtherSectionAnimations() {
    gsap.fromTo('.testimonials-grid .testimonial-card',
      { y: 45, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.contact-info-col, .contact-form-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // -----------------------------------------------------------------
  // 9. Modals (Project Breakdown & Resume)
  // -----------------------------------------------------------------
  const modalBackdrop = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDescription = document.getElementById('modalDescription');
  const modalImage = document.getElementById('modalImage');
  const modalVideo = document.getElementById('modalVideo');
  const modalStack = document.getElementById('modalStack');
  const modalPrompt = document.getElementById('modalPrompt');

  const resumeModal = document.getElementById('resumeModal');
  const resumeCloseBtn = document.getElementById('resumeCloseBtn');
  const downloadResumeBtns = document.querySelectorAll('.btn-open-resume');

  const closeProjectModal = () => {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
      modalVideo.src = '';
    }
  };

  document.querySelectorAll('.open-project-modal').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const card = trigger.closest('.project-card');
      if (!card) return;

      const title = card.querySelector('.project-title')?.innerText || '';
      const cat = card.querySelector('.project-badge-cat')?.innerText || '';
      const desc = card.getAttribute('data-full-desc') || card.querySelector('.project-desc')?.innerText || '';
      const img = card.querySelector('img.project-thumbnail')?.src || card.querySelector('.project-thumbnail')?.src || '';
      const videoSrc = card.getAttribute('data-video');
      const prompt = card.getAttribute('data-prompt') || 'Crafted with multi-pass latent diffusion and temporal conditioning.';
      const tags = Array.from(card.querySelectorAll('.project-tag')).map((t) => t.innerText);

      modalTitle.innerText = title;
      modalCategory.innerText = cat;
      modalDescription.innerText = desc;
      modalPrompt.innerHTML = `<strong>AI Prompt / Architecture:</strong><br>${prompt}`;

      if (videoSrc && modalVideo) {
        modalVideo.src = videoSrc;
        modalVideo.style.display = 'block';
        if (modalImage) modalImage.style.display = 'none';
        modalVideo.play().catch(() => {});
      } else {
        if (modalVideo) {
          modalVideo.pause();
          modalVideo.src = '';
          modalVideo.style.display = 'none';
        }
        if (modalImage) {
          modalImage.src = img;
          modalImage.style.display = 'block';
        }
      }

      modalStack.innerHTML = '';
      tags.forEach((tag) => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.innerText = tag;
        modalStack.appendChild(span);
      });

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  downloadResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      if (resumeModal) {
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // -----------------------------------------------------------------
  // 10. Contact Form Submission & Toast
  // -----------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const submitBtn = contactForm.querySelector('.btn-submit-form');
      
      // Button animated feedback
      if (submitBtn) {
        gsap.to(submitBtn, {
          scale: 0.95,
          duration: 0.15,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      }

      showToast(`Thank you ${name}! Muhammad Hashir received your inquiry and will reply promptly.`);
      contactForm.reset();
    });
  }

  // Copy to Clipboard
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    el.addEventListener('click', () => {
      const copyVal = el.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`Copied "${copyVal}" to clipboard!`);
        });
      }
    });
  });

  window.showToast = function (msg) {
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.classList.add('show');
    gsap.fromTo(toast, 
      { y: 30, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)' }
    );
    setTimeout(() => {
      gsap.to(toast, {
        y: 20,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => toast.classList.remove('show')
      });
    }, 4000);
  };

  // -----------------------------------------------------------------
  // Initialize All Motion Systems
  // -----------------------------------------------------------------
  initHeroParallax();
  if (window.scrollY < 300) {
    playHeroAnimation(true);
  } else {
    hasLeftHero = true;
  }
  initTypographyAnimations();
  initAboutAnimations();
  initServicesAnimations();
  initProjectsAnimations();
  initOtherSectionAnimations();

  // Refresh ScrollTrigger after assets and fonts are ready
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
