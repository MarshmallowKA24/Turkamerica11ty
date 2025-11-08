// ================================
// CONSEJOS PAGE - Toggle System compatible con 11ty
// ================================

(function() {
    'use strict';

    const CONFIG = {
        STORAGE_KEY: 'consejosProgress',
        ROTATION_KEY: 'consejosRotationDate',
        ENABLE_DAILY_ROTATION: true,
    };

    // -------------------------
    // Utilities
    // -------------------------
    function getTodayDateString() {
        return new Date().toDateString();
    }

    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function shuffleWithSeed(array, seed) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(seededRandom(seed + i) * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function getSeedFromDate(dateString) {
        return dateString.split(' ').reduce((acc, val) => acc + [...val].reduce((a,b)=>a+b.charCodeAt(0),0), 0);
    }

    function shouldRotate() {
        if (!CONFIG.ENABLE_DAILY_ROTATION) return false;
        const today = getTodayDateString();
        const lastRotation = localStorage.getItem(CONFIG.ROTATION_KEY);
        if (lastRotation !== today) {
            localStorage.setItem(CONFIG.ROTATION_KEY, today);
            return true;
        }
        return false;
    }

    function applyDailyRotation() {
        const containers = document.querySelectorAll('.activities');
        if (!containers.length) return;

        const today = getTodayDateString();
        const seed = getSeedFromDate(today);

        containers.forEach(container => {
            const items = Array.from(container.querySelectorAll('.activity-item'));
            if (!items.length) return;
            const shuffled = shuffleWithSeed(items, seed);
            items.forEach(i => i.remove());
            shuffled.forEach(i => container.appendChild(i));
        });

        console.log(`🔄 Daily rotation applied for ${today}`);
    }

    // -------------------------
    // Toggle Buttons
    // -------------------------
    function addToggleButtonsToItem(item) {
        if (item.querySelector('.toggle-btn')) return;

        const button = document.createElement('button');
        button.className = 'toggle-btn';
        button.type = 'button';

        const title = item.querySelector('h4')?.textContent?.trim() || 'activity';
        const timeSlot = item.querySelector('.time-slot')?.textContent?.trim() || '';
        const activityId = `${timeSlot}-${title}`.replace(/\s+/g, '-').toLowerCase();

        button.dataset.activityId = activityId;
        button.innerHTML = '<i class="fas fa-circle"></i>';
        button.setAttribute('aria-label', 'Marcar como completado');
        button.setAttribute('title', 'Marcar como completado');

        item.style.position = 'relative';
        item.appendChild(button);

        // Inicializa toggle para este botón
        initializeToggleForButton(button);
    }

    function initializeToggleForButton(button) {
        const savedProgress = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
        const activityId = button.dataset.activityId;
        const isCompleted = savedProgress[activityId]?.completed || false;

        updateButtonState(button, isCompleted);

        // Listener click
        button.addEventListener('click', () => handleToggle(button));
    }

   
    window.ConsejosDebug = window.ConsejosDebug || {};
    window.ConsejosDebug.checkErrors = monitorToggleErrors;

    // -------------------------
    // Main Init con polling
    // -------------------------
    function initWithPolling() {
        const interval = setInterval(() => {
            const items = document.querySelectorAll('.activity-item');
            if (items.length > 0) {
                clearInterval(interval);

                if (shouldRotate()) applyDailyRotation();

                items.forEach(item => addToggleButtonsToItem(item));
                updateProgressStats();

                // Monitoreo periódico opcional
                setInterval(monitorToggleErrors, 5000);

                console.log('✅ Consejos page initialized with polling');
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWithPolling);
    } else {
        initWithPolling();
    }

})();
