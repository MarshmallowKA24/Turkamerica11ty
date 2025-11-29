// ========================================
// ADMIN CONTRIBUTIONS - Admin Dashboard Handler
// ========================================

let currentFilter = 'all';
let currentRequestId = null;
let confirmAction = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check admin access
    if (!window.ContributionService.isAdmin()) {
        showToast('Acceso denegado. Solo administradores pueden acceder a esta página.', 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }

    initAdminDashboard();
});

function initAdminDashboard() {
    // Load stats and requests
    loadStats();
    loadRequests();

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            loadRequests();
        });
    });

    // Modal buttons
    document.getElementById('approveBtn')?.addEventListener('click', () => handleApprove(currentRequestId));
    document.getElementById('rejectBtn')?.addEventListener('click', () => handleReject(currentRequestId));
}

// ========================================
// LOAD DATA
// ========================================

function loadStats() {
    try {
        const stats = window.ContributionService.getStats();

        document.getElementById('statPending').textContent = stats.pending;
        document.getElementById('statApproved').textContent = stats.approved;
        document.getElementById('statRejected').textContent = stats.rejected;
        document.getElementById('statTotal').textContent = stats.total;

        document.getElementById('badgeAll').textContent = stats.pending;
        document.getElementById('badgeLessons').textContent = stats.lessonEdits;
        document.getElementById('badgeBooks').textContent = stats.bookUploads;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function loadRequests() {
    const container = document.getElementById('requestsList');

    try {
        let requests = window.ContributionService.getPendingRequests();

        // Apply filter
        if (currentFilter !== 'all') {
            requests = requests.filter(req => req.type === currentFilter);
        }

        if (requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-check-circle"></i>
                    <h3>¡Todo al día!</h3>
                    <p>No hay solicitudes pendientes de revisión</p>
                </div>
            `;
            return;
        }

        container.innerHTML = requests.map(request => `
            <div class="request-card" data-id="${request.id}">
                <div class="request-header">
                    <div class="request-type">
                        <i class="fas ${request.type === 'lesson_edit' ? 'fa-book-open' : 'fa-file-pdf'}"></i>
                        <span>${request.type === 'lesson_edit' ? 'Edición de Lección' : 'Libro Compartido'}</span>
                    </div>
                    <span class="request-date">${formatDate(request.submittedAt)}</span>
                </div>
                
                <h3>${request.title}</h3>
                <p class="request-description">${truncate(request.description, 150)}</p>
                
                <div class="request-meta">
                    <span><i class="fas fa-user"></i> ${request.submittedBy.username}</span>
                    ${request.data.level ? `<span><i class="fas fa-layer-group"></i> ${request.data.level}</span>` : ''}
                </div>
                
                <div class="request-actions">
                    <button class="btn-view" onclick="viewRequest('${request.id}')">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                    <button class="btn-approve-quick" onclick="handleApprove('${request.id}')">
                        <i class="fas fa-check"></i> Aprobar
                    </button>
                    <button class="btn-reject-quick" onclick="handleReject('${request.id}')">
                        <i class="fas fa-times"></i> Rechazar
                    </button>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading requests:', error);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error al cargar las solicitudes</p>
            </div>
        `;
    }
}

// ========================================
// VIEW REQUEST DETAILS
// ========================================

function viewRequest(id) {
    const request = window.ContributionService.getRequestById(id);
    if (!request) return;

    currentRequestId = id;

    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');

    modalTitle.textContent = request.title;

    if (request.type === 'lesson_edit') {
        modalBody.innerHTML = `
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Información General</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Nivel:</strong>
                        <span>${request.data.level}</span>
                    </div>
                    <div class="detail-item">
                        <strong>ID de Lección:</strong>
                        <span>${request.data.lessonId || 'Nueva lección'}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Enviado por:</strong>
                        <span>${request.submittedBy.username}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Fecha:</strong>
                        <span>${formatDate(request.submittedAt)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-align-left"></i> Descripción</h3>
                <p>${request.description}</p>
            </div>
            
            <div class="detail-section">
                <div class="section-header-actions">
                    <h3><i class="fas fa-file-alt"></i> Contenido</h3>
                    <button class="btn-edit-content" id="toggleEditBtn" onclick="toggleAdminEditor()">
                        <i class="fas fa-edit"></i> Editar Contenido
                    </button>
                </div>
                
                <!-- View Mode -->
                <div id="contentPreview" class="content-preview">
                    ${request.data.newContent || '<p>Sin contenido</p>'}
                </div>
                
                <!-- Edit Mode -->
                <div id="adminEditorContainer" style="display: none;">
                    <div id="adminEditor"></div>
                </div>
            </div>
        `;

        // Initialize editor but keep hidden
        window.adminEditorInstance = new LessonEditor('adminEditor');
        window.adminEditorInstance.setContent(request.data.newContent || '');

    } else {
        modalBody.innerHTML = `
            <div class="detail-section">
                <h3><i class="fas fa-info-circle"></i> Información del Libro</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Autor:</strong>
                        <span>${request.data.author}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Nivel:</strong>
                        <span>${request.data.level}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Categoría:</strong>
                        <span>${request.data.category}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Idioma:</strong>
                        <span>${request.data.language}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Formato:</strong>
                        <span>${request.data.format}</span>
                    </div>
                    <div class="detail-item">
                        <strong>Tamaño:</strong>
                        <span>${request.data.fileSize}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-align-left"></i> Descripción</h3>
                <p>${request.description}</p>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-link"></i> Enlace al Archivo</h3>
                <a href="${request.data.fileUrl}" target="_blank" class="file-link">
                    <i class="fas fa-external-link-alt"></i> ${request.data.fileUrl}
                </a>
            </div>
            
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Enviado por</h3>
                <p>${request.submittedBy.username} (${request.submittedBy.email || 'Sin email'})</p>
return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});
}

function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function showToast(message, type = 'info') {
    if (window.ToastManager) {
        window.ToastManager.show(message, type);
    } else {
        alert(message);
    }
}

console.log('✅ Admin Contributions loaded');
