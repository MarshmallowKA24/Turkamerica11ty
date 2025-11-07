// ================================
// AUTHENTICATION SERVICE - TurkAmerica
// ================================

// Clase para manejar autenticación con backend
class AuthService {
    constructor() {
        this.token = localStorage.getItem(window.APP_CONFIG?.AUTH.TOKEN_KEY || 'authToken');
        this.currentUser = JSON.parse(localStorage.getItem(window.APP_CONFIG?.AUTH.USER_KEY || 'currentUser') || 'null');
    }

    // Verificar si el usuario está logueado
    isLoggedIn() {
        return this.token !== null && this.currentUser !== null;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Función de registro
    async register(userData) {
        try {
            const API_URL = window.APP_CONFIG 
                ? window.APP_CONFIG.getFullApiUrl(window.APP_CONFIG.ENDPOINTS.AUTH_REGISTER)
                : `${window.location.origin}/api/auth/register`;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData.name,
                    email: userData.email,
                    password: userData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }

            // Guardar token y datos del usuario
            this.token = data.token;
            this.currentUser = data.user;
            
            localStorage.setItem(window.APP_CONFIG?.AUTH.TOKEN_KEY || 'authToken', this.token);
            localStorage.setItem(window.APP_CONFIG?.AUTH.USER_KEY || 'currentUser', JSON.stringify(this.currentUser));

            // Dispatch event for UI update
            this.dispatchAuthEvent(true);
            
            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message };
        }
    }

    // Función de login
    async login(identifier, password) {
        try {
            const API_URL = window.APP_CONFIG 
                ? window.APP_CONFIG.getFullApiUrl(window.APP_CONFIG.ENDPOINTS.AUTH_LOGIN)
                : `${window.location.origin}/api/login/`;

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error en el login');
            }

            // Guardar token y datos del usuario
            this.token = data.token;
            this.currentUser = data.user;
            
            localStorage.setItem(window.APP_CONFIG?.AUTH.TOKEN_KEY || 'authToken', this.token);
            localStorage.setItem(window.APP_CONFIG?.AUTH.USER_KEY || 'currentUser', JSON.stringify(this.currentUser));

            // Dispatch event for UI update
            this.dispatchAuthEvent(true);

            return { success: true, user: this.currentUser };

        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: error.message };
        }
    }

    // Función de logout
    async logout() {
        try {
            // Opcional: llamar al endpoint de logout en el backend
            if (this.token) {
                const API_URL = window.APP_CONFIG 
                    ? window.APP_CONFIG.getFullApiUrl(window.APP_CONFIG.ENDPOINTS.AUTH_LOGOUT)
                    : `${window.location.origin}/api/auth/logout`;

                await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar datos locales
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem(window.APP_CONFIG?.AUTH.TOKEN_KEY || 'authToken');
            localStorage.removeItem(window.APP_CONFIG?.AUTH.USER_KEY || 'currentUser');
            
            // Dispatch event for UI update
            this.dispatchAuthEvent(false);
        }
    }

    // Verificar token con el servidor
    async verifyToken() {
        if (!this.token) return false;

        try {
            const API_URL = window.APP_CONFIG 
                ? window.APP_CONFIG.getFullApiUrl(window.APP_CONFIG.ENDPOINTS.AUTH_VERIFY)
                : `${window.location.origin}/api/auth/verify`;

            const response = await fetch(API_URL, {
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                await this.logout();
                return false;
            }

            const data = await response.json();
            this.currentUser = data.user;
            localStorage.setItem(window.APP_CONFIG?.AUTH.USER_KEY || 'currentUser', JSON.stringify(this.currentUser));
            
            return true;
        } catch (error) {
            console.error('Error verificando token:', error);
            await this.logout();
            return false;
        }
    }

    // Dispatch custom event for auth state changes
    dispatchAuthEvent(isLoggedIn) {
        const event = new CustomEvent('authStateChanged', {
            detail: {
                isLoggedIn: isLoggedIn,
                user: this.currentUser
            }
        });
        window.dispatchEvent(event);
    }

    // Obtener headers con autorización
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
        };
    }
}

// Crear instancia global
window.AuthService = new AuthService();

// ================================
// VALIDATION FUNCTIONS
// ================================

function validateEmail(email) {
    const config = window.APP_CONFIG?.VALIDATION.EMAIL.PATTERN || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return config.test(email);
}

function validateUsername(username) {
    if (!username) return false;
    const config = window.APP_CONFIG?.VALIDATION.USERNAME;
    if (!config) return username.length >= 3 && username.length <= 20;
    
    return username.length >= config.MIN_LENGTH && 
           username.length <= config.MAX_LENGTH &&
           config.PATTERN.test(username);
}

function validatePassword(password) {
    if (!password) return false;
    const config = window.APP_CONFIG?.VALIDATION.PASSWORD;
    if (!config) return password.length >= 6;
    
    return password.length >= config.MIN_LENGTH && 
           password.length <= config.MAX_LENGTH;
}

// ================================
// SUCCESS MESSAGE DISPLAY
// ================================

function showSuccessMessage(message, duration = 3000) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        animation: slideInRight 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Add icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-circle';
    icon.style.fontSize = '1.2rem';
    successDiv.insertBefore(icon, successDiv.firstChild);

    if (!document.getElementById('success-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'success-animation-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 300);
    }, duration);
}

function showErrorMessage(message, duration = 5000) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message-toast';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ef4444;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        animation: slideInRight 0.3s ease-out;
        font-family: 'Inter', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    // Add icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-exclamation-circle';
    icon.style.fontSize = '1.2rem';
    errorDiv.insertBefore(icon, errorDiv.firstChild);

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 300);
    }, duration);
}

// ================================
// FORM HANDLERS
// ================================

// Event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Manejador para el formulario de REGISTRO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorDiv = document.getElementById('errorMessage');
            
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }

            try {
                if (!validateUsername(username)) {
                    throw new Error('El nombre de usuario debe tener entre 3 y 20 caracteres y solo puede contener letras, números y guiones bajos');
                }

                if (!validateEmail(email)) {
                    throw new Error('Email inválido');
                }

                if (!validatePassword(password)) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }

                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                const submitBtn = registerForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';

                const userData = { 
                    name: username, 
                    email: email, 
                    password: password 
                };

                const result = await window.AuthService.register(userData);

                if (result.success) {
                    showSuccessMessage('¡Registro exitoso! Bienvenido/a');
                    
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    throw new Error(result.error);
                }
                const registerPanel = document.getElementById('register-panel'); // Check your register.html for the panel's ID
                const mainContent = document.getElementById('main-app-content'); // Check your index.html/register.html for the main content ID

                if (registerPanel) {
                    registerPanel.style.display = 'none'; // Hide the panel
                }
                if (mainContent) {
                    mainContent.style.display = 'block'; // Show the main content (if it was hidden)
                }


            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                }
                showErrorMessage(error.message);
            } finally {
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Registrarse';
                }
            }
        });
    }

    // Manejador para el formulario de LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');
            
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }

            try {
                if (!username) {
                    throw new Error('Por favor ingresa tu usuario o email');
                }

                if (!password) {
                    throw new Error('Por favor ingresa tu contraseña');
                }

                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';

                const result = await window.AuthService.login(username, password);

                if (result.success) {
                    showSuccessMessage('¡Login exitoso! Bienvenido/a de vuelta');
                    
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } else {
                    throw new Error(result.error);
                }

            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                }
                showErrorMessage(error.message);
            } finally {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }
            }
        });
    }
});

console.log('✅ Authentication system loaded');