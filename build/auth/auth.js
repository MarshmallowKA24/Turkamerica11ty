// Definir DatabaseService si aún no existe para evitar errores de re-declaración
if (typeof DatabaseService === 'undefined') {
    class DatabaseService {
        constructor() {
            this.users = JSON.parse(localStorage.getItem('users') || '[]');
            this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        }

        saveUsers() {
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        saveCurrentUser(user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
        }

        clearCurrentUser() {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
        }

        findUserByEmail(email) {
            return this.users.find(user => user.email === email);
        }

        addUser(user) {
            this.users.push(user);
            this.saveUsers();
        }
    }
    // Hacer DatabaseService global
    window.DatabaseService = DatabaseService;
}

// Definir AuthService si aún no existe
if (typeof AuthService === 'undefined') {
    class AuthService {
        constructor() {
            this.db = new DatabaseService();
        }

        isLoggedIn() {
            return this.db.currentUser !== null;
        }

        getCurrentUser() {
            return this.db.currentUser;
        }

        async login(email, password) {
            try {
                const user = this.db.findUserByEmail(email);
                
                if (!user) {
                    throw new Error('Usuario no encontrado');
                }

                // Aquí validarías la contraseña (en un caso real, con hash)
                if (user.password !== password) {
                    throw new Error('Contraseña incorrecta');
                }

                this.db.saveCurrentUser(user);
                return { success: true, user };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        async register(userData) {
            try {
                // Verificar si el email ya está registrado
                const existingUser = this.db.findUserByEmail(userData.email);
                
                if (existingUser) {
                    throw new Error('El email ya está registrado');
                }

                // Crear nuevo usuario
                const newUser = {
                    id: Date.now().toString(),
                    name: userData.name,
                    email: userData.email,
                    password: userData.password, // En producción, usar hash
                    createdAt: new Date().toISOString()
                };

                // Guardar usuario y establecer como usuario actual
                this.db.addUser(newUser);
                this.db.saveCurrentUser(newUser);
                
                return { success: true, user: newUser };
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        logout() {
            this.db.clearCurrentUser();
        }
    }
    // Crear instancia global SOLO una vez
    window.AuthService = new AuthService();
}

// Validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Asegurarse de que el DOM esté cargado antes de añadir event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Manejador para el formulario de REGISTRO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) { // Comprobar que el elemento existe
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            // Asegúrate de que el ID del div de error es correcto, puede ser único para registro
            const errorDiv = document.getElementById('registerErrorMessage') || document.getElementById('errorMessage');
            
            try {
                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }
                
                if (!validateEmail(email)) {
                    throw new Error('Email inválido');
                }
                
                // Preparar datos para el registro
                const userData = { name: username, email: email, password: password };
                // Usar la instancia global AuthService
                const result = await window.AuthService.register(userData);
                
                if (result.success) {
                    alert('¡Cuenta creada exitosamente!');
                    // Redirigir a la página de login o inicio
                    window.location.href = '../login.html'; // O '../index.html'
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                if (errorDiv) {
                    errorDiv.textContent = error.message;
                    errorDiv.style.display = 'block';
                }
            }
        });
    }

    // Manejador para el formulario de LOGIN (asumiendo que está en login.html)
    const loginForm = document.getElementById('loginForm');
    if (loginForm) { // Comprobar que el elemento existe
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Asumiendo que el login usa email y password
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('errorMessage');
            
            try {
                // Usar la instancia global AuthService
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
});