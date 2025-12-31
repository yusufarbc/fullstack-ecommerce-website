document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const createMobileMenu = () => {
        const navContent = document.querySelector('.nav-content');
        const navLinks = document.querySelector('.nav-links');

        if (!navContent || !navLinks) return;

        // Create hamburger button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'icon-btn mobile-menu-btn';
        hamburgerBtn.style.display = 'none'; // Hidden by default, shown via CSS
        hamburgerBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        `;

        // Wrapper for mobile header
        const mobileHeader = document.createElement('div');
        mobileHeader.className = 'mobile-header';

        // Add button logic
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            hamburgerBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Add to DOM
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            navActions.insertBefore(hamburgerBtn, navActions.firstChild);
        }

        // Add CSS for mobile menu visibility logic if not in original CSS
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .mobile-menu-btn { display: flex !important; }
                .nav-links { 
                    display: none; 
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    flex-direction: column;
                    padding: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                }
                .nav-links.active { display: flex; }
            }
        `;
        document.head.appendChild(style);
    };

    createMobileMenu();
});
