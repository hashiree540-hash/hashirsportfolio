/* ===================================================================
   MUHAMMAD HASHIR - AI CONTENT CREATOR & CREATIVE DEVELOPER
   Interactive Client Logic & Animations
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Reveal Navbar on Scroll
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

  // 2. Smooth Scroll for all in-page links including Hotspots
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        const headerOffset = 60;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. Projects Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. Modal Handlers
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

  // Open Project Modal
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

  // Open Resume Modal
  downloadResumeBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Service Cards interactive tap/click toggle for touch & mobile devices
  const serviceCards = document.querySelectorAll('.service-card-ref');
  serviceCards.forEach((card) => {
    card.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');
      serviceCards.forEach((c) => c.classList.remove('active'));
      if (!isAlreadyActive) {
        card.classList.add('active');
      }
    });
  });

  if (resumeCloseBtn) {
    resumeCloseBtn.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close modals on clicking outside dialog
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeProjectModal();
      }
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

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      if (resumeModal) {
        resumeModal.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // 6. Contact Form Submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      showToast(`Thank you ${name}! Muhammad Hashir received your inquiry and will reply promptly.`);
      contactForm.reset();
    });
  }

  // 7. Copy to Clipboard for Contact Cards
  document.querySelectorAll('.copy-trigger').forEach((el) => {
    el.addEventListener('click', (e) => {
      const copyVal = el.getAttribute('data-copy');
      if (copyVal) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast(`Copied "${copyVal}" to clipboard!`);
        });
      }
    });
  });

  // Toast Function
  window.showToast = function (msg) {
    const toast = document.getElementById('toastNotice');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  };
});
