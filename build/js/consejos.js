// ========================================
// CONSEJOS.JS - Funcionalidad específica de la página de consejos
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeAdvicePage();
});

function initializeAdvicePage() {
    setupChannelEffects();
    setupActivityTracking();
    initializeTimeHighlighting();
}

// ========================================
// EFECTOS DE INTERACCIÓN DE CANALES
// ========================================
function setupChannelEffects() {
    document.querySelectorAll('.channel-item').forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// ========================================
// SEGUIMIENTO DE PROGRESO DE ACTIVIDADES
// ========================================
function setupActivityTracking() {
    document.querySelectorAll('.activity-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('completed');
            saveActivityProgress();
        });
    });
}

function saveActivityProgress() {
    const completedActivities = [];
    document.querySelectorAll('.activity-item.completed').forEach((item, index) => {
        completedActivities.push(index);
    });
    
    window.AppUtils.Storage.set('completedActivities', completedActivities);
}

function loadActivityProgress() {
    const completedActivities = window.AppUtils.Storage.get('completedActivities', []);
    const activityItems = document.querySelectorAll('.activity-item');
    
    completedActivities.forEach(index => {
        if (activityItems[index]) {
            activityItems[index].classList.add('completed');
        }
    });
}

// ========================================
// RESALTADO DE ACTIVIDADES BASADO EN TIEMPO
// ========================================
function initializeTimeHighlighting() {
    highlightCurrentActivity();
    setInterval(highlightCurrentActivity, 60000); // Actualizar cada minuto
}

function highlightCurrentActivity() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    document.querySelectorAll('.activity-item').forEach(item => {
        const timeSlot = item.querySelector('.time-slot');
        if (!timeSlot) return;
        
        const timeSlotText = timeSlot.textContent;
        const [startTime, endTime] = timeSlotText.split(' - ');
        
        if (startTime && endTime) {
            const startMinutes = window.AppUtils.Utils.timeToMinutes(startTime);
            const endMinutes = window.AppUtils.Utils.timeToMinutes(endTime);
            
            if (currentTime >= startMinutes && currentTime <= endMinutes) {
                item.classList.add('current-activity');
            } else {
                item.classList.remove('current-activity');
            }
        }
    });
}

// ========================================
// INICIALIZACIÓN DE PÁGINA
// ========================================
// Cargar progreso guardado cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadActivityProgress();
});

console.log('Página de consejos inicializada correctamente');