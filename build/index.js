// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth system
    if (typeof window.auth !== 'undefined') {
        window.auth.init();
    }
    
    // Update user data manager
    if (window.auth && window.auth.isLoggedIn()) {
        window.userDataManager.setCurrentUser(window.auth.getCurrentUser());
    }
    
    // Check registration status and hide notice if user is registered/logged in
    checkRegistrationStatus();
});

// Function to check registration status and manage notice visibility
function checkRegistrationStatus() {
    const notice = document.querySelector('.notice');
    const authButton = document.getElementById('authButton');
    
    if (!notice) return; // Exit if notice element doesn't exist
    
    // Check if user is logged in
    if (window.auth && window.auth.isLoggedIn()) {
        // Hide the registration notice
        notice.style.display = 'none';
        
        // Update auth buttons to show user info or logout option
        if (authButton) {
            const currentUser = window.auth.getCurrentUser();
            authButton.innerHTML = `
                <span>Bienvenido, ${currentUser.username || currentUser.email}</span> | 
                <a href="#" onclick="handleLogout()">Cerrar Sesión</a>
            `;
        }
    } else {
        // Show the registration notice
        notice.style.display = 'flex';
    }
}

// Function to handle logout
function handleLogout() {
    if (window.auth) {
        window.auth.logout();
        // Refresh the page or update UI
        location.reload();
    }
}

// Function to update UI after successful login/registration
function updateUIAfterAuth() {
    checkRegistrationStatus();
    
    // You can add more UI updates here if needed
    // For example, enable/disable certain features
    enableRegisteredUserFeatures();
}

// Function to enable features for registered users
function enableRegisteredUserFeatures() {
    // Enable flashcards generation button
    const flashcardBtn = document.querySelector('.btn-generate');
    if (flashcardBtn) {
        flashcardBtn.textContent = 'Generar Flashcards';
        flashcardBtn.href = 'flashcards.html'; // or whatever the correct link should be
        flashcardBtn.removeAttribute('aria-label');
    }
    
    // You can add more feature enablement here
}

// Listen for authentication events (if your auth system supports it)
window.addEventListener('authStateChanged', function(event) {
    if (event.detail && event.detail.isLoggedIn) {
        updateUIAfterAuth();
    } else {
        checkRegistrationStatus();
    }
});

// Listen for storage changes (for cross-tab synchronization)
window.addEventListener('storage', function(e) {
    if (e.key === 'authToken' || e.key === 'currentUser') {
        checkRegistrationStatus();
    }
});

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// Settings panel functionality
const settingsTab = document.getElementById('settingsTab');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettings = document.getElementById('closeSettings');

settingsTab.addEventListener('click', function(e) {
    e.preventDefault();
    settingsOverlay.classList.add('active');
});

closeSettings.addEventListener('click', function() {
    settingsOverlay.classList.remove('active');
});

// Close settings when clicking outside
settingsOverlay.addEventListener('click', function(e) {
    if (e.target === settingsOverlay) {
        settingsOverlay.classList.remove('active');
    }
});

// Close settings with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && settingsOverlay.classList.contains('active')) {
        settingsOverlay.classList.remove('active');
    }
});

// Button interactions
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
    });
}

// Función para inicializar el modo oscuro
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar el tema inicial
    if (savedTheme === 'enabled' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.checked = true;
        }
    }
    
    // Manejar el cambio de tema
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
    
    // Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('darkMode')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
}

// Función para habilitar el modo oscuro
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    
    // Actualizar el toggle si existe
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = true;
    }
    
    // Aplicar animación suave
    applyThemeTransition();
}

// Función para deshabilitar el modo oscuro
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    
    // Actualizar el toggle si existe
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = false;
    }
    
    // Aplicar animación suave
    applyThemeTransition();
}

// Función para aplicar transición suave
function applyThemeTransition() {
    const body = document.body;
    body.style.transition = 'all 0.3s ease';
    
    // Remover la transición después de completarse
    setTimeout(() => {
        body.style.transition = '';
    }, 300);
}

// Función para alternar el modo oscuro (útil para otros botones)
function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Función para verificar si el modo oscuro está activo
function isDarkModeActive() {
    return document.body.classList.contains('dark-mode');
}

// Función para obtener el tema actual
function getCurrentTheme() {
    return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
}

// Función para aplicar el tema basado en la hora del día (opcional)
function applyTimeBasedTheme() {
    const hour = new Date().getHours();
    const isNightTime = hour >= 20 || hour <= 6;
    
    if (isNightTime && !localStorage.getItem('darkMode')) {
        enableDarkMode();
    }
}

// Función para sincronizar el tema entre pestañas
function syncThemeAcrossTabs() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'darkMode') {
            if (e.newValue === 'enabled') {
                document.body.classList.add('dark-mode');
                const darkModeToggle = document.getElementById('darkModeToggle');
                if (darkModeToggle) {
                    darkModeToggle.checked = true;
                }
            } else if (e.newValue === 'disabled') {
                document.body.classList.remove('dark-mode');
                const darkModeToggle = document.getElementById('darkModeToggle');
                if (darkModeToggle) {
                    darkModeToggle.checked = false;
                }
            }
        }
    });
}

// Función para manejar el contraste alto (accesibilidad)
function handleHighContrast() {
    if (window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
}

// Función para manejar la reducción de movimiento (accesibilidad)
function handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
}

// Función para exportar configuración del tema
function exportThemeSettings() {
    const settings = {
        darkMode: localStorage.getItem('darkMode'),
        timestamp: new Date().toISOString()
    };
    return JSON.stringify(settings);
}

// Función para importar configuración del tema
function importThemeSettings(settingsJson) {
    try {
        const settings = JSON.parse(settingsJson);
        if (settings.darkMode) {
            localStorage.setItem('darkMode', settings.darkMode);
            if (settings.darkMode === 'enabled') {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    } catch (error) {
        console.error('Error importing theme settings:', error);
    }
}

// Función para reiniciar configuración del tema
function resetThemeSettings() {
    localStorage.removeItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Función para aplicar tema personalizado
function applyCustomTheme(theme) {
    const validThemes = ['light', 'dark', 'auto'];
    
    if (!validThemes.includes(theme)) {
        console.warn('Invalid theme:', theme);
        return;
    }
    
    switch (theme) {
        case 'light':
            disableDarkMode();
            break;
        case 'dark':
            enableDarkMode();
            break;
        case 'auto':
            resetThemeSettings();
            break;
    }
}

// Función para obtener estadísticas del tema
function getThemeStats() {
    const usage = JSON.parse(localStorage.getItem('themeUsage') || '{}');
    return {
        currentTheme: getCurrentTheme(),
        totalSwitches: usage.switches || 0,
        lastChanged: usage.lastChanged || null,
        preferredTheme: usage.preferred || 'auto'
    };
}

// Función para rastrear uso del tema
function trackThemeUsage() {
    const usage = JSON.parse(localStorage.getItem('themeUsage') || '{}');
    usage.switches = (usage.switches || 0) + 1;
    usage.lastChanged = new Date().toISOString();
    usage.preferred = getCurrentTheme();
    localStorage.setItem('themeUsage', JSON.stringify(usage));
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    syncThemeAcrossTabs();
    handleHighContrast();
    handleReducedMotion();
    
    // Opcional: aplicar tema basado en la hora
    // applyTimeBasedTheme();
});

// Asegurar que la configuración se mantenga al recargar la página
window.addEventListener('beforeunload', function() {
    // Guardar el estado actual
    const currentTheme = getCurrentTheme();
    localStorage.setItem('darkMode', currentTheme === 'dark' ? 'enabled' : 'disabled');
});

// Exponer funciones globalmente para uso en otros scripts
window.darkMode = {
    enable: enableDarkMode,
    disable: disableDarkMode,
    toggle: toggleDarkMode,
    isActive: isDarkModeActive,
    getCurrentTheme: getCurrentTheme,
    applyCustomTheme: applyCustomTheme,
    reset: resetThemeSettings,
    export: exportThemeSettings,
    import: importThemeSettings,
    stats: getThemeStats
};

// Expose registration management functions globally
window.registrationManager = {
    checkStatus: checkRegistrationStatus,
    updateUI: updateUIAfterAuth,
    enableFeatures: enableRegisteredUserFeatures
};

// Mensaje de confirmación en consola
console.log('🌙 Dark mode system initialized successfully!');
console.log('📝 Registration management system initialized!');
console.log('Use window.darkMode.toggle() to switch themes programmatically');
console.log('Use window.registrationManager.checkStatus() to update registration status');