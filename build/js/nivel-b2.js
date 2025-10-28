 // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
document.addEventListener('DOMContentLoaded', function() {
    const panel = document.getElementById('topicsPanel');
    const panelToggle = document.getElementById('panelToggle');
    const searchInput = document.getElementById('topicSearch');
    const topicsList = document.querySelector('.topics-list');
    
    // Toggle panel
    if (panelToggle) {
        panelToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.classList.toggle('collapsed');
        });
        
        // También toggle al hacer click en el header
        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.addEventListener('click', function() {
                panel.classList.toggle('collapsed');
            });
        }
    }
    
    // Búsqueda de temas
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            const topicItems = document.querySelectorAll('.topic-item');
            
            topicItems.forEach(item => {
                const topicText = item.textContent.toLowerCase();
                if (topicText.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }
    
    // Click en topic item abre la explicación
    const topicItems = document.querySelectorAll('.topic-item');
    topicItems.forEach(item => {
        item.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            if (topic && typeof openExplanation === 'function') {
                openExplanation(topic);
            }
        });
    });
});