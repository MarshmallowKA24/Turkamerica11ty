// perfil.js - Gestión del perfil de usuario

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!window.AuthService || !window.AuthService.isLoggedIn()) {
        window.location.href = '/login/';
        return;
    }

    initProfile();
});

async function initProfile() {
    await loadUserProfile();
    await loadStreakData();
    setupEventListeners();
}

// ================================
// CARGAR DATOS DEL USUARIO
// ================================
async function loadUserProfile() {
    try {
        const user = window.AuthService.getCurrentUser();
        
        if (!user) {
            throw new Error('No user data');
        }

        // Datos básicos
        document.getElementById('userName').textContent = user.username || 'Usuario';
        document.getElementById('userEmail').textContent = user.email || '';
        document.getElementById('userLevel').textContent = user.profile?.level || 'A1';

        // Formulario de perfil
        if (user.profile) {
            document.getElementById('firstName').value = user.profile.firstName || '';
            document.getElementById('lastName').value = user.profile.lastName || '';
            document.getElementById('bio').value = user.profile.bio || '';
            document.getElementById('levelSelect').value = user.profile.level || 'A1';
            
            // Actualizar contador de caracteres
            updateCharCount();
        }

        // Preferencias
        if (user.preferences) {
            document.getElementById('darkModePref').checked = user.preferences.darkMode || false;
            document.getElementById('notificationsPref').checked = user.preferences.notifications !== false;
            document.getElementById('soundPref').checked = user.preferences.sound !== false;
            document.getElementById('languagePref').value = user.preferences.language || 'es';
            document.getElementById('fontSizePref').value = user.preferences.fontSize || 'medium';
            document.getElementById('dailyGoalPref').value = user.preferences.dailyGoal || 30;
        }

    } catch (error) {
        console.error('Error loading profile:', error);
        window.AppUtils.Notification.error('Error al cargar el perfil');
    }
}

// ================================
// CARGAR DATOS DEL STREAK
// ================================
async function loadStreakData() {
    try {
        // Actualizar streak en el servidor
        const updateResponse = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/update-streak`, {
            method: 'POST',
            headers: window.AuthService.getAuthHeaders()
        });

        if (updateResponse.ok) {
            const data = await updateResponse.json();
            displayStreak(data.streak);
        } else {
            // Si falla, intentar obtener el streak actual
            const getResponse = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/streak`, {
                headers: window.AuthService.getAuthHeaders()
            });

            if (getResponse.ok) {
                const data = await getResponse.json();
                displayStreak(data.streak);
            }
        }
    } catch (error) {
        console.error('Error loading streak:', error);
        // Mostrar valores por defecto
        displayStreak({
            current: 0,
            longest: 0,
            totalDays: 0,
            lastActivity: null
        });
    }
}

function displayStreak(streakData) {
    // Racha actual
    document.getElementById('currentStreak').textContent = streakData.current || 0;
    
    // Estadísticas
    document.getElementById('longestStreak').textContent = streakData.longest || 0;
    document.getElementById('totalDays').textContent = streakData.totalDays || 0;
    
    // Última actividad
    const lastActivity = document.getElementById('lastActivity');
    if (streakData.lastActivity) {
        const lastDate = new Date(streakData.lastActivity);
        const today = new Date();
        const diffTime = today - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            lastActivity.textContent = 'Hoy';
        } else if (diffDays === 1) {
            lastActivity.textContent = 'Ayer';
        } else {
            lastActivity.textContent = `Hace ${diffDays} días`;
        }
    } else {
        lastActivity.textContent = 'Hoy';
    }
    
    // Mensaje motivacional
    const messageEl = document.getElementById('streakMessage');
    const current = streakData.current || 0;
    const longest = streakData.longest || 0;
    
    let message = '';
    let icon = '🔥';
    
    if (current === 0) {
        message = '¡Empieza tu racha hoy! Cada día cuenta.';
        icon = '✨';
    } else if (current === 1) {
        message = '¡Comenzaste una nueva racha! Sigue así mañana.';
        icon = '🎉';
    } else if (current >= 7 && current < 30) {
        message = `¡Una semana completa! Llevas ${current} días seguidos. 🔥`;
        icon = '⭐';
    } else if (current >= 30 && current < 100) {
        message = `¡UN MES! ${current} días consecutivos. ¡Eres imparable! 🚀`;
        icon = '🏆';
    } else if (current >= 100) {
        message = `¡INCREÍBLE! ${current} días. Eres una leyenda del aprendizaje! 👑`;
        icon = '💎';
    } else {
        message = `¡Vas muy bien! ${current} días seguidos. `;
        if (longest > current) {
            message += `Tu récord es ${longest} días.`;
        }
    }
    
    if (messageEl) {
        messageEl.innerHTML = `${icon} ${message}`;
    }
}

// ================================
// SETUP EVENT LISTENERS
// ================================
function setupEventListeners() {
    // Contador de caracteres en biografía
    const bioTextarea = document.getElementById('bio');
    if (bioTextarea) {
        bioTextarea.addEventListener('input', updateCharCount);
    }

    // Formulario de perfil
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Guardar preferencias
    const savePrefBtn = document.getElementById('savePreferencesBtn');
    if (savePrefBtn) {
        savePrefBtn.addEventListener('click', handlePreferencesSave);
    }

    // Cerrar sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Cambiar contraseña
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handleChangePassword);
    }

    // Dark mode toggle sincronizado con general.js
    const darkModeToggle = document.getElementById('darkModePref');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (window.AppUtils && window.AppUtils.DarkMode) {
                if (this.checked) {
                    window.AppUtils.DarkMode.enable();
                } else {
                    window.AppUtils.DarkMode.disable();
                }
            }
        });
    }
}

// ================================
// ACTUALIZAR CONTADOR DE CARACTERES
// ================================
function updateCharCount() {
    const bioTextarea = document.getElementById('bio');
    const charCount = document.querySelector('.char-count');
    if (bioTextarea && charCount) {
        const count = bioTextarea.value.length;
        charCount.textContent = `${count}/500 caracteres`;
    }
}

// ================================
// GUARDAR PERFIL
// ================================
async function handleProfileSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const profileData = {
            profile: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                bio: document.getElementById('bio').value,
                level: document.getElementById('levelSelect').value
            }
        };

        const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: window.AuthService.getAuthHeaders(),
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            const data = await response.json();
            
            // Actualizar usuario local
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Actualizar UI
            document.getElementById('userName').textContent = data.user.username;
            document.getElementById('userLevel').textContent = data.user.profile.level;
            
            window.AppUtils.Notification.success('Perfil actualizado correctamente');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar');
        }
    } catch (error) {
        console.error('Error saving profile:', error);
        window.AppUtils.Notification.error(error.message || 'Error al guardar el perfil');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ================================
// GUARDAR PREFERENCIAS
// ================================
async function handlePreferencesSave() {
    const btn = document.getElementById('savePreferencesBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const preferencesData = {
            preferences: {
                darkMode: document.getElementById('darkModePref').checked,
                notifications: document.getElementById('notificationsPref').checked,
                sound: document.getElementById('soundPref').checked,
                language: document.getElementById('languagePref').value,
                fontSize: document.getElementById('fontSizePref').value,
                dailyGoal: parseInt(document.getElementById('dailyGoalPref').value)
            }
        };

        const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: window.AuthService.getAuthHeaders(),
            body: JSON.stringify(preferencesData)
        });

        if (response.ok) {
            const data = await response.json();
            
            // Actualizar usuario local
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Aplicar preferencias localmente
            applyPreferences(preferencesData.preferences);
            
            window.AppUtils.Notification.success('Preferencias guardadas correctamente');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar');
        }
    } catch (error) {
        console.error('Error saving preferences:', error);
        window.AppUtils.Notification.error(error.message || 'Error al guardar preferencias');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ================================
// APLICAR PREFERENCIAS
// ================================
function applyPreferences(preferences) {
    // Dark mode
    if (window.AppUtils && window.AppUtils.DarkMode) {
        if (preferences.darkMode) {
            window.AppUtils.DarkMode.enable();
        } else {
            window.AppUtils.DarkMode.disable();
        }
    }

    // Font size
    if (preferences.fontSize) {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.documentElement.style.fontSize = sizes[preferences.fontSize];
    }

    // Guardar en localStorage para sincronización
    localStorage.setItem('notifications', preferences.notifications);
    localStorage.setItem('sound', preferences.sound);
    localStorage.setItem('language', preferences.language);
}

// ================================
// CERRAR SESIÓN
// ================================
async function handleLogout() {
    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        return;
    }

    try {
        await window.AuthService.logout();
        window.AppUtils.Notification.success('Sesión cerrada correctamente');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        console.error('Error logging out:', error);
        window.AppUtils.Notification.error('Error al cerrar sesión');
    }
}

// ================================
// CAMBIAR CONTRASEÑA
// ================================
function handleChangePassword() {
    window.AppUtils.Notification.info('Funcionalidad próximamente disponible');
    // TODO: Implementar modal para cambiar contraseña
}

console.log('✅ Perfil inicializado correctamente');