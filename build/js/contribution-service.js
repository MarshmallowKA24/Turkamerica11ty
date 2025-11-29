// ========================================
// CONTRIBUTION SERVICE - Data Handler
// ========================================

class ContributionService {
    constructor() {
        this.STORAGE_KEYS = {
            LESSONS: 'turkamerica_lessons',
            REQUESTS: 'turkamerica_requests'
        };

        this.initData();
    }

    initData() {
        // Initialize with some mock data if empty
        if (!localStorage.getItem(this.STORAGE_KEYS.LESSONS)) {
            const mockLessons = [
                {
                    id: 'lesson-1',
                    title: 'Saludos y Despedidas',
                    level: 'A1',
                    author: 'Admin',
                    description: 'Aprende los saludos básicos en turco.',
                    content: '<h2>Merhaba!</h2><p>En esta lección aprenderemos a saludar...</p>',
                    publishedAt: new Date().toISOString(),
                    status: 'published'
                },
                {
                    id: 'lesson-2',
                    title: 'El Alfabeto Turco',
                    level: 'A1',
                    author: 'Admin',
                    description: 'Pronunciación y letras especiales.',
                    content: '<h2>Alfabeto</h2><p>El alfabeto turco tiene 29 letras...</p>',
                    publishedAt: new Date(Date.now() - 86400000).toISOString(),
                    status: 'published'
                }
            ];
            localStorage.setItem(this.STORAGE_KEYS.LESSONS, JSON.stringify(mockLessons));
        }

        if (!localStorage.getItem(this.STORAGE_KEYS.REQUESTS)) {
            localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify([]));
        }
    }

    // ========================================
    // PUBLIC METHODS
    // ========================================

    getPublishedLessons() {
        const lessons = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.LESSONS) || '[]');
        return lessons.filter(l => l.status === 'published');
    }

    getLessonById(id) {
        const lessons = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.LESSONS) || '[]');
        return lessons.find(l => l.id === id);
    }

    getAllRequests() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.REQUESTS) || '[]');
    }

    isAdmin() {
        // Mock admin check - in real app this would check user role
        const user = JSON.parse(localStorage.getItem('currentUser'));
        return user && (user.role === 'admin' || user.username === 'admin' || user.email.includes('admin'));
    }

    // ========================================
    // SUBMISSION METHODS
    // ========================================

    submitLessonEdit(data) {
        const requests = this.getAllRequests();
        const newRequest = {
            id: 'req-' + Date.now(),
            type: 'lesson_edit',
            title: data.lessonTitle,
            description: data.description,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            data: data
        };

        requests.push(newRequest);
        localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
        return { success: true, request: newRequest };
    }

    submitBookUpload(data) {
        const requests = this.getAllRequests();
        const newRequest = {
            id: 'req-' + Date.now(),
            type: 'book_upload',
            title: data.title,
            description: data.description,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            data: data
        };

        requests.push(newRequest);
        localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
        return { success: true, request: newRequest };
    }

    // ========================================
    // ADMIN METHODS
    // ========================================

    approveRequest(requestId) {
        const requests = this.getAllRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);

        if (requestIndex === -1) return { success: false, message: 'Request not found' };

        const request = requests[requestIndex];
        request.status = 'approved';
        request.processedAt = new Date().toISOString();

        // If it's a lesson, publish it
        if (request.type === 'lesson_edit') {
            const lessons = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.LESSONS) || '[]');
            const newLesson = {
                id: request.data.lessonId || 'lesson-' + Date.now(),
                title: request.data.lessonTitle,
                level: request.data.level,
                author: 'Community', // Should come from user session
                description: request.data.description,
                content: request.data.newContent,
                publishedAt: new Date().toISOString(),
                status: 'published'
            };

            // If editing, replace; if new, add
            if (request.data.lessonId) {
                const idx = lessons.findIndex(l => l.id === request.data.lessonId);
                if (idx !== -1) lessons[idx] = newLesson;
                else lessons.push(newLesson);
            } else {
                lessons.push(newLesson);
            }

            localStorage.setItem(this.STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
        }

        requests[requestIndex] = request;
        localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

        return { success: true };
    }

    rejectRequest(requestId) {
        const requests = this.getAllRequests();
        const requestIndex = requests.findIndex(r => r.id === requestId);

        if (requestIndex === -1) return { success: false, message: 'Request not found' };

        requests[requestIndex].status = 'rejected';
        requests[requestIndex].processedAt = new Date().toISOString();

        localStorage.setItem(this.STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
        return { success: true };
    }
}

// Initialize and expose globally
window.ContributionService = new ContributionService();
console.log('✅ Contribution Service initialized');
