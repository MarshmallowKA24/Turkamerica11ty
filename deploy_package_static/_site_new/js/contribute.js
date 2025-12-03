// ========================================
// CONTRIBUTE.JS - Contribution Form Handler with Visual Editor
// ========================================

let lessonEditor;

document.addEventListener('DOMContentLoaded', async () => {
    // Check for edit mode and apply compact styles
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'edit') {
        document.body.classList.add('compact-mode');
        // Update page title for context
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) pageTitle.textContent = 'Editar Lección';
    }

    initContributionPage();

    // Check if editing existing lesson
    const editLessonId = urlParams.get('edit');
    const topic = urlParams.get('topic');
    const level = urlParams.get('level');

    if (editLessonId) {
        editLesson(editLessonId);
    } else if (topic && level) {
        fetchExistingLesson(topic, level);
    } else if (level) {
        // Pre-select level for new lesson
        const levelSelect = document.getElementById('lessonLevel');
        if (levelSelect) {
            levelSelect.value = level;
            // Also update title placeholder or description if needed
            showToast(`Creando lección para Nivel ${level}`, 'info');
        }

        // Hide Book Option when coming from a specific level
        const bookTypeBtn = document.getElementById('bookTypeBtn');
        if (bookTypeBtn) {
            bookTypeBtn.style.display = 'none';
        }

        // Ensure Lesson Form is active
        const lessonTypeBtn = document.getElementById('lessonTypeBtn');
        if (lessonTypeBtn) {
            lessonTypeBtn.click();
        }
    }
});

async function fetchExistingLesson(topic, level) {
    try {
        const response = await fetch(`/data/${level.toLowerCase()}_lessons.json`);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const lesson = data[topic];

        if (lesson) {
            // Scroll to form
            document.querySelector('.contribution-types').scrollIntoView({ behavior: 'smooth' });

            // Switch to lesson form
            document.getElementById('lessonTypeBtn').click();

            // Fill form with lesson data
            document.getElementById('lessonTitle').value = `Edición: ${lesson.title}`;
            document.getElementById('lessonLevel').value = level;
            document.getElementById('lessonDescription').value = `Propuesta de edición para: ${lesson.title}`;

            // Load lesson content into editor
            if (lessonEditor) {
                lessonEditor.setContent(lesson.content || '');
            }

            showToast(`Editando lección: ${lesson.title}`, 'info');
        } else {
            showToast('Lección no encontrada', 'error');
        }
    } catch (error) {
        console.error('Error fetching lesson:', error);
        showToast('Error al cargar la lección original', 'error');
    }
}

function initContributionPage() {
    // Initialize visual editor
    if (typeof LessonEditor !== 'undefined') {
        lessonEditor = new LessonEditor('lessonContentEditor');
    } else {
        console.error('LessonEditor class not found');
    }

    // Type selection
    const lessonTypeBtn = document.getElementById('lessonTypeBtn');
    const bookTypeBtn = document.getElementById('bookTypeBtn');
    const lessonForm = document.getElementById('lessonEditForm');
    const bookForm = document.getElementById('bookUploadForm');

    lessonTypeBtn?.addEventListener('click', () => {
        lessonTypeBtn.classList.add('active');
        bookTypeBtn.classList.remove('active');
        lessonForm.classList.add('active');
        bookForm.classList.remove('active');
    });

    bookTypeBtn?.addEventListener('click', () => {
        bookTypeBtn.classList.add('active');
        lessonTypeBtn.classList.remove('active');
        bookForm.classList.add('active');
        lessonForm.classList.remove('active');
    });

    // Form submissions
    lessonForm?.addEventListener('submit', handleLessonSubmit);
    bookForm?.addEventListener('submit', handleBookSubmit);

    // Load user's contributions
    loadMyContributions();
}

// ========================================
// LESSON CREATION FORM (SIMPLIFIED)
// ========================================

function handleLessonSubmit(e) {
    e.preventDefault();

    const lessonContent = lessonEditor ? lessonEditor.getContent() : '';

    if (!lessonContent || lessonContent.trim() === '') {
        showToast('Por favor añade contenido a la lección', 'error');
        return;
    }

    const form = e.target;
    const editingLessonId = form.dataset.editingLessonId;

    const lessonData = {
        lessonTitle: document.getElementById('lessonTitle').value,
        level: document.getElementById('lessonLevel').value,
        description: document.getElementById('lessonDescription').value,
        newContent: lessonContent,
        lessonId: editingLessonId || null, // If editing, include original lesson ID
        source: 'community' // Mark as community contribution
    };

    try {
        const request = window.ContributionService.submitLessonEdit(lessonData);

        const message = editingLessonId
            ? '¡Propuesta de edición enviada! Será revisada por un administrador.'
            : '¡Lección enviada con éxito! Será revisada por un administrador.';

        showToast(message, 'success');

        // Reset form
        e.target.reset();
        delete form.dataset.editingLessonId;
        if (lessonEditor) {
            lessonEditor.clear();
            lessonEditor.setContent('<h2>Título de la Sección</h2><p>Escribe aquí el contenido de tu lección...</p>');
        }

        // Clear URL parameter
        window.history.replaceState({}, '', '/Contribute/');

        // Reload contributions list
        loadMyContributions();

    } catch (error) {
        console.error('Error submitting lesson:', error);
        showToast('Error al enviar la lección. Inténtalo de nuevo.', 'error');
    }
}

// ========================================
// EDIT EXISTING LESSON
// ========================================

function editLesson(lessonId) {
    const lesson = window.ContributionService.getLessonById(lessonId);
    if (!lesson) {
        showToast('Lección no encontrada', 'error');
        return;
    }

    // Scroll to form
    document.querySelector('.contribution-types').scrollIntoView({ behavior: 'smooth' });

    // Switch to lesson form
    document.getElementById('lessonTypeBtn').click();

    // Fill form with lesson data
    document.getElementById('lessonTitle').value = `Edición: ${lesson.title}`;
    document.getElementById('lessonLevel').value = lesson.level;
    document.getElementById('lessonDescription').value = `Propuesta de edición para: ${lesson.description}`;

    // Load lesson content into editor
    if (lessonEditor) {
        lessonEditor.setContent(lesson.content || '');
    }

    // Store original lesson ID for reference
    const form = document.getElementById('lessonEditForm');
    form.dataset.editingLessonId = lessonId;

    showToast('Edita la lección y envía tu propuesta', 'info');
}

// Make globally available
window.editLesson = editLesson;

// ========================================
// BOOK UPLOAD FORM
// ========================================

function handleBookSubmit(e) {
    e.preventDefault();

    const bookData = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        level: document.getElementById('bookLevel').value,
        category: document.getElementById('bookCategory').value,
        fileUrl: document.getElementById('bookUrl').value,
        format: document.getElementById('bookFormat').value,
        fileSize: document.getElementById('bookSize').value || 'Desconocido',
        description: document.getElementById('bookDescription').value,
        language: document.getElementById('bookLanguage').value
    };

    // Validate URL
    try {
        new URL(bookData.fileUrl);
    } catch {
        showToast('Por favor ingresa una URL válida', 'error');
        return;
    }

    try {
        const request = window.ContributionService.submitBookUpload(bookData);

        showToast('¡Libro compartido con éxito! Será revisado por un administrador.', 'success');

        // Reset form
        e.target.reset();

        // Reload contributions list
        loadMyContributions();

    } catch (error) {
        console.error('Error submitting book:', error);
        showToast('Error al compartir el libro. Inténtalo de nuevo.', 'error');
    }
}

// ========================================
// MY CONTRIBUTIONS
// ========================================

function loadMyContributions() {
    const container = document.getElementById('myContributionsList');
    if (!container) return;

    try {
        const requests = window.ContributionService.getAllRequests();

        if (requests.length === 0) {
            container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No has enviado ninguna contribución todavía</p>
            </div>
        `;
            return;
        }

        container.innerHTML = requests.map(request => `
        <div class="contribution-card ${request.status}">
            <div class="contribution-header">
                <div class="contribution-type">
                    <i class="fas ${request.type === 'lesson_edit' ? 'fa-book-open' : 'fa-file-pdf'}"></i>
                    <span>${request.type === 'lesson_edit' ? 'Lección' : 'Libro'}</span>
                </div>
                <span class="contribution-status status-${request.status}">
                    ${getStatusText(request.status)}
                </span>
            </div>
            <h3>${request.title}</h3>
            <p>${request.description}</p>
            <div class="contribution-meta">
                <span><i class="fas fa-calendar"></i> ${formatDate(request.submittedAt)}</span>
                ${request.data.level ? `<span><i class="fas fa-layer-group"></i> ${request.data.level}</span>` : ''}
            </div>
        </div>
    `).join('');

    } catch (error) {
        console.error('Error loading contributions:', error);
        container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error al cargar tus contribuciones</p>
        </div>
    `;
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'approved': 'Aprobado',
        'rejected': 'Rechazado'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    if (window.ToastManager) {
        window.ToastManager.show(message, type);
    } else {
        alert(message);
    }
}

console.log('✅ Contribute.js loaded with visual editor');
