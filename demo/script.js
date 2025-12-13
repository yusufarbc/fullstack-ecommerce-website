// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add to cart animation
const addToCartButtons = document.querySelectorAll('.btn-add-cart');
const cartCount = document.querySelector('.cart-count');
let itemCount = 3;

addToCartButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        // Increment cart count
        itemCount++;
        cartCount.textContent = itemCount;

        // Button animation
        const originalText = this.textContent;
        this.textContent = '✓ Eklendi';
        this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

        // Cart icon animation
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn.style.transform = 'scale(1.2)';

        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
            cartBtn.style.transform = '';
        }, 1500);
    });
});

// Wishlist toggle
const wishlistButtons = document.querySelectorAll('.wishlist-btn');

wishlistButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const svg = this.querySelector('svg');
        const path = svg.querySelector('path');

        if (path.getAttribute('fill') === 'currentColor') {
            path.setAttribute('fill', 'none');
            this.style.color = '';
        } else {
            path.setAttribute('fill', 'currentColor');
            this.style.color = '#ec4899';
        }

        // Animation
        this.style.transform = 'scale(1.3)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Product card hover effect - mouse tracking
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Search button functionality
const searchBtn = document.querySelector('.search-btn');
searchBtn.addEventListener('click', () => {
    alert('Arama özelliği yakında eklenecek! 🔍');
});

// User button functionality
const userBtn = document.querySelector('.user-btn');
userBtn.addEventListener('click', () => {
    alert('Giriş yapma özelliği yakında eklenecek! 👤');
});

// Cart button functionality
const cartBtn = document.querySelector('.cart-btn');
cartBtn.addEventListener('click', () => {
    alert(`Sepetinizde ${itemCount} ürün var! 🛒`);
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to elements
document.querySelectorAll('.product-card, .category-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax effect for hero orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.gradient-orb');

    orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.1);
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Category card click
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const categoryName = card.querySelector('.category-name').textContent;
        alert(`${categoryName} kategorisi yakında gelecek! 🎯`);
    });
});

// Console welcome message
console.log('%c🎨 LuxeShop E-Ticaret', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%cModern ve şık alışveriş deneyimi için tasarlandı.', 'font-size: 14px; color: #9ca3af;');
console.log('%cGitHub: @yusufarbc', 'font-size: 12px; color: #6366f1;');
