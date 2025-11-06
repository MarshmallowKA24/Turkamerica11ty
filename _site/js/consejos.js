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
    loadActivityProgress();
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
    
    // Use localStorage directly instead of AppUtils
    try {
        localStorage.setItem('completedActivities', JSON.stringify(completedActivities));
    } catch (error) {
        console.error('Error saving activity progress:', error);
    }
}

function loadActivityProgress() {
    try {
        const savedData = localStorage.getItem('completedActivities');
        const completedActivities = savedData ? JSON.parse(savedData) : [];
        const activityItems = document.querySelectorAll('.activity-item');
        
        completedActivities.forEach(index => {
            if (activityItems[index]) {
                activityItems[index].classList.add('completed');
            }
        });
    } catch (error) {
        console.error('Error loading activity progress:', error);
    }
}

// ========================================
// RESALTADO DE ACTIVIDADES BASADO EN TIEMPO
// ========================================
function initializeTimeHighlighting() {
    highlightCurrentActivity();
    setInterval(highlightCurrentActivity, 60000); // Actualizar cada minuto
}

function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
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
            const startMinutes = timeToMinutes(startTime.trim());
            const endMinutes = timeToMinutes(endTime.trim());
            
            if (currentTime >= startMinutes && currentTime <= endMinutes) {
                item.classList.add('current-activity');
            } else {
                item.classList.remove('current-activity');
            }
        }
    });
}

console.log('Página de consejos inicializada correctamente');