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
  // 2. Sticky Reveal Navbar on Scroll
  // -----------------------------------------------------------------
  const stickyNavbar = document.getElementById('stickyNavbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 150) {
      stickyNavbar?.classList.add('visible');
    } else {
      stickyNavbar?.classList.remove('visible');
    }
    highlightCurrentSection();
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
        lenis.scrollTo(target, { offset: -60, duration: 1.2 });
      }
    });
  });

  // -----------------------------------------------------------------
  // 3. Hero Entrance Master Timeline (Reference Video Inspired)
  // -----------------------------------------------------------------
  function initHeroAnimations() {
    const heroChars = document.querySelectorAll('.hero-char');
    const heroCutout = document.querySelector('.hero-person-wrap');
    const heroLeftIntro = document.querySelector('.hero-left-intro');
    const heroRightStats = document.querySelector('.hero-right-stats');
    const heroDockBtns = document.querySelectorAll('.hero-dock-btn, .hero-dock-status');
    const heroNav = document.querySelector('.hero-native-header');
    const heroSideTag = document.querySelector('.hero-watermark-side');

    if (heroNav) gsap.set(heroNav, { y: -30, opacity: 0 });
    if (heroSideTag) gsap.set(heroSideTag, { x: -30, opacity: 0 });
    if (heroChars.length) gsap.set(heroChars, { y: 65, opacity: 0, scale: 0.94 });
    if (heroCutout) gsap.set(heroCutout, { y: 85, scale: 0.93, opacity: 0 });
    if (heroLeftIntro) gsap.set(heroLeftIntro, { x: -45, opacity: 0 });
    if (heroRightStats) gsap.set(heroRightStats, { x: 45, opacity: 0 });
    if (heroDockBtns.length) gsap.set(heroDockBtns, { x: 40, opacity: 0 });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });

    heroTl
      .to(heroNav, { y: 0, opacity: 1, duration: 0.8 }, 0)
      .to(heroSideTag, { x: 0, opacity: 0.9, duration: 0.8 }, 0.2)
      .to(heroChars, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.065,
        ease: 'power3.out'
      }, 0.2)
      .to(heroCutout, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: 'power3.out'
      }, 0.45)
      .to(heroLeftIntro, {
        x: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out'
      }, 0.7)
      .to(heroRightStats, {
        x: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out'
      }, 0.85)
      .to(heroDockBtns, {
        x: 0,
        opacity: 1,
        duration: 0.85,
        stagger: 0.08,
        ease: 'back.out(1.6)'
      }, 0.95);

    // Interactive Mouse Parallax (desktop viewports > 900px)
    if (window.innerWidth > 900) {
      window.addEventListener('mousemove', (e) => {
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;

        gsap.to('.hero-person-img', {
          x: normX * 16,
          y: normY * 10,
          duration: 1,
          ease: 'power2.out'
        });
        gsap.to('.hero-portfolio-typography', {
          x: -normX * 14,
          y: -normY * 8,
          duration: 1.3,
          ease: 'power2.out'
        });
        gsap.to('.hero-left-intro', {
          x: normX * 8,
          y: normY * 5,
          duration: 1.1,
          ease: 'power2.out'
        });
        gsap.to('.hero-right-stats', {
          x: normX * 8,
          y: normY * 5,
          duration: 1.1,
          ease: 'power2.out'
        });
      });
    }
  }

  // -----------------------------------------------------------------
  // 4. Typography Word-by-Word Masked Revealing System
  // -----------------------------------------------------------------
  function initTypographyAnimations() {
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
        { y: '115%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.9,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 88%',
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
  initHeroAnimations();
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
