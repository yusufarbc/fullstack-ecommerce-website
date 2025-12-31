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

    // ===== TECHNICAL TOAST SIMULATION =====

    // Create Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    function showTechToast(title, body, meta) {
        const toast = document.createElement('div');
        toast.className = 'tech-toast';
        toast.innerHTML = `
            <div class="toast-header">
                <span>🔄</span>
                <span>${title}</span>
            </div>
            <div class="toast-body">${body}</div>
            <div class="toast-meta">
                <span>${meta.left}</span>
                <span>${meta.right}</span>
            </div>
        `;

        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('visible');
        });

        // Remove after 4s
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // Bind Interaction Events

    // 1. Add to Cart (Simulates API POST)
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;

            showTechToast(
                'API Request Sent',
                `Adding <strong>"${productName}"</strong> to cart...<br>POST /api/v1/cart/items`,
                { left: 'Node.js Service', right: '24ms' }
            );

            // Simulate Success after 800ms
            setTimeout(() => {
                showTechToast(
                    'Database Update',
                    `Transaction committed to <strong>PostgreSQL</strong>.<br>Cart total recalculated.`,
                    { left: 'Prisma ORM', right: '12ms' }
                );

                // Update local Badge
                const countBadge = document.querySelector('.cart-count');
                countBadge.textContent = parseInt(countBadge.textContent) + 1;
            }, 800);
        });
    });

    // 2. Wishlist (Simulates Auth Guard)
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showTechToast(
                'Auth Middleware',
                `Checking <strong>JWT Token</strong> in authorization header...<br>User authenticated.`,
                { left: 'Passport.js', right: '5ms' }
            );
            setTimeout(() => {
                btn.classList.toggle('active');
                if (btn.style.fill === 'currentColor') btn.style.fill = 'none';
                else btn.style.fill = 'currentColor'; // Simple visual toggle
            }, 400);
        });
    });

    // 3. Category Filter (Simulates Query)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('.category-name').textContent;
            showTechToast(
                'Data Query',
                `SELECT * FROM products WHERE category = '${category}'<br>LIMIT 20 OFFSET 0`,
                { left: 'PostgreSQL', right: '15ms' }
            );
        });
    });

    // 4. Hero Button (Simulates Cache)
    const heroBtn = document.querySelector('.btn-primary');
    if (heroBtn) {
        heroBtn.addEventListener('click', () => {
            showTechToast(
                'Cache Hit',
                `Fetching collection "New Season"<br>Served from <strong>Redis</strong> cache.`,
                { left: 'Redis', right: '2ms' }
            );
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
