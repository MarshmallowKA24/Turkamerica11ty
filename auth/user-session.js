// User session management
class UserSession {
    constructor() {
        this.init();
    }

    init() {
        // Check authentication on protected pages
        this.checkPageAuth();
        this.updateNavigation();
    }

    checkPageAuth() {
        const protectedPages = ['flashcard.html', 'Textos.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage)) {
            if (!window.auth.isLoggedIn()) {
                alert('Debes iniciar sesión para acceder a esta página');
                window.location.href = 'auth/login.html';
                return;
            }
        }
    }

    updateNavigation() {
        // Update navigation based on auth status
        const authButton = document.getElementById('authButton');
        const userInfo = document.getElementById('userInfo');
        
        if (window.auth.isLoggedIn()) {
            const user = window.auth.getCurrentUser();
            if (authButton) {
                authButton.innerHTML = `<span>Hola, ${user.username}</span> | <a href="#" onclick="window.auth.logout()">Cerrar Sesión</a>`;
            }
        } else {
            if (authButton) {
                authButton.innerHTML = `<a href="auth/login.html">Iniciar Sesión</a> | <a href="auth/register.html">Registrarse</a>`;
            }
        }
    }

    getUserData(dataType) {
        const user = window.auth.getCurrentUser();
        if (!user) return [];
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = users.find(u => u.id === user.id);
        
        return currentUser ? currentUser[dataType] || [] : [];
    }

    saveUserData(dataType, data) {
        const user = window.auth.getCurrentUser();
        if (!user) return;
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            users[userIndex][dataType] = data;
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Initialize session management
document.addEventListener('DOMContentLoaded', () => {
    window.userSession = new UserSession();
});