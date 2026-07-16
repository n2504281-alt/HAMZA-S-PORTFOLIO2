/* ==========================================================================
   Muhammad Hamza - Freelance Developer Portfolio JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Theme Toggle & Local Storage
  const themeBtn = document.getElementById('theme-btn');
  const htmlElement = document.documentElement;

  // Retrieve theme preference or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
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

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, {
    threshold: 0.05, // Trigger early on mobile/small elements
    rootMargin: '0px 0px -40px 0px' // Offset trigger point slightly from screen bottom
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Contact Form AJAX Submission
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    // Create elements to show success / error messages
    const formStatus = document.createElement('div');
    formStatus.className = 'form-status-message';
    contactForm.appendChild(formStatus);

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Update UI to submitting state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';
      formStatus.textContent = '';
      formStatus.className = 'form-status-message';

      const formData = {
        name: document.getElementById('form-name').value,
        email: document.getElementById('form-email').value,
        message: document.getElementById('form-message').value
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/hamza03119488@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const result = await response.json();
          formStatus.textContent = 'Thank you! Your message has been sent successfully.';
          formStatus.classList.add('success');
          contactForm.reset();
        } else {
          throw new Error('Failed to send message.');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        formStatus.textContent = 'Oops! There was an issue sending your message. Please try again.';
        formStatus.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // 6. Testimonials Section Animations (Count-up & Star Pop-in)
  const testimonialsSection = document.getElementById('testimonials');
  const ratingVal = document.getElementById('rating-val');
  const stars = document.querySelectorAll('#animated-stars .star-icon');
  let testimonialsAnimated = false;

  const animateTestimonials = () => {
    if (testimonialsAnimated) return;
    testimonialsAnimated = true;

    // A. Rating Count-up Animation
    const targetRating = 4.9;
    const duration = 1500; // 1.5s
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth ease-out quad function for counting
      const easeProgress = progress * (2 - progress);
      const currentVal = (easeProgress * targetRating).toFixed(1);
      
      ratingVal.textContent = currentVal;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        ratingVal.textContent = targetRating.toFixed(1);
      }
    };

    requestAnimationFrame(updateCount);

    // B. Stars Pop-in Animation (Sequential delays)
    stars.forEach((star, index) => {
      setTimeout(() => {
        star.classList.add('active');
      }, index * 200); // 200ms delay between each star
    });
  };

  if (testimonialsSection) {
    const testimonialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateTestimonials();
          // Unobserve to trigger only once
          testimonialObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    testimonialObserver.observe(testimonialsSection);
  }

  // 7. 3D Tilt Effect for Testimonial Cards
  const tiltCards = document.querySelectorAll('#rating-card-3d, .tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation based on cursor position (-15 to 15 degrees)
      const rotateX = -((y / height) - 0.5) * 15;
      const rotateY = ((x / width) - 0.5) * 15;
      
      card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset card position smoothly
      card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});
