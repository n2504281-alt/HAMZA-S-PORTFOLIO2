/* ==========================================================================
   Muhammad Hamza - Freelance Developer Portfolio JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Theme Toggle & Local Storage
  const themeBtn = document.getElementById('theme-btn');
  const htmlElement = document.documentElement;

  // Retrieve theme preference or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);

  themeBtn.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    let newTheme = 'light';
    
    if (theme === 'light') {
      newTheme = 'dark';
    }
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // 2. Sticky Navigation Bar Scroll Effect
  const navbar = document.getElementById('navbar');
  
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on page load

  // 3. Mobile Navigation Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-links a');

  const toggleMobileMenu = () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  };

  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside of navbar on mobile
  document.addEventListener('click', (event) => {
    const isClickInside = navbar.contains(event.target);
    if (!isClickInside && navMenu.classList.contains('active')) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
    }
  });

  // 4. Highlight Nav Link on scroll
  const sections = document.querySelectorAll('section');
  
  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Offset for sticky navbar
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollActive);
  scrollActive();

  // 5. Scroll Reveal Effect (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once revealed to maintain simplicity
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05, // Trigger early on mobile/small elements
    rootMargin: '0px 0px -40px 0px' // Offset trigger point slightly from screen bottom
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
});
