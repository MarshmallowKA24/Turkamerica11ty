// ================================
// CONSEJOS PAGE - Toggle System
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Consejos page loaded');
    
    // Get saved progress
    const savedProgress = JSON.parse(localStorage.getItem('consejosProgress') || '{}');
    
    // Find all toggle buttons
    const toggleButtons = document.querySelectorAll(
        '.toggle-done-btn, .btn-done, [data-toggle], .mark-complete-btn, button[data-consejo-id]'
    );
    
    console.log(`Found ${toggleButtons.length} toggle buttons`);
    
    // Initialize each button
    toggleButtons.forEach((button, index) => {
        // Generate unique ID
        const buttonId = button.dataset.consejoId || 
                        button.dataset.toggle || 
                        button.id || 
                        `consejo-${index}`;
        
        button.dataset.consejoId = buttonId;
        
        // Restore saved state
        if (savedProgress[buttonId]) {
            button.classList.add('completed');
            updateButtonText(button, true);
        } else {
            button.classList.remove('completed');
            updateButtonText(button, false);
        }
        
        // Add click handler
        button.addEventListener('click', handleToggle);
    });
    
    // Toggle handler
    function handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const button = e.currentTarget;
        const buttonId = button.dataset.consejoId;
        const isCompleted = button.classList.contains('completed');
        
        // Toggle state
        if (isCompleted) {
            button.classList.remove('completed');
            updateButtonText(button, false);
            delete savedProgress[buttonId];
        } else {
            button.classList.add('completed');
            updateButtonText(button, true);
            savedProgress[buttonId] = {
                completed: true,
                timestamp: Date.now()
            };
        }
        
        // Save to localStorage
        localStorage.setItem('consejosProgress', JSON.stringify(savedProgress));
        
        // Visual feedback
        animateButton(button);
        
        // Update stats if available
        updateProgressStats();
        
        console.log(`✅ Consejo ${buttonId} ${isCompleted ? 'unmarked' : 'marked'} as complete`);
    }
    
    // Update button text based on state
    function updateButtonText(button, isCompleted) {
        if (isCompleted) {
            button.innerHTML = '<i class="fas fa-check-circle"></i> Completado';
            button.setAttribute('aria-label', 'Marcar como no completado');
        } else {
            button.innerHTML = '<i class="fas fa-circle"></i> Marcar como leído';
            button.setAttribute('aria-label', 'Marcar como completado');
        }
    }
    
    // Button animation
    function animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Update progress statistics
    function updateProgressStats() {
        const total = toggleButtons.length;
        const completed = Object.keys(savedProgress).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Update progress bar if exists
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.setAttribute('aria-valuenow', percentage);
        }
        
        // Update progress text if exists
        const progressText = document.getElementById('progressText');
        if (progressText) {
            progressText.textContent = `${completed} de ${total} consejos completados (${percentage}%)`;
        }
        
        // Update counter badge if exists
        const counterBadge = document.querySelector('.progress-counter');
        if (counterBadge) {
            counterBadge.textContent = `${completed}/${total}`;
        }
    }
    
    // Reset all progress (if reset button exists)
    const resetButton = document.getElementById('resetProgress');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que quieres resetear todo tu progreso?')) {
                localStorage.removeItem('consejosProgress');
                location.reload();
            }
        });
    }
    
    // Export progress (if export button exists)
    const exportButton = document.getElementById('exportProgress');
    if (exportButton) {
        exportButton.addEventListener('click', () => {
            const dataStr = JSON.stringify(savedProgress, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'consejos-progress.json';
            link.click();
            URL.revokeObjectURL(url);
        });
    }
    
    // Initial stats update
    updateProgressStats();
    
    console.log('✅ Consejos toggle system initialized');
});
