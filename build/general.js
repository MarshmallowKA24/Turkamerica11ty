// Utilidades globales
// Global namespace to avoid conflicts
window.AppUtils = window.AppUtils || {};

// ========================================
// DARK MODE SYSTEM
// ========================================
window.AppUtils.DarkMode = {
    init() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply initial theme
        if (savedTheme === 'enabled' || (!savedTheme && prefersDark)) {
            this.enable();
        }
        
        // Setup toggle listener
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                if (e.checked) {
                    this.enable();
                } else {
                    this.disable();
                }
            });
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
                const toggle = document.getElementById('darkModeToggle');
                if (e.newValue === 'enabled') {
                    document.body.classList.add('dark-mode');
                    if (toggle) toggle.checked = true;
                } else if (e.newValue === 'disabled') {
                    document.body.classList.remove('dark-mode');
                    if (toggle) toggle.checked = false;
                }
            }
        });
    },

    enable() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
        
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = true;
        
        this.applyTransition();
        this.trackUsage();
    },

    disable() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
        
        const toggle = document.getElementById('darkModeToggle');
        if (toggle) toggle.checked = false;
        
        this.applyTransition();
        this.trackUsage();
    },

    toggle() {
        if (this.isActive()) {
            this.disable();
        } else {
            this.enable();
        }
    },

    isActive() {
        return document.body.classList.contains('dark-mode');
    },

    getCurrentTheme() {
        return this.isActive() ? 'dark' : 'light';
    },

    reset() {
        localStorage.removeItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (prefersDark) {
            this.enable();
        } else {
            this.disable();
        }
    },

    applyTransition() {
        const body = document.body;
        body.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    },

    trackUsage() {
        const usage = JSON.parse(localStorage.getItem('themeUsage') || '{}');
        usage.switches = (usage.switches || 0) + 1;
        usage.lastChanged = new Date().toISOString();
        usage.preferred = this.getCurrentTheme();
        localStorage.setItem('themeUsage', JSON.stringify(usage));
    },

    getStats() {
        const usage = JSON.parse(localStorage.getItem('themeUsage') || '{}');
        return {
            currentTheme: this.getCurrentTheme(),
            totalSwitches: usage.switches || 0,
            lastChanged: usage.lastChanged || null,
            preferredTheme: usage.preferred || 'auto'
        };
    }
};

// ========================================
// SETTINGS MODAL SYSTEM
// ========================================
window.AppUtils.Settings = {
    init() {
        const settingsTab = document.getElementById('settingsTab');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const closeSettings = document.getElementById('closeSettings');

        if (!settingsTab || !settingsOverlay || !closeSettings) return;

        // Open settings
        settingsTab.addEventListener('click', (e) => {
            e.preventDefault();
            this.open();
        });

        // Close settings
        closeSettings.addEventListener('click', () => {
            this.close();
        });

        // Close when clicking outside
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) {
                this.close();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    },

    open() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },

    close() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },

    isOpen() {
        const overlay = document.getElementById('settingsOverlay');
        return overlay ? overlay.classList.contains('active') : false;
    }
};

// ========================================
// BUTTON INTERACTIONS
// ========================================
window.AppUtils.ButtonEffects = {
    init() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', this.addClickEffect.bind(this));
        });

        // For dynamically added buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                this.addClickEffect(e);
            }
        });
    },

    addClickEffect(event) {
        const btn = event.currentTarget || event.target;
        btn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }
};

// ========================================
// TAB SYSTEM
// ========================================
window.AppUtils.Tabs = {
    init() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', this.handleTabClick.bind(this));
        });
    },

    handleTabClick(event) {
        const clickedTab = event.currentTarget;
        
        // Remove active class from all tabs in the same group
        const tabGroup = clickedTab.closest('[data-tab-group]') || document;
        tabGroup.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        clickedTab.classList.add('active');
        
        // Handle tab content switching if data attributes are present
        const contentId = clickedTab.getAttribute('data-content');
        if (contentId) {
            this.showContent(contentId);
        }
    },

    showContent(contentId) {
        // Hide all content panels
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show selected content
        const targetContent = document.getElementById(contentId);
        if (targetContent) {
            targetContent.style.display = 'block';
        }
    }
};

// ========================================
// MODAL SYSTEM
// ========================================
window.AppUtils.Modal = {
    open(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;

        modal.style.display = 'flex';
        
        if (options.title) {
            const titleElement = modal.querySelector('.modal-title');
            if (titleElement) titleElement.textContent = options.title;
        }
        
        if (options.content) {
            const contentElement = modal.querySelector('.modal-content');
            if (contentElement) contentElement.innerHTML = options.content;
        }

        // Setup close handlers if not already done
        this.setupCloseHandlers(modalId);
        
        return true;
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    },

    setupCloseHandlers(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Close button
        const closeBtn = modal.querySelector('.close-modal, .modal-close');
        if (closeBtn && !closeBtn.dataset.listenerAdded) {
            closeBtn.addEventListener('click', () => this.close(modalId));
            closeBtn.dataset.listenerAdded = 'true';
        }

        // Click outside to close
        if (!modal.dataset.outsideListenerAdded) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close(modalId);
                }
            });
            modal.dataset.outsideListenerAdded = 'true';
        }

        // Escape key to close
        if (!modal.dataset.escapeListenerAdded) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    this.close(modalId);
                }
            });
            modal.dataset.escapeListenerAdded = 'true';
        }
    }
};

// ========================================
// Sistema de notificacion
// ========================================
window.AppUtils.Notification = {
    show(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.hide(notification));
        
        // Show animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide
        if (duration > 0) {
            setTimeout(() => this.hide(notification), duration);
        }
        
        return notification;
    },

    hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },

    success(message, duration) {
        return this.show(message, 'success', duration);
    },

    error(message, duration) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    },

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
};

// ========================================
// utilidades de accesibilidad
// ========================================
window.AppUtils.Accessibility = {
    init() {
        this.handleHighContrast();
        this.handleReducedMotion();
        this.setupKeyboardNavigation();
    },

    handleHighContrast() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }

        window.matchMedia('(prefers-contrast: high)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    },

    handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }

        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    },

    setupKeyboardNavigation() {
        // Ensure focusable elements are properly accessible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
};

// ========================================
// STORAGE UTILITIES
// ========================================
window.AppUtils.Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    }
};

// ========================================
// Funciones de utilidad
// ========================================
window.AppUtils.Utils = {
    //Conversion de Tiempo
    timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    },

    // Formato de tiempo
    formatDate(timestamp, locale = 'es-ES') {
        const date = new Date(timestamp);
        return date.toLocaleString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Debounce funcion
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Funcion de Throttle 
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
// Inicializacion
// ========================================
window.AppUtils.init = function() {
    // Initializar todos los sistemas cuando dom esta ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            this.DarkMode.init();
            this.Settings.init();
            this.ButtonEffects.init();
            this.Tabs.init();
            this.Accessibility.init();
        });
    } else {
        this.DarkMode.init();
        this.Settings.init();
        this.ButtonEffects.init();
        this.Tabs.init();
        this.Accessibility.init();
    }

    console.log('🚀 Global utilities initialized successfully!');
};

// ========================================
// compatibilidad trasera
// ========================================
// exporta al global scope para compatibilidad trasera
window.darkMode = window.AppUtils.DarkMode;
window.showNotification = (message, type) => window.AppUtils.Notification.show(message, type);

// Auto-initializar
window.AppUtils.init();