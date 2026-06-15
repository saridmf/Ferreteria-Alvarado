// ========================================
// DOM Elements
// ========================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const scrollToTopBtn = document.getElementById('scrollToTop');
const header = document.getElementById('header');
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// ========================================
// Mobile Menu Toggle
// ========================================
function toggleMobileMenu() {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
mobileNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') && 
      !mobileMenu.contains(e.target) && 
      !menuToggle.contains(e.target)) {
    toggleMobileMenu();
  }
});

// ========================================
// Scroll to Top Button
// ========================================
function handleScroll() {
  const scrollY = window.scrollY;
  
  // Show/hide scroll to top button
  if (scrollY > 300) {
    scrollToTopBtn.classList.add('visible');
  } else {
    scrollToTopBtn.classList.remove('visible');
  }
  
  // Add shadow to header on scroll
  if (scrollY > 10) {
    header.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)';
  } else {
    header.style.boxShadow = '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)';
  }
}

window.addEventListener('scroll', handleScroll);

scrollToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const scrollY = window.scrollY + 100;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);

// ========================================
// Contact Form Handling
// ========================================
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(contactForm);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  };
  
  // Simulate form submission
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.textContent = 'Enviando...';
  submitBtn.disabled = true;
  
  setTimeout(() => {
    alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
    contactForm.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 1500);
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply fade-in animation to cards
document.querySelectorAll('.feature-card, .catalog-card, .news-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeInObserver.observe(card);
});

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  // Run initial scroll check
  handleScroll();
  updateActiveNavLink();
});

///////////////////////////////////////////

// Tracking de clicks en las cards del carrusel de galería
function trackGalleryCardClick(cardIndex, cardCaption) {
  if (typeof gtag === 'function') {
    gtag('event', 'gallery_card_click', {
      event_category: 'Galería',
      event_label: cardCaption,
      card_position: cardIndex
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const galleryCards = document.querySelectorAll('.gallery-card');

  galleryCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      const caption = card.querySelector('.gallery-caption')?.textContent.trim() || `card-${index}`;
      trackGalleryCardClick(index, caption);
    });
  });
});