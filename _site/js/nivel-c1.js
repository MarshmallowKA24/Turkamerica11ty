// =====================================================
// NIVEL C1 - SEARCH AND MODAL FUNCTIONALITY
// =====================================================

// Cache global para las explicaciones
let c1ExplanationsCache = null;

// Función para obtener las explicaciones del archivo JSON
async function getC1Explanations() {
    if (c1ExplanationsCache) {
        return c1ExplanationsCache;
    }

    try {
        const response = await fetch('/data/c1_lessons.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        c1ExplanationsCache = data;
        return data;
    } catch (error) {
        console.error("Error al cargar las lecciones de C1:", error);
        document.getElementById('modalTitle').textContent = "Error de Carga";
        document.getElementById('modalContent').innerHTML = "<p>No se pudo cargar el contenido de las lecciones. Asegúrate de que Eleventy se ejecutó correctamente y el archivo <code>c1_lessons.json</code> existe en la carpeta <code>_site/data/</code>.</p>";
        document.getElementById('explanationModal').style.display = 'flex';
        return {};
    }
}

// Función para abrir explicaciones
async function openExplanation(topic) {
    const modal = document.getElementById('explanationModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    const explanations = await getC1Explanations();

    if (explanations[topic]) {
        title.textContent = explanations[topic].title;
        content.innerHTML = explanations[topic].content;
        modal.style.display = 'flex';
    } else {
         title.textContent = "Error";
         content.innerHTML = "<p>Contenido no encontrado para este tema.</p>";
         modal.style.display = 'flex';
    }
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('explanationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const panel = document.getElementById('topicsPanel');
    const panelToggle = document.getElementById('panelToggle');
    const searchInput = document.getElementById('topicSearch');
    const grammarCards = document.querySelectorAll('.grammar-card');

    // Toggle panel
    if (panelToggle) {
        panelToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            panel.classList.toggle('collapsed');
        });

        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.addEventListener('click', function() {
                panel.classList.toggle('collapsed');
            });
        }
    }

    // Búsqueda que filtra las tarjetas de gramática
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            if (searchTerm === '') {
                grammarCards.forEach(card => {
                    card.style.display = '';
                });
            } else {
                grammarCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('.card-description').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }

    // Agregar event listeners a los botones de explicación
    const explanationButtons = document.querySelectorAll('.explanation-btn');
    explanationButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topic = this.getAttribute('data-topic');
            if (topic) {
                openExplanation(topic);
            }
        });
    });

    // Agregar event listener al botón de cerrar modal
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Click fuera del modal para cerrar
    const modal = document.getElementById('explanationModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target.id === 'explanationModal') {
                closeModal();
            }
        });
    }
});