
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorDiv = document.getElementById('errorMessage');
            
            try {
                if (password !== confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }
                
                if (!validateEmail(email)) {
                    throw new Error('Email inválido');
                }
                
                await window.auth.register(username, password, email);
                alert('¡Cuenta creada exitosamente!');
                window.location.href = '../index.html';
            } catch (error) {
                errorDiv.textContent = error.message;
                errorDiv.style.display = 'block';
            }
        });
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
            const existingUser = this.db.findUserByEmail(userData.email);
            
            if (existingUser) {
                throw new Error('El email ya está registrado');
            }

            const newUser = {
                id: Date.now().toString(),
                name: userData.name,
                email: userData.email,
                password: userData.password, // En producción, usar hash
                createdAt: new Date().toISOString()
            };

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
if (!window.AuthService) {
    window.AuthService = new AuthService();
}