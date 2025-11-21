// ========================================
// GENERAL.JS - FIXED VERSION
// Global utilities with proper initialization order
// ========================================

// Global namespace to avoid conflicts
window.AppUtils = window.AppUtils || {};

// ========================================
// DARK MODE SYSTEM (No necesita cambios funcionales)
// ========================================
window.AppUtils.DarkMode = {
    init() {
        const savedTheme = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
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
// SETTINGS PANEL (No necesita cambios)
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
// BUTTON RIPPLE/CLICK EFFECTS
// ========================================
window.AppUtils.ButtonEffects = {
    // === ESTA FUNCIÓN ESTÁ CAUSANDO EL PROBLEMA DE CRECIMIENTO ===
    init() {
        // Mantenemos el código de la función, pero su inicialización
        // ha sido COMENTADA en AppUtils.init() para deshabilitar el efecto.
        document.addEventListener('click', (e) => {
            const clickable = e.target.closest('.btn, .tab, .level-card, .resource-link, .explanation-btn, .close-modal');
            if (clickable) {
                this.addClickEffect(clickable, e);
            }
        }, { passive: true });
    },
    
    addClickEffect(element, event) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        element.appendChild(ripple);

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - (size / 2);
        const y = event.clientY - rect.top - (size / 2);

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        ripple.classList.add('active');

        // Se usa 400ms para que coincida con la duración del CSS, lo cual es correcto si se usa el efecto
        setTimeout(() => {
            ripple.remove();
        }, 400); 
    }
};

// ========================================
// TAB ACTIVE STATE (No necesita cambios)
// ========================================
window.AppUtils.Tabs = {
    init() {
        const tabs = document.querySelectorAll('.tab');
        const currentPath = window.location.pathname;

        tabs.forEach(tab => {
            const tabPath = tab.getAttribute('href');
            
            tab.classList.remove('active');
            
            // Lógica para / vs index.html
            if (currentPath === '/' || currentPath.endsWith('index.html')) {
                if (tabPath === 'index.html' || tabPath === '/') {
                    tab.classList.add('active');
                }
            } 
            // Lógica para otras páginas
            else if (tabPath && currentPath.includes(tabPath)) {
                tab.classList.add('active');
            }
        });
    }
};

// ========================================
// ACCESSIBILITY & PREFERENCES (No necesita cambios)
// ========================================
window.AppUtils.Accessibility = {
    init() {
        this.applySavedPreferences();
        this.setupPreferenceListeners();
    },
    
    applySavedPreferences() {
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            this.updateFontSize(savedFontSize);
        }
        
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
// GENERIC UTILITIES (No necesita cambios)
// ========================================
window.AppUtils.Utils = {
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
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ========================================
// CRITICAL FIX: INITIALIZATION WITH PROPER TIMING
// ========================================
window.AppUtils.init = function() {
    console.log('🔧 Initializing AppUtils...');
    
    // 1. Initialize dark mode FIRST (antes de DOM ready para evitar flash)
    this.DarkMode.init();
    
    // 2. Initialize other systems when DOM is ready
    const initOtherSystems = () => {
        // Se elimina el setTimeout(150) innecesario
        this.Settings.init();
        // === COMENTADO: CAUSA DEL PROBLEMA DE CRECIMIENTO ===
        // this.ButtonEffects.init(); 
        // ====================================================
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
    // Usamos DOMContentLoaded para una inicialización temprana y consistente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.AppUtils.init);
    } else {
        // DOM ya está listo (interactive o complete)
        window.AppUtils.init();
    }
})();

console.log('📦 general.js loaded - waiting for CSS...');