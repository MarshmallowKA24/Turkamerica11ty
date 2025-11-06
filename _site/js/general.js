// Utilidades globales
// Global namespace to avoid conflicts
window.AppUtils = window.AppUtils || {};
// ========================================
// DARK MODE SYSTEM
// ========================================
window.AppUtils.DarkMode = {
    init() {
        // Apply saved theme immediately (before DOM is fully ready)
        const savedTheme = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply initial theme to body immediately
        if (savedTheme === 'enabled' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Wait for DOM to be ready before setting up toggle
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupToggle();
            });
        } else {
            this.setupToggle();
        }
        
        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('darkMode')) {
                if (e.matches) {
                    this.enable();
                } else {
                    this.disable();
                }
            }
        });
        
        // Sync across tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'darkMode') {
                if (e.newValue === 'enabled') {
                    this.enable();
                } else {
                    this.disable();
                }
            }
        });
    },

    setupToggle() {
        // Find ALL dark mode toggles (in settings panel and potentially elsewhere)
        const toggles = document.querySelectorAll('#darkModeToggle, #darkModePref');
        
        toggles.forEach(toggle => {
            if (toggle) {
                // Set initial state
                toggle.checked = document.body.classList.contains('dark-mode');
                
                // Add listener
                toggle.addEventListener('change', () => {
                    if (toggle.checked) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                });
            }
        });
    },
    
    enable() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        this.updateToggleState(true);
    },
    
    disable() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        this.updateToggleState(false);
    },

    updateToggleState(isEnabled) {
        document.querySelectorAll('#darkModeToggle, #darkModePref').forEach(toggle => {
            if (toggle) {
                toggle.checked = isEnabled;
            }
        });
    }
};

// ========================================
// SETTINGS PANEL
// ========================================
window.AppUtils.Settings = {
    init() {
        const settingsTab = document.getElementById('settingsTab');
        const overlay = document.getElementById('settingsOverlay');
        const closeBtn = document.getElementById('closeSettings');

        if (settingsTab && overlay) {
            settingsTab.addEventListener('click', () => {
                overlay.classList.add('active');
                document.body.classList.add('no-scroll');
            });

            closeBtn.addEventListener('click', () => {
                this.close(overlay);
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(overlay);
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && overlay.classList.contains('active')) {
                    this.close(overlay);
                }
            });
        }
    },
    
    close(overlay) {
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};

// ========================================
// BUTTON RIPPLE/CLICK EFFECTS
// ========================================
window.AppUtils.ButtonEffects = {
    init() {
        // Apply ripple effect on click
        document.addEventListener('click', (e) => {
            // Find the closest clickable element
            const clickable = e.target.closest('.btn, .tab, .level-card, .resource-link, .explanation-btn, .close-modal');
            
            if (clickable) {
                this.addClickEffect(clickable, e);
            }
        }, { passive: true });
    },
    
    addClickEffect(element, event) {
        // 1. Create the ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        element.appendChild(ripple);

        // 2. Position the ripple
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // 3. Trigger animation
        ripple.classList.add('active');

        // 4. Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 400); // Must match CSS animation duration
    }
};


// ========================================
// TAB ACTIVE STATE
// ========================================
window.AppUtils.Tabs = {
    init() {
        const tabs = document.querySelectorAll('.tab');
        const currentPath = window.location.pathname;

        tabs.forEach(tab => {
            const tabPath = tab.getAttribute('href');
            
            // Remove 'active' from all tabs first
            tab.classList.remove('active');
            
            // Handle index.html vs /
            if (currentPath === '/' || currentPath.endsWith('index.html')) {
                if (tabPath === 'index.html' || tabPath === '/') {
                    tab.classList.add('active');
                }
            } 
            // Handle other pages
            else if (tabPath && currentPath.includes(tabPath)) {
                tab.classList.add('active');
            }
        });
    }
};

// ========================================
// ACCESSIBILITY & PREFERENCES
// ========================================
window.AppUtils.Accessibility = {
    init() {
        this.applySavedPreferences();
        this.setupPreferenceListeners();
    },
    
    applySavedPreferences() {
        // Font Size
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            this.updateFontSize(savedFontSize);
        }
        
        // Reduced Motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.body.classList.add('reduced-motion');
        }
    },
    
    setupPreferenceListeners() {
        const fontSizeSelect = document.getElementById('fontSizePref');
        if (fontSizeSelect) {
            fontSizeSelect.value = localStorage.getItem('fontSize') || 'medium';
            fontSizeSelect.addEventListener('change', (e) => {
                this.updateFontSize(e.target.value);
            });
        }
    },
    
    updateFontSize(size) {
        const sizes = { small: '14px', medium: '16px', large: '18px' };
        document.documentElement.style.fontSize = sizes[size] || '16px';
        localStorage.setItem('fontSize', size);
    }
};

// ========================================
// GENERIC UTILITIES
// ========================================
window.AppUtils.Utils = {
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // generar id unico
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Escape al HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};
// ========================================
// Inicialización
// ========================================
window.AppUtils.init = function() {
    // Initialize dark mode FIRST (before DOM ready to avoid flash)
    this.DarkMode.init();
    
    // Initialize other systems when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            this.Settings.init();
            this.ButtonEffects.init();
            this.Tabs.init();
            this.Accessibility.init();
            console.log('🚀 Global utilities initialized (post-DOM load)');
        });
    } else {
        // DOM is already ready, run them now
        this.Settings.init();
        this.ButtonEffects.init();
        this.Tabs.init();
        this.Accessibility.init();
        console.log('🚀 Global utilities initialized (DOM already loaded)');
    }
    // updateLogoutLinkVisibility(); // Esta función no está definida aquí, mover a auth.js o index.js
};

// ⬇️ CORRECCIÓN APLICADA ⬇️
// No llame a init() inmediatamente. Espere a que el DOM esté listo.
document.addEventListener('DOMContentLoaded', () => {
    window.AppUtils.init();
});
// ⬆️ FIN DE LA CORRECCIÓN ⬆️