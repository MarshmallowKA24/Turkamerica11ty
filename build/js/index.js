// ========================================
// INDEX.JS - Homepage specific functionality
// ========================================

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth system
    if (typeof window.AuthService !== 'undefined') {
        checkAuthenticationStatus();
    }
    
    // Check registration status and hide notice if user is registered/logged in
    updateUIBasedOnAuth();
});

// ========================================
// AUTHENTICATION CHECK
// ========================================
function checkAuthenticationStatus() {
    const token = localStorage.getItem('authToken');
    const currentUser = localStorage.getItem('currentUser');
    
    if (token && currentUser) {
        try {
            const user = JSON.parse(currentUser);
            if (window.userDataManager) {
                window.userDataManager.setCurrentUser(user);
            }
            updateUIBasedOnAuth();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
    }
}

// ========================================
// UI UPDATE BASED ON AUTHENTICATION
// ========================================
function updateUIBasedOnAuth() {
    const notice = document.querySelector('.notice');
    const authButtonContainer = document.getElementById('authButton');
    const token = localStorage.getItem('authToken');
    const currentUserStr = localStorage.getItem('currentUser');
    
    const isLoggedIn = token && currentUserStr;
    
    if (isLoggedIn) {
        try {
            const currentUser = JSON.parse(currentUserStr);
            
            // Hide the registration notice
            if (notice) {
                notice.style.display = 'none';
            }
            
            // Update auth buttons to show user info
            if (authButtonContainer) {
                authButtonContainer.innerHTML = `
                    <span style="color: #E0E0E0; margin-right: 10px;">
                        Bienvenido, ${currentUser.username || currentUser.email}
                    </span>
                    <a href="#" onclick="handleLogout(); return false;" 
                       style="color: #BB86FC; text-decoration: none; padding: 8px 16px; 
                              border: 1px solid #BB86FC; border-radius: 20px; 
                              transition: all 0.3s ease;">
                        Cerrar Sesión
                    </a>
                `;
            }
            
            // Enable flashcard generation button
            enableRegisteredUserFeatures();
            
        } catch (error) {
            console.error('Error parsing user data:', error);
            showLoginState();
        }
    } else {
        showLoginState();
    }
}

// ========================================
// SHOW LOGIN STATE (NOT LOGGED IN)
// ========================================
function showLoginState() {
    const notice = document.querySelector('.notice');
    const authButtonContainer = document.getElementById('authButton');
    
    // Mostrar el aviso de registro
    if (notice) {
        notice.style.display = 'flex';
    }
    
    // Mostrar solo enlace de texto para iniciar sesión
    if (authButtonContainer) {
        authButtonContainer.innerHTML = `
            <a href="auth/login.html" 
               style="color: #ffffffff; text-decoration: underline;">
                Inicia Sesión
            </a>
        `;
    }
}


// ========================================
// LOGOUT HANDLER
// ========================================
function handleLogout() {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Show logout message
    if (window.AppUtils && window.AppUtils.Notification) {
        window.AppUtils.Notification.success('Sesión cerrada correctamente');
    }
    
    // Update UI
    setTimeout(() => {
        showLoginState();
        
        // Reload page to reset state
        location.reload();
    }, 1000);
}

// ========================================
// ENABLE REGISTERED USER FEATURES
// ========================================
function enableRegisteredUserFeatures() {
    // Enable flashcards generation button
    const flashcardBtn = document.querySelector('.btn-generate');
    if (flashcardBtn) {
        flashcardBtn.innerHTML = `
            <span class="icon-magic"></span>
            Generar Flashcards
        `;
        flashcardBtn.href = 'flashcards.html';
        flashcardBtn.onclick = null;
        
        // Remove any disabled attributes
        flashcardBtn.removeAttribute('disabled');
        flashcardBtn.style.opacity = '1';
        flashcardBtn.style.cursor = 'pointer';
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

// Listen for storage changes (cross-tab synchronization)
window.addEventListener('storage', function(e) {
    if (e.key === 'authToken' || e.key === 'currentUser') {
        updateUIBasedOnAuth();
    }
});

// Listen for authentication events
window.addEventListener('authStateChanged', function(event) {
    if (event.detail && event.detail.isLoggedIn) {
        updateUIBasedOnAuth();
    } else {
        showLoginState();
    }
});

// Save state before page unload
window.addEventListener('beforeunload', function() {
    // Optional: save any state if needed
});

// ========================================
// CHECK AUTH ON VISIBILITY CHANGE
// ========================================
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, check auth status
        updateUIBasedOnAuth();
    }
});

// ========================================
// GLOBAL EXPORTS
// ========================================
window.registrationManager = {
    checkStatus: updateUIBasedOnAuth,
    enableFeatures: enableRegisteredUserFeatures,
    showLoginState: showLoginState
};

// Make handleLogout available globally
window.handleLogout = handleLogout;

console.log('📋 Index page initialized successfully!');
console.log('🔐 Authentication system ready!');