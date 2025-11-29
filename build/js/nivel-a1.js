// =====================================================
// TOPICS PANEL JAVASCRIPT - FILTERS GRAMMAR CARDS
// =====================================================

// Almacenar las explicaciones globalmente una vez cargadas
let a1ExplanationsCache = null;

// Función para obtener las explicaciones del archivo JSON (o caché)
async function getA1Explanations() {
    if (a1ExplanationsCache) {
        return a1ExplanationsCache;
    }

    try {
        const response = await fetch('/data/a1_lessons.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        a1ExplanationsCache = data;
        return data;
    } catch (error) {
        console.error("Error al cargar las lecciones de A1:", error);
        const modal = document.getElementById('explanationModal');
        if (modal) {
            document.getElementById('modalTitle').textContent = "Error de Carga";
            modal.style.display = 'none';
        }
    }
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('explanationModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('modalContent').innerHTML = '';
    }
}

// Función para abrir explicaciones
async function openExplanation(topic) {
    const modal = document.getElementById('explanationModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');

    const explanations = await getA1Explanations();

    if (explanations && explanations[topic]) {
        title.textContent = explanations[topic].title;
        content.innerHTML = explanations[topic].content;

        modal.style.display = 'flex';

        // Inject Edit Button AFTER modal is displayed
        // Wait for next frame to ensure DOM is ready
        requestAnimationFrame(() => {
            let editBtn = document.getElementById('modalEditBtn');
            if (!editBtn) {
                editBtn = document.createElement('a');
                editBtn.id = 'modalEditBtn';
                editBtn.className = 'btn btn-outline-secondary btn-sm';
                editBtn.style.marginLeft = 'auto';
                editBtn.style.marginRight = '10px';
                editBtn.style.display = 'flex';
                editBtn.style.alignItems = 'center';
                editBtn.style.gap = '5px';
                editBtn.style.textDecoration = 'none';
                editBtn.style.cursor = 'pointer';
                editBtn.innerHTML = '<i class="fas fa-edit"></i>';

                // Insert before close button
                const closeBtn = document.getElementById('closeModalBtn');
                const header = document.querySelector('.modal-header');
                if (header && closeBtn) {
                    header.insertBefore(editBtn, closeBtn);
                }
            }

            // Update to use Inline Editor
            editBtn.href = '#';
            editBtn.onclick = (e) => {
                e.preventDefault();
                openInlineEditor(topic);
            };
        });
    } else {
        title.textContent = "Error";
        content.innerHTML = "<p>Contenido no encontrado para este tema.</p>";
        modal.style.display = 'flex';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    const panel = document.getElementById('topicsPanel');
    const panelToggle = document.getElementById('panelToggle');
    const searchInput = document.getElementById('topicSearch');
    const grammarCards = document.querySelectorAll('.grammar-card');

    // Toggle panel
    if (panelToggle && panel) {
        panelToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            panel.classList.toggle('collapsed');
        });

        const panelHeader = document.querySelector('.panel-header');
        if (panelHeader) {
            panelHeader.addEventListener('click', function () {
                panel.classList.toggle('collapsed');
            });
        }
    }

    // Búsqueda que filtra las tarjetas de gramática
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase().trim();

            if (searchTerm === '') {
                // Mostrar todas las tarjetas si la búsqueda está vacía
                grammarCards.forEach(card => {
                    card.style.display = '';
                });
            } else {
                // Filtrar tarjetas basándose en el término de búsqueda
                grammarCards.forEach(card => {
                    const title = card.querySelector('h3').textContent.toLowerCase();
                    const description = card.querySelector('.card-description').textContent.toLowerCase();

                    // Buscar en título y descripción
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
        button.addEventListener('click', function () {
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
        modal.addEventListener('click', function (e) {
            if (e.target.id === 'explanationModal') {
                closeModal();
            }
        });
    }

    // Initialize Inline Editor
    if (typeof LessonEditor !== 'undefined') {
        window.inlineLessonEditor = new LessonEditor('inlineLessonContentEditor');
    }

    // Cancel Edit Button
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeInlineEditor();
        });
    }

    // Handle Inline Submit
    const inlineForm = document.getElementById('inlineLessonForm');
    if (inlineForm) {
        inlineForm.addEventListener('submit', handleInlineSubmit);
    }
});

// ==========================================
// INLINE EDITOR FUNCTIONS
// ==========================================

function openInlineEditor(topic) {
    // Get lesson data from cache
    getA1Explanations().then(explanations => {
        if (!explanations || !explanations[topic]) {
            alert('Error al cargar la lección');
            return;
        }

        const lesson = explanations[topic];

        // Populate Form
        const titleInput = document.getElementById('inlineLessonTitle');
        const idInput = document.getElementById('inlineLessonId');
        const descInput = document.getElementById('inlineLessonDescription');

        if (titleInput) titleInput.value = lesson.title;
        if (idInput) idInput.value = topic;
        if (descInput) descInput.value = ''; // Description might not exist in JSON

        if (window.inlineLessonEditor) {
            window.inlineLessonEditor.setContent(lesson.content || '');
        }

        // Show Editor, Hide Content
        const editorContainer = document.getElementById('inlineEditorContainer');
        const cardsContainer = document.querySelector('.grammar-cards-container');
        const topicsPanel = document.getElementById('topicsPanel');
        const modal = document.getElementById('explanationModal');

        if (editorContainer) editorContainer.style.display = 'block';
        if (cardsContainer) cardsContainer.style.display = 'none';
        if (topicsPanel) topicsPanel.style.display = 'none';
        if (modal) modal.style.display = 'none';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function closeInlineEditor() {
    const editorContainer = document.getElementById('inlineEditorContainer');
    const cardsContainer = document.querySelector('.grammar-cards-container');
    const topicsPanel = document.getElementById('topicsPanel');

    if (editorContainer) editorContainer.style.display = 'none';
    if (cardsContainer) cardsContainer.style.display = 'block';
    if (topicsPanel) topicsPanel.style.display = 'block';
}

async function handleInlineSubmit(e) {
    e.preventDefault();

    const content = window.inlineLessonEditor ? window.inlineLessonEditor.getContent() : '';

    if (!content || content.trim() === '') {
        alert('Por favor añade contenido a la lección');
        return;
    }

    const lessonData = {
        lessonTitle: document.getElementById('inlineLessonTitle').value,
        level: 'A1',
        description: document.getElementById('inlineLessonDescription').value,
        newContent: content,
        lessonId: document.getElementById('inlineLessonId').value
    };

    try {
        // Use ContributionService if available
        if (window.ContributionService) {
            await window.ContributionService.submitLessonEdit(lessonData);

            // Show success message (using Toast if available, else alert)
            if (window.ToastManager) {
                window.ToastManager.show('¡Propuesta de edición enviada!', 'success');
            } else {
                alert('¡Propuesta de edición enviada!');
            }

            closeInlineEditor();
        } else {
            console.error('ContributionService not found');
            alert('Error: Servicio de contribución no disponible');
        }
    } catch (error) {
        console.error('Error submitting edit:', error);
        alert('Error al enviar la edición');
    }
}