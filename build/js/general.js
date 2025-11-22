// ========================================
// GENERAL.JS - FIXED VERSION (FUNCIONALIDAD DE AJUSTES ESTABLE)
// Global utilities with proper initialization order
// ========================================

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
        
        // Sincroniza la configuración de toggle una vez que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggle());
        } else {
            this.setupToggle();
        }
        
        // Listeners for system preference and storage remain
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('darkMode')) {
                e.matches ? this.enable() : this.disable();
            }
        });
        
        window.addEventListener('storage', (e) => {
            if (e.key === 'darkMode') {
                e.newValue === 'enabled' ? this.enable() : this.disable();
            }
        });
    },

    setupToggle() {
        const toggles = document.querySelectorAll('#darkModeToggle, #darkModePref');
        toggles.forEach(toggle => {
            if (toggle) {
                toggle.checked = document.body.classList.contains('dark-mode');
                toggle.addEventListener('change', () => {
                    toggle.checked ? this.enable() : this.disable();
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

        // Esta lógica DEBE funcionar ahora que no hay conflicto de eventos
        if (settingsTab && overlay) {
            settingsTab.addEventListener('click', () => {
                e.stopImmediatePropagation();
                overlay.classList.add('active');
                document.body.classList.add('no-scroll');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close(overlay));
            }

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
// BUTTON RIPPLE/CLICK EFFECTS (FIX DEFINITIVO: LISTENERS DIRECTOS)
// ========================================
window.AppUtils.ButtonEffects = {
    init() {
        // Selecciona todos los elementos clicables, PERO EXCLUYE el que tiene id="settingsTab"
        const clickableElements = document.querySelectorAll(
            '.btn:not(#settingsTab), .tab:not(#settingsTab), .level-card, .resource-link, .explanation-btn, .close-modal'
        );

        // Reemplazamos el listener de 'document' por listeners directos en los elementos
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                // Previene que el evento burbujee al document y active otros listeners si es necesario
                // e.stopPropagation(); 
                this.addClickEffect(element, e);
            }, { passive: true });
        });
    },
    
    addClickEffect(element, event) {
        // --- FIX CRÍTICO: Asegura que el contenedor esté listo para el ripple ---
        // Se mantiene el fix inline para la estabilidad visual.
        if (element.style.position !== 'relative') {
             element.style.position = 'relative';
        }
        if (element.style.overflow !== 'hidden') {
             element.style.overflow = 'hidden';
        }
        // --- FIN FIX CRÍTICO ---

        // 1. Create the ripple element
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        // 2. Aplicar estilos inline al ripple para que no ocupe espacio
        ripple.style.position = 'absolute';
        ripple.style.pointerEvents = 'none';

        element.appendChild(ripple);

        // 3. Position the ripple
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // 4. Trigger animation
        ripple.classList.add('active');

        // 5. Remove ripple after animation
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

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ========================================
// CRITICAL FIX: INITIALIZATION WITH OPTIMIZED TIMING
// ========================================
window.AppUtils.init = function() {
    console.log('🔧 Initializing AppUtils...');
    
    // 1. Initialize dark mode FIRST (before DOM ready)
    this.DarkMode.init();
    
    // 2. Initialize other systems when DOM is ready
    const initOtherSystems = () => {
        this.Settings.init();
        this.ButtonEffects.init();
        this.Tabs.init();
        this.Accessibility.init();
        console.log('✅ Global utilities initialized successfully');
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initOtherSystems);
    } else {
        // DOM is already ready
        initOtherSystems();
    }
};

// ========================================
// AUTO-INITIALIZE CON LÓGICA SIMPLIFICADA
// ========================================
(function() {
    // Usamos DOMContentLoaded para una inicialización temprana y consistente.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.AppUtils.init);
    } else {
        // DOM ya está listo (interactive o complete)
        window.AppUtils.init();
    }
})();

console.log('📦 general.js loaded - waiting for CSS...');