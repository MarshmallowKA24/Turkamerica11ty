document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');
            
            try {
                await window.auth.login(username, password);
                window.location.href = '../index.html';
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            }
        });
class UserSession {
    constructor() {
        this.authService = null;
        this.init();
    }

    async init() {
        // Esperar a que AuthService esté disponible
        await this.waitForAuthService();
        this.updateNavigation();
        this.setupEventListeners();
    }

    // Método para esperar a que AuthService esté disponible
    async waitForAuthService() {
        return new Promise((resolve) => {
            const checkAuthService = () => {
                if (window.AuthService) {
                    this.authService = window.AuthService;
                    resolve();
                } else {
                    setTimeout(checkAuthService, 100);
                }
            };
            checkAuthService();
        });
    }

    updateNavigation() {
        // Verificar que authService existe antes de usarlo
        if (!this.authService) {
            console.error('AuthService no está disponible');
            return;
        }

        const isLoggedIn = this.authService.isLoggedIn();
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const userInfo = document.getElementById('userInfo');

        if (isLoggedIn) {
            const currentUser = this.authService.getCurrentUser();
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'block';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.textContent = `¡Hola, ${currentUser.name}!`;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (this.authService) {
                    this.authService.logout();
                    this.updateNavigation();
                }
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Asegurarse de que no haya múltiples instancias
    if (!window.userSession) {
        window.userSession = new UserSession();
    }
});