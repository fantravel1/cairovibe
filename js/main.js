/**
 * CairoVibe.com - Main JavaScript
 * Cairo After Dark. Cairo Alive.
 * Mobile-first, performance-optimized interactions
 */

(function() {
  'use strict';

  // DOM Ready
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initHeaderScroll();
    initFaqAccordion();
    initCategoryFilter();
    initScrollToTop();
    initSmoothScroll();
    initLazyImages();
    initAnimateOnScroll();
  }

  /**
   * Mobile Menu Toggle
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.nav-overlay');

    if (!menuToggle || !nav) return;

    function toggleMenu() {
      const isOpen = nav.classList.contains('active');

      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');

      menuToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeMenu() {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && nav.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close when clicking nav links (mobile)
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /**
   * Header Hide/Show on Scroll
   */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    let ticking = false;
    const threshold = 100;

    function updateHeader() {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= threshold) {
        header.classList.remove('hidden');
      } else if (currentScroll > lastScroll && currentScroll > threshold) {
        // Scrolling down
        header.classList.add('hidden');
      } else {
        // Scrolling up
        header.classList.remove('hidden');
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * FAQ Accordion
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');

      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
        question.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  /**
   * Category Filter for Cards
   */
  function initCategoryFilter() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const cards = document.querySelectorAll('.venue-card[data-category]');

    if (!categoryButtons.length || !cards.length) return;

    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        const category = button.dataset.category;

        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter cards
        cards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.3s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Scroll to Top Button
   */
  function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;

    let ticking = false;

    function updateButton() {
      if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateButton);
        ticking = true;
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * Smooth Scroll for Anchor Links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Lazy Loading Images with Intersection Observer
   */
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      return;
    }

    // Fallback for older browsers
    const images = document.querySelectorAll('img[loading="lazy"]');

    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px'
    });

    images.forEach(img => imageObserver.observe(img));
  }

  /**
   * Animate Elements on Scroll
   */
  function initAnimateOnScroll() {
    const elements = document.querySelectorAll('.card, .neighborhood-card, .vibe-card, .stat-card');

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

  // Add fadeIn animation to stylesheet dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);

})();
