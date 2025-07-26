// Configuración de la API
const API_BASE_URL = window.location.origin + '/api'; // Usar la misma URL base

// Clase para manejar autenticación con backend
class AuthService {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
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
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
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

            // Después del registro exitoso, hacer login automáticamente
            const loginResult = await this.login(userData.email, userData.password);
            
            return loginResult;

        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message };
        }
    }

    // Función de login
    async login(identifier, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier, // puede ser username o email
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
            
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

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
                await fetch(`${API_BASE_URL}/auth/logout`, {
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
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
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

// Validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Función para mostrar mensajes de éxito
function showSuccessMessage(message, duration = 3000) {
    // Crear elemento de mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    // Agregar estilos de animación si no existen
    if (!document.getElementById('success-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'success-animation-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(successDiv);

    // Remover mensaje después del tiempo especificado
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, duration);
}

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
            
            // Limpiar mensaje de error previo
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }

            try {
                // Validaciones del frontend
                if (username.length < 3) {
                    throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
                }

                if (!validateEmail(email)) {
                    throw new Error('Email inválido');
                }

                if (password.length < 6) {
                    throw new Error('La contraseña debe tener al menos 6 caracteres');
                }

                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                // Deshabilitar botón mientras se procesa
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Registrando...';

                // Preparar datos para el registro
                const userData = { 
                    name: username, 
                    email: email, 
                    password: password 
                };

                // Llamar al servicio de registro
                const result = await window.AuthService.register(userData);

                if (result.success) {
                    showSuccessMessage('¡Registro exitoso! Bienvenido/a');
                    
                    // Esperar un momento para que el usuario vea el mensaje
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                } else {
                    throw new Error(result.error);
                }

            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                }
            } finally {
                // Rehabilitar botón
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
            
            // Limpiar mensaje de error previo
            if (errorDiv) {
                errorDiv.style.display = 'none';
                errorDiv.textContent = '';
            }

            try {
                // Validaciones básicas
                if (!username) {
                    throw new Error('Por favor ingresa tu usuario o email');
                }

                if (!password) {
                    throw new Error('Por favor ingresa tu contraseña');
                }

                // Deshabilitar botón mientras se procesa
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Iniciando sesión...';

                // Llamar al servicio de login
                const result = await window.AuthService.login(username, password);

                if (result.success) {
                    showSuccessMessage('¡Login exitoso! Bienvenido/a de vuelta');
                    
                    // Esperar un momento para que el usuario vea el mensaje
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                } else {
                    throw new Error(result.error);
                }

            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                }
            } finally {
                // Rehabilitar botón
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }
            }
        });
    }
});