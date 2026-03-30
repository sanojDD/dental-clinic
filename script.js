/* ============================================
   Himalaya Dental Care - JavaScript
   ============================================ */

// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Initialize all components
  initMobileMenu();
  initNavbarScroll();
  initSmoothScroll();
  initBackToTop();
  initAppointmentForm();
  initLanguageToggle();
  initScrollAnimations();
  initActiveNavLink();
});

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navLinks = document.getElementById("navLinks");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      // Toggle icon between menu and x
      const icon = mobileMenuBtn.querySelector("i");
      if (icon) {
        const iconName = navLinks.classList.contains("active") ? "x" : "menu";
        icon.setAttribute("data-lucide", iconName);
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "menu");
          if (typeof lucide !== "undefined") {
            lucide.createIcons();
          }
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !navLinks.contains(event.target) &&
        !mobileMenuBtn.contains(event.target)
      ) {
        navLinks.classList.remove("active");
        const icon = mobileMenuBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", "menu");
          if (typeof lucide !== "undefined") {
            lucide.createIcons();
          }
        }
      }
    });
  }
}

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }
}

/* ============================================
   Smooth Scrolling
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const navbar = document.getElementById("navbar");
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const emergencyBanner = document.querySelector(".emergency-banner");
          const bannerHeight = emergencyBanner
            ? emergencyBanner.offsetHeight
            : 0;
          const offset = navbarHeight + bannerHeight + 20;

          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/* ============================================
   Back to Top Button
   ============================================ */
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });

    // Scroll to top when clicked
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

/* ============================================
   Appointment Form Handling
   ============================================ */
function initAppointmentForm() {
  const form = document.getElementById("appointmentForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });

      // Validate form
      if (!validateForm(data)) {
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i data-lucide="loader"></i> Submitting...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual API call)
      setTimeout(function () {
        // Show success message
        showNotification(
          "Appointment request submitted successfully! We will contact you within 24 hours.",
          "success",
        );

        // Reset form
        form.reset();

        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Re-initialize Lucide icons
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }, 1500);
    });

    // Real-time validation
    const inputs = form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        // Remove error state when user starts typing
        this.classList.remove("error");
        const errorMsg = this.parentElement.querySelector(".error-message");
        if (errorMsg) {
          errorMsg.remove();
        }
      });
    });
  }
}

function validateForm(data) {
  let isValid = true;

  // Validate name
  if (!data.name || data.name.trim() === "") {
    showFieldError("name", "Please enter your full name");
    isValid = false;
  }

  // Validate phone
  if (!data.phone || data.phone.trim() === "") {
    showFieldError("phone", "Please enter your phone number");
    isValid = false;
  } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(data.phone.replace(/\s/g, ""))) {
    showFieldError("phone", "Please enter a valid phone number");
    isValid = false;
  }

  // Validate email if provided
  if (data.email && data.email.trim() !== "") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showFieldError("email", "Please enter a valid email address");
      isValid = false;
    }
  }

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const name = field.name;

  // Remove existing error
  field.classList.remove("error");
  const existingError = field.parentElement.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Validate based on field type
  if (field.hasAttribute("required") && value === "") {
    showFieldError(name, "This field is required");
    return false;
  }

  if (name === "email" && value !== "") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      showFieldError(name, "Please enter a valid email address");
      return false;
    }
  }

  if (name === "phone" && value !== "") {
    if (!/^[\d\s\-\+\(\)]{10,}$/.test(value.replace(/\s/g, ""))) {
      showFieldError(name, "Please enter a valid phone number");
      return false;
    }
  }

  return true;
}

function showFieldError(fieldName, message) {
  const field = document.querySelector(`[name="${fieldName}"]`);
  if (field) {
    field.classList.add("error");

    // Add error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    errorDiv.style.color = "#dc2626";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "0.25rem";

    field.parentElement.appendChild(errorDiv);

    // Add error styles to field
    field.style.borderColor = "#dc2626";
  }
}

function showNotification(message, type = "info") {
  // Remove existing notification
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i data-lucide="${type === "success" ? "check-circle" : "alert-circle"}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <i data-lucide="x"></i>
        </button>
    `;

  // Style the notification
  notification.style.position = "fixed";
  notification.style.top = "100px";
  notification.style.right = "20px";
  notification.style.padding = "1rem 1.5rem";
  notification.style.borderRadius = "0.75rem";
  notification.style.boxShadow = "0 10px 15px -3px rgb(0 0 0 / 0.1)";
  notification.style.zIndex = "1000";
  notification.style.display = "flex";
  notification.style.alignItems = "center";
  notification.style.gap = "1rem";
  notification.style.maxWidth = "400px";
  notification.style.animation = "slideInRight 0.3s ease";

  if (type === "success") {
    notification.style.background = "#10b981";
    notification.style.color = "#ffffff";
  } else if (type === "error") {
    notification.style.background = "#dc2626";
    notification.style.color = "#ffffff";
  } else {
    notification.style.background = "#3b82f6";
    notification.style.color = "#ffffff";
  }

  // Add to page
  document.body.appendChild(notification);

  // Initialize Lucide icons in notification
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      notification.remove();
    });
  }

  // Auto-remove after 5 seconds
  setTimeout(function () {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(function () {
        notification.remove();
      }, 300);
    }
  }, 5000);
}

/* ============================================
   Language Toggle
   ============================================ */
function initLanguageToggle() {
  const langToggle = document.getElementById("langToggle");
  const langEn = langToggle?.querySelector(".lang-en");
  const langNp = langToggle?.querySelector(".lang-np");

  if (langToggle && langEn && langNp) {
    // Check for saved language preference
    const savedLang = localStorage.getItem("preferredLanguage") || "en";
    setLanguage(savedLang);

    langToggle.addEventListener("click", function () {
      const currentLang = langEn.classList.contains("active") ? "en" : "np";
      const newLang = currentLang === "en" ? "np" : "en";
      setLanguage(newLang);
      localStorage.setItem("preferredLanguage", newLang);
    });
  }
}

function setLanguage(lang) {
  const langEn = document.querySelector(".lang-en");
  const langNp = document.querySelector(".lang-np");

  if (langEn && langNp) {
    if (lang === "en") {
      langEn.classList.add("active");
      langNp.classList.remove("active");
    } else {
      langEn.classList.remove("active");
      langNp.classList.add("active");
    }
  }

  // Note: In a full implementation, you would translate all text content here
  // For this demo, we're just toggling the visual indicator
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".service-card, .why-us-card, .testimonial-card, .contact-card, .about-feature",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((element) => {
    element.classList.add("animate-on-scroll");
    observer.observe(element);
  });
}

/* ============================================
   Active Navigation Link
   ============================================ */
function initActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", function () {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const navbar = document.getElementById("navbar");
      const navbarHeight = navbar ? navbar.offsetHeight : 0;

      if (window.scrollY >= sectionTop - navbarHeight - 100) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ============================================
   Utility Functions
   ============================================ */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add CSS for animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .notification-close i {
        width: 20px;
        height: 20px;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc2626;
    }
    
    .form-group input.error:focus,
    .form-group select.error:focus,
    .form-group textarea.error:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
`;
document.head.appendChild(style);

/* ============================================
   Performance Optimizations
   ============================================ */

// Lazy load images (if any are added later)
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add("loaded");
          observer.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Preload critical resources
function preloadResources() {
  const criticalResources = [
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Call preload on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadResources);
} else {
  preloadResources();
}

/* ============================================
   Error Handling
   ============================================ */
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.message);
});

window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Promise Rejection:", e.reason);
});

/* ============================================
   Service Worker Registration (Optional)
   ============================================ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    // Uncomment to enable service worker for offline support
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  });
}

console.log("Himalaya Dental Care - Website Loaded Successfully");
