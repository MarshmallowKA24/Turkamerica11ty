// ========================================
// INDEX.JS - Homepage specific functionality
// ========================================

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

// ========================================
// REGISTRATION MANAGEMENT
// ========================================
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

function handleLogout() {
    if (window.auth) {
        window.auth.logout();
        // Refresh the page or update UI
        location.reload();
    }
}

function updateUIAfterAuth() {
    checkRegistrationStatus();
    enableRegisteredUserFeatures();
}

function enableRegisteredUserFeatures() {
    // Enable flashcards generation button
    const flashcardBtn = document.querySelector('.btn-generate');
    if (flashcardBtn) {
        flashcardBtn.textContent = 'Generar Flashcards';
        flashcardBtn.href = 'flashcards.html';
        flashcardBtn.removeAttribute('aria-label');
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
// Listen for authentication events
window.addEventListener('authStateChanged', function(event) {
    if (event.detail && event.detail.isLoggedIn) {
        updateUIAfterAuth();
    } else {
        checkRegistrationStatus();
    }
});

// Listen for storage changes (cross-tab synchronization)
window.addEventListener('storage', function(e) {
    if (e.key === 'authToken' || e.key === 'currentUser') {
        checkRegistrationStatus();
    }
});

// Save state before page unload
window.addEventListener('beforeunload', function() {
    const currentTheme = window.AppUtils.DarkMode.getCurrentTheme();
    localStorage.setItem('darkMode', currentTheme === 'dark' ? 'enabled' : 'disabled');
});

// ========================================
// GLOBAL EXPORTS
// ========================================
// Expose registration management functions globally
window.registrationManager = {
    checkStatus: checkRegistrationStatus,
    updateUI: updateUIAfterAuth,
    enableFeatures: enableRegisteredUserFeatures
};

console.log('📋 Index page initialized successfully!');
console.log('🔐 Registration management system ready!');
console.log('Use window.registrationManager.checkStatus() to update registration status');