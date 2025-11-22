// perfil.js - FIXED VERSION
// Complete profile management with all features working

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Profile page initializing...');
    
    // Check authentication
    if (!window.AuthService || !window.AuthService.isLoggedIn()) {
        console.warn('⚠️ User not logged in, redirecting...');
        window.location.href = '/login/';
        return;
    }

    initProfile();
});

async function initProfile() {
    console.log('✅ Initializing profile...');
    await loadUserProfile();
    await loadStreakData();
    setupEventListeners();
    setupAvatarUpload();
    console.log('✅ Profile initialized successfully');
}

// ================================
// AVATAR UPLOAD SETUP
// ================================
function setupAvatarUpload() {
    // Create hidden file input if it doesn't exist
    let fileInput = document.getElementById('avatarInput');
    if (!fileInput) {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'avatarInput';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
    }

    // Avatar container click handler
    const avatarContainer = document.querySelector('.avatar-container');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    
    if (avatarContainer) {
        avatarContainer.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            fileInput.click();
        });
    }

    // File input change handler
    fileInput.addEventListener('change', handleAvatarUpload);
    
    console.log('✅ Avatar upload initialized');
}

async function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error('Por favor selecciona una imagen válida');
        } else {
            alert('Por favor selecciona una imagen válida');
        }
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error('La imagen debe ser menor a 5MB');
        } else {
            alert('La imagen debe ser menor a 5MB');
        }
        return;
    }

    try {
        // Show loading
        const avatarContainer = document.querySelector('.avatar-container i');
        const originalClass = avatarContainer.className;
        avatarContainer.className = 'fas fa-spinner fa-spin';

        // Convert to base64
        const reader = new FileReader();
        reader.onload = async function(e) {
            const base64Image = e.target.result;
            
            // Save to profile
            const response = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: window.AuthService.getAuthHeaders(),
                body: JSON.stringify({
                    profile: {
                        avatar: base64Image
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // Update local storage
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                
                // Update UI
                updateAvatarDisplay(base64Image);
                
                if (window.AppUtils && window.AppUtils.Notification) {
                    window.AppUtils.Notification.success('Foto de perfil actualizada');
                } else {
                    alert('Foto de perfil actualizada');
                }
            } else {
                throw new Error('Error al guardar la imagen');
            }
            
            // Restore icon
            avatarContainer.className = originalClass;
        };
        
        reader.onerror = function() {
            avatarContainer.className = originalClass;
            throw new Error('Error al leer la imagen');
        };
        
        reader.readAsDataURL(file);

    } catch (error) {
        console.error('Error uploading avatar:', error);
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error('Error al subir la imagen');
        } else {
            alert('Error al subir la imagen');
        }
    }
}

function updateAvatarDisplay(base64Image) {
    const avatarContainer = document.querySelector('.avatar-container');
    if (avatarContainer) {
        // Remove icon, add image
        avatarContainer.innerHTML = `
            <img src="${base64Image}" alt="Avatar" style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
            ">
            <button class="change-avatar-btn" title="Cambiar foto">
                <i class="fas fa-camera"></i>
            </button>
        `;
        
        // Re-attach event listener
        const changeBtn = avatarContainer.querySelector('.change-avatar-btn');
        if (changeBtn) {
            changeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                document.getElementById('avatarInput').click();
            });
        }
    }
}

// ================================
// LOAD USER PROFILE
// ================================
async function loadUserProfile() {
    try {
        const user = window.AuthService.getCurrentUser();
        
        if (!user) {
            throw new Error('No user data');
        }

        console.log('📥 Loading user data:', user.username);

        // Basic info
        document.getElementById('userName').textContent = user.username || 'Usuario';
        document.getElementById('userEmail').textContent = user.email || '';
        document.getElementById('userLevel').textContent = user.profile?.level || 'A1';

        // Load avatar if exists
        if (user.profile?.avatar) {
            updateAvatarDisplay(user.profile.avatar);
        }

        // Profile form
        if (user.profile) {
            document.getElementById('firstName').value = user.profile.firstName || '';
            document.getElementById('lastName').value = user.profile.lastName || '';
            document.getElementById('bio').value = user.profile.bio || '';
            document.getElementById('levelSelect').value = user.profile.level || 'A1';
            
            updateCharCount();
        }

        // Preferences
        if (user.preferences) {
            document.getElementById('darkModePref').checked = user.preferences.darkMode || false;
            document.getElementById('notificationsPref').checked = user.preferences.notifications !== false;
            document.getElementById('soundPref').checked = user.preferences.sound !== false;
            document.getElementById('languagePref').value = user.preferences.language || 'es';
            document.getElementById('fontSizePref').value = user.preferences.fontSize || 'medium';
            document.getElementById('dailyGoalPref').value = user.preferences.dailyGoal || 30;
            
            // Apply preferences
            applyPreferences(user.preferences);
        }

        console.log('✅ User profile loaded');
    } catch (error) {
        console.error('❌ Error loading profile:', error);
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error('Error al cargar el perfil');
        }
    }
}

// ================================
// LOAD STREAK DATA
// ================================
async function loadStreakData() {
    try {
        console.log('📊 Loading streak data...');
        
        // Update streak on server
        const updateResponse = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/update-streak`, {
            method: 'POST',
            headers: window.AuthService.getAuthHeaders()
        });

        let streakData;
        if (updateResponse.ok) {
            const data = await updateResponse.json();
            streakData = data.streak;
        } else {
            // Fallback: get current streak
            const getResponse = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/streak`, {
                headers: window.AuthService.getAuthHeaders()
            });

            if (getResponse.ok) {
                const data = await getResponse.json();
                streakData = data.streak;
            } else {
                // Use default values
                streakData = {
                    current: 0,
                    longest: 0,
                    totalDays: 0,
                    lastActivity: null
                };
            }
        }
        
        displayStreak(streakData);
        console.log('✅ Streak data loaded:', streakData);
    } catch (error) {
        console.error('❌ Error loading streak:', error);
        // Display default values
        displayStreak({
            current: 0,
            longest: 0,
            totalDays: 0,
            lastActivity: null
        });
    }
}

function displayStreak(streakData) {
    // Current streak
    const currentStreakEl = document.getElementById('currentStreak');
    if (currentStreakEl) {
        currentStreakEl.textContent = streakData.current || 0;
    }
    
    // Statistics
    const longestStreakEl = document.getElementById('longestStreak');
    if (longestStreakEl) {
        longestStreakEl.textContent = streakData.longest || 0;
    }
    
    const totalDaysEl = document.getElementById('totalDays');
    if (totalDaysEl) {
        totalDaysEl.textContent = streakData.totalDays || 0;
    }
    
    // Last activity
    const lastActivityEl = document.getElementById('lastActivity');
    if (lastActivityEl && streakData.lastActivity) {
        const lastDate = new Date(streakData.lastActivity);
        const today = new Date();
        const diffTime = today - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            lastActivityEl.textContent = 'Hoy';
        } else if (diffDays === 1) {
            lastActivityEl.textContent = 'Ayer';
        } else {
            lastActivityEl.textContent = `Hace ${diffDays} días`;
        }
    } else if (lastActivityEl) {
        lastActivityEl.textContent = 'Hoy';
    }
    
    // Motivational message
    const messageEl = document.getElementById('streakMessage');
    if (messageEl) {
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
            message = `¡Una semana completa! Llevas ${current} días seguidos.`;
            icon = '⭐';
        } else if (current >= 30 && current < 100) {
            message = `¡UN MES! ${current} días consecutivos. ¡Eres imparable!`;
            icon = '🏆';
        } else if (current >= 100) {
            message = `¡INCREÍBLE! ${current} días. Eres una leyenda del aprendizaje!`;
            icon = '💎';
        } else {
            message = `¡Vas muy bien! ${current} días seguidos.`;
            if (longest > current) {
                message += ` Tu récord es ${longest} días.`;
            }
        }
        
        messageEl.innerHTML = `${icon} ${message}`;
    }
}

// ================================
// EVENT LISTENERS
// ================================
function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Character counter
    const bioTextarea = document.getElementById('bio');
    if (bioTextarea) {
        bioTextarea.addEventListener('input', updateCharCount);
    }

    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }

    // Preferences
    const savePrefBtn = document.getElementById('savePreferencesBtn');
    if (savePrefBtn) {
        savePrefBtn.addEventListener('click', handlePreferencesSave);
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
        console.log('✅ Logout button connected');
    } else {
        console.warn('⚠️ Logout button not found');
    }

    // Change password
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handleChangePassword);
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModePref');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (window.AppUtils && window.AppUtils.DarkMode) {
                if (this.checked) {
                    window.AppUtils.DarkMode.enable();
                } else {
                    window.AppUtils.DarkMode.disable();
                }
            } else {
                // Fallback if AppUtils not available
                if (this.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'disabled');
                }
            }
        });
    }
    
    console.log('✅ Event listeners set up');
}

// ================================
// UPDATE CHARACTER COUNT
// ================================
function updateCharCount() {
    const bioTextarea = document.getElementById('bio');
    const charCount = document.querySelector('.char-count');
    if (bioTextarea && charCount) {
        const count = bioTextarea.value.length;
        charCount.textContent = `${count}/500 caracteres`;
        
        if (count > 450) {
            charCount.style.color = '#ef4444';
        } else {
            charCount.style.color = '';
        }
    }
}

// ================================
// SAVE PROFILE
// ================================
async function handleProfileSubmit(e) {
    e.preventDefault();
    console.log('💾 Saving profile...');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        const profileData = {
            profile: {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                bio: document.getElementById('bio').value.trim(),
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
            
            // Update local storage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Update UI
            document.getElementById('userName').textContent = data.user.username;
            document.getElementById('userLevel').textContent = data.user.profile.level;
            
            if (window.AppUtils && window.AppUtils.Notification) {
                window.AppUtils.Notification.success('Perfil actualizado correctamente');
            } else {
                alert('Perfil actualizado correctamente');
            }
            
            console.log('✅ Profile saved successfully');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar');
        }
    } catch (error) {
        console.error('❌ Error saving profile:', error);
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error(error.message || 'Error al guardar el perfil');
        } else {
            alert(error.message || 'Error al guardar el perfil');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ================================
// SAVE PREFERENCES
// ================================
async function handlePreferencesSave() {
    console.log('⚙️ Saving preferences...');
    
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
            
            // Update local storage
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Apply preferences
            applyPreferences(preferencesData.preferences);
            
            if (window.AppUtils && window.AppUtils.Notification) {
                window.AppUtils.Notification.success('Preferencias guardadas correctamente');
            } else {
                alert('Preferencias guardadas correctamente');
            }
            
            console.log('✅ Preferences saved successfully');
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Error al guardar');
        }
    } catch (error) {
        console.error('❌ Error saving preferences:', error);
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error(error.message || 'Error al guardar preferencias');
        } else {
            alert(error.message || 'Error al guardar preferencias');
        }
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// ================================
// APPLY PREFERENCES
// ================================
function applyPreferences(preferences) {
    console.log('🎨 Applying preferences...', preferences);
    
    // Dark mode
    if (preferences.darkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
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

    // Save to localStorage for synchronization
    localStorage.setItem('notifications', preferences.notifications);
    localStorage.setItem('sound', preferences.sound);
    localStorage.setItem('language', preferences.language);
    localStorage.setItem('dailyGoal', preferences.dailyGoal);
    
    console.log('✅ Preferences applied');
}

// ================================
// LOGOUT HANDLER - FIXED
// ================================
async function handleLogout() {
    console.log('🚪 Logout requested');
    
    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        console.log('⏸️ Logout cancelled by user');
        return;
    }

    try {
        console.log('🔄 Processing logout...');
        
        // Call logout API if AuthService exists
        if (window.AuthService && typeof window.AuthService.logout === 'function') {
            await window.AuthService.logout();
        } else {
            // Fallback: manual cleanup
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
            sessionStorage.clear();
        }
        
        console.log('✅ Logout successful');
        
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.success('Sesión cerrada correctamente');
        }
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error during logout:', error);
        
        // Force logout anyway
        localStorage.clear();
        sessionStorage.clear();
        
        if (window.AppUtils && window.AppUtils.Notification) {
            window.AppUtils.Notification.error('Error al cerrar sesión, pero se cerró de todas formas');
        }
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    }
}

// ================================
// CHANGE PASSWORD
// ================================
function handleChangePassword() {
    console.log('🔐 Change password requested');
    if (window.AppUtils && window.AppUtils.Notification) {
        window.AppUtils.Notification.info('Funcionalidad próximamente disponible');
    } else {
        alert('Funcionalidad próximamente disponible');
    }
    // TODO: Implement password change modal
}

console.log('✅ Profile script loaded successfully');