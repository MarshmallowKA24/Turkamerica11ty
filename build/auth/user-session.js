// Código para el formulario de LOGIN (debe existir en login.html)
document.addEventListener('DOMContentLoaded', () => {
     // Asegurarse de que AuthService esté disponible antes de proceder
     if (!window.AuthService) {
         console.error('AuthService no está disponible en user-session.js');
         return;
     }

    // Manejador para el formulario de LOGIN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // NOTA: Tu código original usa 'username' pero AuthService.login espera 'email'.
            // Ajusta según tu lógica, asumiendo que el login usa email:
            const email = document.getElementById('email').value; // Cambiado de username a email
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');

            try {
                // Usa la instancia global AuthService
                const result = await window.AuthService.login(email, password);
                if (result.success) {
                     // Limpiar mensaje de error si el login es exitoso
                     if(errorDiv) {
                        errorDiv.style.display = 'none';
                        errorDiv.textContent = '';
                     }
                    window.location.href = '../index.html';
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                 if(errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                 }
            }
        });
    }

    // Manejador para el formulario de REGISTRO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) { // <-- Comprobación clave
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorDiv = document.getElementById('registerErrorMessage'); // Usa un ID único si es posible

            // Función de validación de email (asegúrate de que exista o defínela)
            const validateEmail = (email) => {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            };

            try {
                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }

                if (!validateEmail(email)) {
                    throw new Error('Email inválido');
                }

                // Asegúrate de pasar los datos correctamente al AuthService
                const userData = { name: username, email: email, password: password };
                const result = await window.AuthService.register(userData); // Usar AuthService

                if (result.success) {
                    alert('¡Cuenta creada exitosamente!');
                    window.location.href = '../login.html'; // Redirigir al login después del registro
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                if(errorDiv) {
                   errorDiv.textContent = error.message;
                   errorDiv.style.display = 'block';
                }
            }
        });
    }

    // --- Código existente de UserSession ---
    class UserSession {
        constructor() {
            this.authService = window.AuthService; // Asignar directamente
            this.updateNavigation();
            this.setupEventListeners();
        }

        updateNavigation() {
            if (!this.authService) {
                console.error('AuthService no está disponible en UserSession');
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
                    // Asegúrate de que currentUser y currentUser.name existen
                    userInfo.textContent = currentUser && currentUser.name ? `¡Hola, ${currentUser.name}!` : '¡Hola!';
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
                        // Opcionalmente, redirigir a index o login
                        // window.location.href = '../index.html';
                    }
                });
            }
        }
    }

    // Inicializar UserSession
    if (!window.userSession) {
        window.userSession = new UserSession();
    }
});