document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu logic
    const createMobileMenu = () => {
        const navContent = document.querySelector('.nav-content');
        const navLinks = document.querySelector('.nav-links');

        if (!navContent || !navLinks) return;

        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'icon-btn mobile-menu-btn';
        hamburgerBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;

        // CSS handled in styles.css now, no need to inject here
        // Just visibility logic
        hamburgerBtn.style.display = 'none';
        if (window.innerWidth <= 768) {
            hamburgerBtn.style.display = 'flex';
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) hamburgerBtn.style.display = 'flex';
            else hamburgerBtn.style.display = 'none';
        });

        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // If we didn't update CSS for .active properly, we can force display here
            if (navLinks.classList.contains('active')) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.background = 'white';
                navLinks.style.padding = '1rem';
                navLinks.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            } else {
                navLinks.style.display = ''; // Reset to css default
            }
        });

        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.insertBefore(hamburgerBtn, navActions.firstChild);
        }
    };

    createMobileMenu();

    // Standard Interactions (No Tech Toasts)

    // 1. Add to Cart (Simple Increment)
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update local Badge
            const countBadge = document.querySelector('.cart-count');
            countBadge.textContent = parseInt(countBadge.textContent) + 1;

            // Optional: Simple browser alert or non-technical toast could go here if requested
            // But keeping it silent/visual update only is cleaner for now.
        });
    });

    // 2. Wishlist (Simple Toggle)
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            if (btn.style.fill === 'currentColor') btn.style.fill = 'none';
            else btn.style.fill = 'currentColor';
        });
    });

    // 3. Hero Button (Scroll)
    const heroBtn = document.querySelector('.btn-primary');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
