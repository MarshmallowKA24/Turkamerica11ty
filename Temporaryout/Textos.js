// Replace global arrays with user-specific data
function loadUserTexts() {
    if (window.auth && window.auth.isLoggedIn()) {
        return window.userDataManager.getTexts();
    }
    return [];
}

function saveUserText(text) {
    if (window.auth && window.auth.isLoggedIn()) {
        window.userDataManager.saveText(text);
    }
}
// Global variables
let books = [];
let nextBookId = 3;
let userTranslations = {}; // Store user translations by book ID
let currentTextSegments = []; // Current text segments being translated
let currentSegmentIndex = 0;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserTranslations();
});

function initializeApp() {
    // Settings panel functionality
    initializeSettings();
    
    // File upload functionality
    initializeFileUpload();
    
    // Form functionality
    initializeForm();
    
    // Modal functionality
    initializeModals();
    
    // Filter functionality
    initializeFilters();
    
    // Dark mode toggle
    initializeDarkMode();
    
    // Translation functionality
    initializeTranslationSystem();
    
    // Attach listeners to existing book cards
    attachExistingBookListeners();
    
    console.log('Turkish Book Learning App initialized successfully');
}

function initializeSettings() {
    const settingsTab = document.getElementById('settingsTab');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const closeSettings = document.getElementById('closeSettings');

    if (settingsTab) {
        settingsTab.addEventListener('click', function() {
            settingsOverlay.style.display = 'flex';
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
            settingsOverlay.style.display = 'none';
        });
    }

    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', function(e) {
            if (e.target === settingsOverlay) {
                settingsOverlay.style.display = 'none';
            }
        });
    }
}

function initializeFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const bookFile = document.getElementById('bookFile');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const removeFile = document.getElementById('removeFile');
    let selectedFile = null;

    if (fileUploadArea && bookFile) {
        fileUploadArea.addEventListener('click', function() {
            bookFile.click();
        });

        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUploadArea.classList.add('drag-over');
        });

        fileUploadArea.addEventListener('dragleave', function() {
            fileUploadArea.classList.remove('drag-over');
        });

        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });

        bookFile.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                handleFileSelection(e.target.files[0]);
            }
        });
    }

    if (removeFile) {
        removeFile.addEventListener('click', function() {
            selectedFile = null;
            bookFile.value = '';
            fileUploadArea.style.display = 'flex';
            fileInfo.style.display = 'none';
        });
    }

    function handleFileSelection(file) {
        selectedFile = file;
        if (fileName) fileName.textContent = file.name;
        if (fileUploadArea) fileUploadArea.style.display = 'none';
        if (fileInfo) fileInfo.style.display = 'flex';
        
        // Store selected file globally
        window.selectedFile = selectedFile;
    }
}

function initializeForm() {
    const addBookForm = document.getElementById('addBookForm');
    const clearForm = document.getElementById('clearForm');

    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(addBookForm);
            const newBook = {
                id: nextBookId++,
                title: formData.get('bookTitle'),
                author: formData.get('bookAuthor'),
                genre: formData.get('bookGenre'),
                level: formData.get('bookLevel'),
                description: formData.get('bookDescription') || 'Sin descripción disponible',
                file: window.selectedFile
            };

            if (newBook.title && newBook.author && newBook.genre && newBook.level) {
                addBookToGrid(newBook);
                books.push(newBook);
                
                // Initialize translation storage for this book
                userTranslations[newBook.id] = {
                    segments: [],
                    progress: 0,
                    lastAccessed: new Date().toISOString()
                };
                
                showNotification('¡Libro agregado exitosamente!');
                clearFormData();
                saveUserTranslations();
            } else {
                showNotification('Por favor, completa todos los campos obligatorios', 'error');
            }
        });
    }

    if (clearForm) {
        clearForm.addEventListener('click', function() {
            clearFormData();
        });
    }
}

function clearFormData() {
    const addBookForm = document.getElementById('addBookForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const bookFile = document.getElementById('bookFile');
    
    if (addBookForm) addBookForm.reset();
    window.selectedFile = null;
    if (bookFile) bookFile.value = '';
    if (fileUploadArea) fileUploadArea.style.display = 'flex';
    if (fileInfo) fileInfo.style.display = 'none';
}

function addBookToGrid(book) {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;

    const genreNames = {
        'roman': 'Novela',
        'hikaye': 'Cuento',
        'şiir': 'Poesía',
        'deneme': 'Ensayo',
        'tarih': 'Historia',
        'bilim': 'Ciencia',
        'çocuk': 'Infantil',
        'gençlik': 'Juvenil',
        'diğer': 'Otros'
    };

    const bookCard = document.createElement('div');
    bookCard.className = 'content-card';
    bookCard.setAttribute('data-level', book.level);
    bookCard.setAttribute('data-genre', book.genre);
    bookCard.setAttribute('data-book-id', book.id);
    
    bookCard.innerHTML = `
        <div class="content-header">
            <div class="content-icon">
                <i class="fas fa-book"></i>
            </div>
            <div class="content-level">${book.level}</div>
        </div>
        <div class="content-body">
            <h3>${book.title}</h3>
            <p class="content-artist">${book.author}</p>
            <p class="content-genre">${genreNames[book.genre] || book.genre}</p>
            <p class="content-preview">${book.description}</p>
        </div>
        <div class="content-actions">
            <button class="btn btn-outline read-btn">
                <i class="fas fa-book-open"></i>
                Leer
            </button>
            <button class="btn btn-outline translate-btn">
                <i class="fas fa-language"></i>
                Traducir
            </button>
            <button class="btn btn-outline analyze-btn">
                <i class="fas fa-chart-line"></i>
                Analizar
            </button>
            <button class="btn btn-outline delete-btn">
                <i class="fas fa-trash"></i>
                Eliminar
            </button>
        </div>
    `;
    
    booksGrid.appendChild(bookCard);
    attachButtonListeners(bookCard);
}

function attachButtonListeners(bookCard) {
    const readBtn = bookCard.querySelector('.read-btn');
    const translateBtn = bookCard.querySelector('.translate-btn');
    const analyzeBtn = bookCard.querySelector('.analyze-btn');
    const deleteBtn = bookCard.querySelector('.delete-btn');
    
    const bookId = bookCard.getAttribute('data-book-id');
    const bookTitle = bookCard.querySelector('h3').textContent;
    
    if (readBtn) {
        readBtn.addEventListener('click', function() {
            openReader(bookId, bookTitle);
        });
    }
    
    if (translateBtn) {
        translateBtn.addEventListener('click', function() {
            openTranslator(bookId, bookTitle);
        });
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', function() {
            openAnalyzer(bookId, bookTitle);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            deleteBook(bookId, bookCard);
        });
    }
}

function attachExistingBookListeners() {
    const existingCards = document.querySelectorAll('.content-card');
    existingCards.forEach(function(card) {
        attachButtonListeners(card);
        
        // Initialize translation storage for existing books
        const bookId = card.getAttribute('data-book-id');
        if (bookId && !userTranslations[bookId]) {
            userTranslations[bookId] = {
                segments: [],
                progress: 0,
                lastAccessed: new Date().toISOString()
            };
        }
    });
}

function openReader(bookId, bookTitle) {
    const modal = document.getElementById('readerModal');
    const title = document.getElementById('readerTitle');
    const content = document.getElementById('readerContent');
    
    if (title) title.textContent = `Leer: ${bookTitle}`;
    
    if (content) {
        content.innerHTML = `
            <div class="loading">Cargando contenido del libro...</div>
            <br>
            <p><strong>Ejemplo de contenido:</strong></p>
            <p><em>Güneş doğudan yükseldi. Bahçede kuşlar şarkı söylüyor. Çiçekler güzel kokular yayıyor. Bu güzel bir sabah.</em></p>
            <p><em>İstanbul'un eski sokaklarında yürüyordu. Her adımda yeni bir hikaye keşfediyordu. Şehrin ruhu ona fısıldıyordu.</em></p>
            <p><em>Deniz mavisi gözlerle baktı. Kalbi hızla çarpıyordu. Aşkın gücü onu büyülüyordu.</em></p>
        `;
    }
    
    if (modal) modal.style.display = 'flex';
}

function openTranslator(bookId, bookTitle) {
    const modal = document.getElementById('translatorModal');
    const title = document.getElementById('translatorTitle');
    
    if (title) title.textContent = `Traducir: ${bookTitle}`;
    
    // Load text segments for this book
    loadTextSegments(bookId);
    
    // Initialize translation interface
    setupTranslationInterface(bookId);
    
    if (modal) modal.style.display = 'flex';
}

function loadTextSegments(bookId) {
    // Sample text segments - in real implementation, this would load from the actual book file
    const sampleSegments = [
        "Güneş doğudan yükseldi.",
        "Bahçede kuşlar şarkı söylüyor.",
        "Çiçekler güzel kokular yayıyor.",
        "Bu güzel bir sabah.",
        "İstanbul'un eski sokaklarında yürüyordu.",
        "Her adımda yeni bir hikaye keşfediyordu.",
        "Şehrin ruhu ona fısıldıyordu.",
        "Deniz mavisi gözlerle baktı.",
        "Kalbi hızla çarpıyordu.",
        "Aşkın gücü onu büyülüyordu."
    ];
    
    currentTextSegments = sampleSegments;
    currentSegmentIndex = 0;
    
    // Load user's previous translations if they exist
    if (userTranslations[bookId] && userTranslations[bookId].segments.length > 0) {
        currentSegmentIndex = userTranslations[bookId].progress;
    }
}

function setupTranslationInterface(bookId) {
    const originalText = document.getElementById('originalText');
    const translatedText = document.getElementById('translatedText');
    
    if (originalText && translatedText) {
        // Update the translation interface
        updateTranslationInterface(bookId);
    }
}

function updateTranslationInterface(bookId) {
    const originalText = document.getElementById('originalText');
    const translatedText = document.getElementById('translatedText');
    
    if (currentSegmentIndex < currentTextSegments.length) {
        const currentSegment = currentTextSegments[currentSegmentIndex];
        const userTranslation = getUserTranslation(bookId, currentSegmentIndex);
        
        originalText.innerHTML = `
            <div class="segment-header">
                <span class="segment-counter">Segmento ${currentSegmentIndex + 1} de ${currentTextSegments.length}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((currentSegmentIndex / currentTextSegments.length) * 100)}%"></div>
                </div>
            </div>
            <div class="turkish-text">${currentSegment}</div>
        `;
        
        translatedText.innerHTML = `
            <div class="translation-input-container">
                <textarea id="userTranslationInput" placeholder="Escribe tu traducción aquí..." rows="3">${userTranslation || ''}</textarea>
                <div class="translation-actions">
                    <button class="btn btn-primary" id="saveTranslation">
                        <i class="fas fa-save"></i>
                        Guardar
                    </button>
                    <button class="btn btn-outline" id="getHint">
                        <i class="fas fa-lightbulb"></i>
                        Pista
                    </button>
                    <button class="btn btn-outline" id="showCorrection">
                        <i class="fas fa-check"></i>
                        Ver Corrección
                    </button>
                </div>
            </div>
            <div id="feedback-area" class="feedback-area" style="display: none;"></div>
        `;
        
        // Add navigation buttons
        const translationControls = document.querySelector('.translation-controls');
        if (translationControls) {
            translationControls.innerHTML = `
                <button class="btn btn-secondary" id="prevSegment" ${currentSegmentIndex === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i>
                    Anterior
                </button>
                <button class="btn btn-secondary" id="nextSegment" ${currentSegmentIndex === currentTextSegments.length - 1 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-right"></i>
                    Siguiente
                </button>
                <button class="btn btn-outline" id="viewProgress">
                    <i class="fas fa-chart-line"></i>
                    Ver Progreso
                </button>
            `;
        }
        
        // Attach event listeners
        attachTranslationListeners(bookId);
    }
}

function attachTranslationListeners(bookId) {
    const saveBtn = document.getElementById('saveTranslation');
    const hintBtn = document.getElementById('getHint');
    const correctionBtn = document.getElementById('showCorrection');
    const prevBtn = document.getElementById('prevSegment');
    const nextBtn = document.getElementById('nextSegment');
    const progressBtn = document.getElementById('viewProgress');
    const translationInput = document.getElementById('userTranslationInput');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            saveUserTranslation(bookId);
        });
    }
    
    if (hintBtn) {
        hintBtn.addEventListener('click', function() {
            showTranslationHint(bookId);
        });
    }
    
    if (correctionBtn) {
        correctionBtn.addEventListener('click', function() {
            showTranslationCorrection(bookId);
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentSegmentIndex > 0) {
                currentSegmentIndex--;
                updateTranslationInterface(bookId);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentSegmentIndex < currentTextSegments.length - 1) {
                currentSegmentIndex++;
                updateTranslationInterface(bookId);
            }
        });
    }
    
    if (progressBtn) {
        progressBtn.addEventListener('click', function() {
            showTranslationProgress(bookId);
        });
    }
    
    if (translationInput) {
        translationInput.addEventListener('input', function() {
            // Auto-save draft
            if (this.value.trim()) {
                localStorage.setItem(`draft_${bookId}_${currentSegmentIndex}`, this.value);
            }
        });
    }
}

function saveUserTranslation(bookId) {
    const translationInput = document.getElementById('userTranslationInput');
    if (!translationInput) return;
    
    const translation = translationInput.value.trim();
    if (!translation) {
        showNotification('Por favor escribe una traducción', 'error');
        return;
    }
    
    // Save translation
    if (!userTranslations[bookId]) {
        userTranslations[bookId] = { segments: [], progress: 0 };
    }
    
    userTranslations[bookId].segments[currentSegmentIndex] = {
        turkish: currentTextSegments[currentSegmentIndex],
        userTranslation: translation,
        timestamp: new Date().toISOString(),
        feedback: null
    };
    
    // Update progress
    userTranslations[bookId].progress = Math.max(userTranslations[bookId].progress, currentSegmentIndex);
    userTranslations[bookId].lastAccessed = new Date().toISOString();
    
    // Clear draft
    localStorage.removeItem(`draft_${bookId}_${currentSegmentIndex}`);
    
    // Save to storage
    saveUserTranslations();
    
    showNotification('Traducción guardada exitosamente!');
    
    // Provide immediate feedback
    provideFeedback(bookId, translation);
}

function provideFeedback(bookId, userTranslation) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    // Simple feedback system - in real implementation, this would use AI or predefined corrections
    const currentSegment = currentTextSegments[currentSegmentIndex];
    const possibleTranslations = getCorrectTranslations(currentSegment);
    
    let feedback = '';
    let feedbackType = 'neutral';
    
    // Check if translation is close to correct ones
    const userLower = userTranslation.toLowerCase();
    const isCorrect = possibleTranslations.some(correct => 
        userLower.includes(correct.toLowerCase()) || 
        correct.toLowerCase().includes(userLower)
    );
    
    if (isCorrect) {
        feedback = `<div class="feedback-correct">
            <i class="fas fa-check-circle"></i>
            <strong>¡Muy bien!</strong> Tu traducción es correcta.
        </div>`;
        feedbackType = 'correct';
    } else {
        feedback = `<div class="feedback-suggestion">
            <i class="fas fa-info-circle"></i>
            <strong>Sugerencia:</strong> Revisa las palabras clave. Puedes usar el botón "Pista" para obtener ayuda.
        </div>`;
        feedbackType = 'suggestion';
    }
    
    feedbackArea.innerHTML = feedback;
    feedbackArea.style.display = 'block';
    
    // Store feedback
    if (userTranslations[bookId] && userTranslations[bookId].segments[currentSegmentIndex]) {
        userTranslations[bookId].segments[currentSegmentIndex].feedback = {
            type: feedbackType,
            message: feedback,
            timestamp: new Date().toISOString()
        };
    }
    
    saveUserTranslations();
}

function showTranslationHint(bookId) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    const currentSegment = currentTextSegments[currentSegmentIndex];
    const hints = getTranslationHints(currentSegment);
    
    feedbackArea.innerHTML = `
        <div class="feedback-hint">
            <i class="fas fa-lightbulb"></i>
            <strong>Pista:</strong> ${hints}
        </div>
    `;
    feedbackArea.style.display = 'block';
}

function showTranslationCorrection(bookId) {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    const currentSegment = currentTextSegments[currentSegmentIndex];
    const correctTranslations = getCorrectTranslations(currentSegment);
    
    feedbackArea.innerHTML = `
        <div class="feedback-correction">
            <i class="fas fa-check-circle"></i>
            <strong>Traducción correcta:</strong><br>
            ${correctTranslations.map(t => `<span class="correct-translation">${t}</span>`).join('<br>')}
        </div>
    `;
    feedbackArea.style.display = 'block';
}

function showTranslationProgress(bookId) {
    const userProgress = userTranslations[bookId];
    if (!userProgress) return;
    
    const totalSegments = currentTextSegments.length;
    const completedSegments = userProgress.segments.filter(s => s && s.userTranslation).length;
    const progressPercentage = (completedSegments / totalSegments) * 100;
    
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    feedbackArea.innerHTML = `
        <div class="progress-summary">
            <h4><i class="fas fa-chart-line"></i> Progreso de Traducción</h4>
            <div class="progress-stats">
                <div class="stat">
                    <span class="stat-number">${completedSegments}</span>
                    <span class="stat-label">Segmentos completados</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${totalSegments}</span>
                    <span class="stat-label">Total de segmentos</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${Math.round(progressPercentage)}%</span>
                    <span class="stat-label">Progreso</span>
                </div>
            </div>
            <div class="progress-bar-large">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
        </div>
    `;
    feedbackArea.style.display = 'block';
}

function getCorrectTranslations(turkishText) {
    // Predefined correct translations - in real implementation, this would be more comprehensive
    const translations = {
        "Güneş doğudan yükseldi.": ["El sol salió por el este.", "El sol se levantó por el este."],
        "Bahçede kuşlar şarkı söylüyor.": ["Los pájaros cantan en el jardín.", "En el jardín los pájaros están cantando."],
        "Çiçekler güzel kokular yayıyor.": ["Las flores esparcen aromas hermosos.", "Las flores desprenden olores bonitos."],
        "Bu güzel bir sabah.": ["Esta es una mañana hermosa.", "Es una mañana bonita."],
        "İstanbul'un eski sokaklarında yürüyordu.": ["Caminaba por las calles antiguas de Estambul.", "Andaba por las viejas calles de Estambul."],
        "Her adımda yeni bir hikaye keşfediyordu.": ["En cada paso descubría una nueva historia.", "Con cada paso encontraba una nueva historia."],
        "Şehrin ruhu ona fısıldıyordu.": ["El alma de la ciudad le susurraba.", "El espíritu de la ciudad le hablaba en susurros."],
        "Deniz mavisi gözlerle baktı.": ["Miró con ojos azul mar.", "Observó con ojos del color del mar."],
        "Kalbi hızla çarpıyordu.": ["Su corazón latía rápidamente.", "El corazón le latía deprisa."],
        "Aşkın gücü onu büyülüyordu.": ["El poder del amor lo fascinaba.", "La fuerza del amor lo encantaba."]
    };
    
    return translations[turkishText] || ["Traducción no disponible"];
}

function getTranslationHints(turkishText) {
    // Predefined hints - in real implementation, this would be more comprehensive
    const hints = {
        "Güneş doğudan yükseldi.": "Güneş = sol, doğu = este, yüksel = subir/salir",
        "Bahçede kuşlar şarkı söylüyor.": "Bahçe = jardín, kuş = pájaro, şarkı = canción",
        "Çiçekler güzel kokular yayıyor.": "Çiçek = flor, güzel = hermoso, koku = aroma",
        "Bu güzel bir sabah.": "Bu = este/esta, güzel = hermoso, sabah = mañana",
        "İstanbul'un eski sokaklarında yürüyordu.": "Eski = viejo/antiguo, sokak = calle, yürü = caminar",
        "Her adımda yeni bir hikaye keşfediyordu.": "Her = cada, adım = paso, yeni = nuevo, hikaye = historia",
        "Şehrin ruhu ona fısıldıyordu.": "Şehir = ciudad, ruh = alma/espíritu, fısılda = susurrar",
        "Deniz mavisi gözlerle baktı.": "Deniz = mar, mavi = azul, göz = ojo, bak = mirar",
        "Kalbi hızla çarpıyordu.": "Kalp = corazón, hızla = rápidamente, çarp = latir",
        "Aşkın gücü onu büyülüyordu.": "Aşk = amor, güç = poder/fuerza, büyüle = fascinar"
    };
    
    return hints[turkishText] || "Intenta identificar las palabras clave y su contexto";
}

function getUserTranslation(bookId, segmentIndex) {
    if (userTranslations[bookId] && userTranslations[bookId].segments[segmentIndex]) {
        return userTranslations[bookId].segments[segmentIndex].userTranslation;
    }
    
    // Check for draft
    const draft = localStorage.getItem(`draft_${bookId}_${segmentIndex}`);
    return draft || '';
}

function saveUserTranslations() {
    try {
        localStorage.setItem('userTranslations', JSON.stringify(userTranslations));
    } catch (error) {
        console.error('Error saving translations:', error);
    }
}

function loadUserTranslations() {
    try {
        const saved = localStorage.getItem('userTranslations');
        if (saved) {
            userTranslations = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading translations:', error);
        userTranslations = {};
    }
}

function initializeTranslationSystem() {
    // Initialize translation system
    console.log('Translation system initialized');
}

function openAnalyzer(bookId, bookTitle) {
    const modal = document.getElementById('analyzerModal');
    const title = document.getElementById('analyzerTitle');
    
    if (title) title.textContent = `Análisis: ${bookTitle}`;
    if (modal) modal.style.display = 'flex';
}

function deleteBook(bookId, bookCard) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro? También se eliminarán todas tus traducciones.')) {
        bookCard.remove();
        books = books.filter(function(book) {
            return book.id != bookId;
        });
        
        // Remove user translations for this book
        delete userTranslations[bookId];
        saveUserTranslations();
        
        showNotification('Libro eliminado exitosamente');
    }
}

function initializeModals() {
    setupModalClose('readerModal', ['closeReader', 'closeReader2']);
    setupModalClose('translatorModal', ['closeTranslator', 'closeTranslator2']);
    setupModalClose('analyzerModal', ['closeAnalyzer', 'closeAnalyzer2']);
    
    // Export analysis functionality
    const exportAnalysis = document.getElementById('exportAnalysis');
    
    if (exportAnalysis) {
        exportAnalysis.addEventListener('click', function() {
            const analysisData = {
                bookTitle: document.getElementById('analyzerTitle').textContent,
                uniqueWords: 1247,
                totalWords: 5693,
                level: 'B2-C1',
                frequentWords: [
                    { word: 've', frequency: 127 },
                    { word: 'bir', frequency: 89 },
                    { word: 'bu', frequency: 76 },
                    { word: 'ile', frequency: 64 }
                ],
                studyWords: ['güzellik', 'karmaşık', 'özgürlük', 'düşünce', 'sevgi']
            };
            
            const dataStr = JSON.stringify(analysisData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'analisis_libro.json';
            link.click();
            URL.revokeObjectURL(url);
        });
    }
}
// Continue from the previous code...

function setupModalClose(modalId, closeBtnIds) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    closeBtnIds.forEach(function(btnId) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
                // Save any pending drafts when closing translator
                if (modalId === 'translatorModal') {
                    saveDraftOnClose();
                }
            });
        }
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            if (modalId === 'translatorModal') {
                saveDraftOnClose();
            }
        }
    });
}

function saveDraftOnClose() {
    const translationInput = document.getElementById('userTranslationInput');
    if (translationInput && translationInput.value.trim()) {
        const bookId = getCurrentBookId();
        if (bookId) {
            localStorage.setItem(`draft_${bookId}_${currentSegmentIndex}`, translationInput.value);
        }
    }
}

function getCurrentBookId() {
    // Get current book ID from the modal title or stored variable
    const titleElement = document.getElementById('translatorTitle');
    if (titleElement) {
        const titleText = titleElement.textContent;
        // Extract book ID from stored books array
        const book = books.find(b => titleText.includes(b.title));
        return book ? book.id : null;
    }
    return null;
}

function initializeFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const levelFilter = document.getElementById('levelFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (genreFilter) {
        genreFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
}

function applyFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const levelFilter = document.getElementById('levelFilter');
    const searchInput = document.getElementById('searchInput');
    
    const selectedGenre = genreFilter ? genreFilter.value : '';
    const selectedLevel = levelFilter ? levelFilter.value : '';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const bookCards = document.querySelectorAll('.content-card');
    let visibleCount = 0;
    
    bookCards.forEach(function(card) {
        const cardGenre = card.getAttribute('data-genre');
        const cardLevel = card.getAttribute('data-level');
        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardAuthor = card.querySelector('.content-artist').textContent.toLowerCase();
        
        const matchesGenre = !selectedGenre || cardGenre === selectedGenre;
        const matchesLevel = !selectedLevel || cardLevel === selectedLevel;
        const matchesSearch = !searchTerm || 
            cardTitle.includes(searchTerm) || 
            cardAuthor.includes(searchTerm);
        
        if (matchesGenre && matchesLevel && matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} libro${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }
}

function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
            }
        });
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced Translation System Functions

function createCustomTextSegment() {
    const modal = document.getElementById('translatorModal');
    const customTextArea = document.createElement('div');
    customTextArea.className = 'custom-text-area';
    customTextArea.innerHTML = `
        <div class="custom-text-header">
            <h4><i class="fas fa-edit"></i> Agregar Texto Personalizado</h4>
            <button class="btn btn-sm btn-outline" id="toggleCustomText">
                <i class="fas fa-plus"></i> Nuevo Texto
            </button>
        </div>
        <div class="custom-text-input" id="customTextInput" style="display: none;">
            <textarea placeholder="Pega aquí el texto en turco que quieres traducir..." rows="4" id="customTurkishText"></textarea>
            <div class="custom-text-actions">
                <button class="btn btn-primary" id="addCustomText">
                    <i class="fas fa-plus"></i> Agregar
                </button>
                <button class="btn btn-secondary" id="cancelCustomText">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            </div>
        </div>
    `;
    
    const originalTextDiv = document.getElementById('originalText');
    if (originalTextDiv) {
        originalTextDiv.parentNode.insertBefore(customTextArea, originalTextDiv);
        
        // Add event listeners
        setupCustomTextListeners();
    }
}

function setupCustomTextListeners() {
    const toggleBtn = document.getElementById('toggleCustomText');
    const customInput = document.getElementById('customTextInput');
    const addBtn = document.getElementById('addCustomText');
    const cancelBtn = document.getElementById('cancelCustomText');
    const textArea = document.getElementById('customTurkishText');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            if (customInput.style.display === 'none') {
                customInput.style.display = 'block';
                this.innerHTML = '<i class="fas fa-minus"></i> Ocultar';
            } else {
                customInput.style.display = 'none';
                this.innerHTML = '<i class="fas fa-plus"></i> Nuevo Texto';
                textArea.value = '';
            }
        });
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            const customText = textArea.value.trim();
            if (customText) {
                addCustomTextToSegments(customText);
                customInput.style.display = 'none';
                toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Texto';
                textArea.value = '';
                showNotification('Texto personalizado agregado');
            }
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            customInput.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-plus"></i> Nuevo Texto';
            textArea.value = '';
        });
    }
}

function addCustomTextToSegments(customText) {
    // Split text into sentences
    const sentences = customText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    sentences.forEach(sentence => {
        currentTextSegments.push(sentence.trim() + '.');
    });
    
    // If we're at the end of original segments, move to first custom segment
    if (currentSegmentIndex >= currentTextSegments.length - sentences.length) {
        currentSegmentIndex = currentTextSegments.length - sentences.length;
        updateTranslationInterface(getCurrentBookId());
    }
}

function setupAdvancedTranslationFeatures(bookId) {
    // Add word-by-word translation helper
    addWordByWordHelper();
    
    // Add grammar tips
    addGrammarTips();
    
    // Add difficulty rating
    addDifficultyRating();
    
    // Add translation history
    addTranslationHistory(bookId);
}

function addWordByWordHelper() {
    const originalText = document.getElementById('originalText');
    if (!originalText) return;
    
    const turkishTextDiv = originalText.querySelector('.turkish-text');
    if (!turkishTextDiv) return;
    
    const text = turkishTextDiv.textContent;
    const words = text.split(/\s+/);
    
    // Make words clickable for individual translation
    const clickableText = words.map(word => {
        const cleanWord = word.replace(/[.,!?;:]/g, '');
        return `<span class="clickable-word" data-word="${cleanWord}">${word}</span>`;
    }).join(' ');
    
    turkishTextDiv.innerHTML = clickableText;
    
    // Add click listeners for word translation
    turkishTextDiv.querySelectorAll('.clickable-word').forEach(wordSpan => {
        wordSpan.addEventListener('click', function() {
            const word = this.getAttribute('data-word');
            showWordTranslation(word);
        });
    });
}

function showWordTranslation(word) {
    const wordTranslations = getWordTranslation(word);
    
    const tooltip = document.createElement('div');
    tooltip.className = 'word-tooltip';
    tooltip.innerHTML = `
        <div class="word-tooltip-content">
            <strong>${word}</strong><br>
            ${wordTranslations.join(', ')}
        </div>
    `;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip near the mouse
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '9999';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '8px 12px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '14px';
    tooltip.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    
    // Remove tooltip after 3 seconds
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, 3000);
}

function getWordTranslation(word) {
    const wordDict = {
        'güneş': ['sol'],
        'doğu': ['este'],
        'yüksel': ['subir', 'elevarse'],
        'bahçe': ['jardín'],
        'kuş': ['pájaro', 'ave'],
        'şarkı': ['canción'],
        'söyle': ['cantar', 'decir'],
        'çiçek': ['flor'],
        'güzel': ['hermoso', 'bonito'],
        'koku': ['olor', 'aroma'],
        'yay': ['esparcir', 'extender'],
        'sabah': ['mañana'],
        'eski': ['viejo', 'antiguo'],
        'sokak': ['calle'],
        'yürü': ['caminar', 'andar'],
        'adım': ['paso'],
        'yeni': ['nuevo'],
        'hikaye': ['historia', 'cuento'],
        'keşfet': ['descubrir'],
        'şehir': ['ciudad'],
        'ruh': ['alma', 'espíritu'],
        'fısılda': ['susurrar'],
        'deniz': ['mar'],
        'mavi': ['azul'],
        'göz': ['ojo'],
        'bak': ['mirar', 'ver'],
        'kalp': ['corazón'],
        'hızla': ['rápidamente'],
        'çarp': ['latir', 'golpear'],
        'aşk': ['amor'],
        'güç': ['fuerza', 'poder'],
        'büyüle': ['fascinar', 'hechizar']
    };
    
    return wordDict[word.toLowerCase()] || ['traducción no disponible'];
}

function addGrammarTips() {
    const feedbackArea = document.getElementById('feedback-area');
    if (!feedbackArea) return;
    
    const currentSegment = currentTextSegments[currentSegmentIndex];
    const grammarTips = getGrammarTips(currentSegment);
    
    if (grammarTips) {
        const grammarTipDiv = document.createElement('div');
        grammarTipDiv.className = 'grammar-tip';
        grammarTipDiv.innerHTML = `
            <div class="grammar-tip-header">
                <i class="fas fa-graduation-cap"></i>
                <strong>Consejo Gramatical</strong>
            </div>
            <div class="grammar-tip-content">
                ${grammarTips}
            </div>
        `;
        
        feedbackArea.appendChild(grammarTipDiv);
    }
}

function getGrammarTips(turkishText) {
    const tips = {
        'Güneş doğudan yükseldi.': 'Nota: "-dan" indica dirección/origen. "Yükseldi" es pasado simple.',
        'Bahçede kuşlar şarkı söylüyor.': 'Nota: "-de" indica ubicación. "Söylüyor" es presente continuo.',
        'Çiçekler güzel kokular yayıyor.': 'Nota: Plural "-ler". "Yayıyor" es presente continuo.',
        'Bu güzel bir sabah.': 'Nota: "Bu" es demostrativo. No hay verbo "ser" en turco.',
        'İstanbul\'un eski sokaklarında yürüyordu.': 'Nota: "\'un" es genitivo. "Yürüyordu" es pasado continuo.',
        'Her adımda yeni bir hikaye keşfediyordu.': 'Nota: "Her" significa "cada". "Keşfediyordu" es pasado continuo.',
        'Şehrin ruhu ona fısıldıyordu.': 'Nota: "Şehrin" es genitivo. "Fısıldıyordu" es pasado continuo.',
        'Deniz mavisi gözlerle baktı.': 'Nota: "Deniz mavisi" es adjetivo compuesto. "Baktı" es pasado simple.',
        'Kalbi hızla çarpıyordu.': 'Nota: "Hızla" es adverbio. "Çarpıyordu" es pasado continuo.',
        'Aşkın gücü onu büyülüyordu.': 'Nota: "Aşkın" es genitivo. "Büyülüyordu" es pasado continuo.'
    };
    
    return tips[turkishText] || null;
}

function addDifficultyRating() {
    const originalText = document.getElementById('originalText');
    if (!originalText) return;
    
    const currentSegment = currentTextSegments[currentSegmentIndex];
    const difficulty = calculateDifficulty(currentSegment);
    
    const difficultyDiv = document.createElement('div');
    difficultyDiv.className = 'difficulty-rating';
    difficultyDiv.innerHTML = `
        <div class="difficulty-header">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dificultad: ${difficulty.level}</span>
        </div>
        <div class="difficulty-stars">
            ${generateStars(difficulty.stars)}
        </div>
        <div class="difficulty-reason">
            ${difficulty.reason}
        </div>
    `;
    
    originalText.appendChild(difficultyDiv);
}

function calculateDifficulty(text) {
    const words = text.split(/\s+/);
    const wordCount = words.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.replace(/[.,!?;:]/g, '').length, 0) / wordCount;
    
    // Simple difficulty calculation
    let stars = 1;
    let level = 'Principiante';
    let reason = 'Oración simple con vocabulario básico';
    
    if (wordCount > 8) {
        stars++;
        reason = 'Oración más larga';
    }
    
    if (avgWordLength > 6) {
        stars++;
        reason = 'Palabras más complejas';
    }
    
    if (text.includes('ydu') || text.includes('yor')) {
        stars++;
        reason = 'Contiene tiempos verbales complejos';
    }
    
    if (stars >= 4) {
        level = 'Avanzado';
    } else if (stars >= 2) {
        level = 'Intermedio';
    }
    
    return { level, stars: Math.min(stars, 5), reason };
}

function generateStars(count) {
    return Array(5).fill(0).map((_, i) => 
        `<i class="fas fa-star ${i < count ? 'active' : ''}"></i>`
    ).join('');
}

function addTranslationHistory(bookId) {
    const userProgress = userTranslations[bookId];
    if (!userProgress || !userProgress.segments.length) return;
    
    const historyDiv = document.createElement('div');
    historyDiv.className = 'translation-history';
    historyDiv.innerHTML = `
        <div class="history-header">
            <i class="fas fa-history"></i>
            <strong>Historial de Traducciones</strong>
            <button class="btn btn-sm btn-outline" id="toggleHistory">
                <i class="fas fa-chevron-down"></i>
            </button>
        </div>
        <div class="history-content" id="historyContent" style="display: none;">
            ${generateHistoryList(userProgress.segments)}
        </div>
    `;
    
    const translatorModal = document.getElementById('translatorModal');
    if (translatorModal) {
        translatorModal.appendChild(historyDiv);
        
        // Add toggle functionality
        const toggleBtn = document.getElementById('toggleHistory');
        const historyContent = document.getElementById('historyContent');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                if (historyContent.style.display === 'none') {
                    historyContent.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-chevron-up"></i>';
                } else {
                    historyContent.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-chevron-down"></i>';
                }
            });
        }
    }
}

function generateHistoryList(segments) {
    const recentSegments = segments.filter(s => s && s.userTranslation).slice(-5);
    
    if (recentSegments.length === 0) {
        return '<p>No hay traducciones recientes</p>';
    }
    
    return recentSegments.map(segment => `
        <div class="history-item">
            <div class="history-turkish">${segment.turkish}</div>
            <div class="history-translation">${segment.userTranslation}</div>
            <div class="history-meta">
                <span class="history-date">${formatDate(segment.timestamp)}</span>
                ${segment.feedback ? `<span class="history-feedback ${segment.feedback.type}">${segment.feedback.type}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
// Settings panel functionality
        const settingsTab = document.getElementById('settingsTab');
        const settingsOverlay = document.getElementById('settingsOverlay');
        const closeSettings = document.getElementById('closeSettings');

        settingsTab.addEventListener('click', function(e) {
            e.preventDefault();
            settingsOverlay.classList.add('active');
        });

        closeSettings.addEventListener('click', function() {
            settingsOverlay.classList.remove('active');
        });

        // Close settings when clicking outside
        settingsOverlay.addEventListener('click', function(e) {
            if (e.target === settingsOverlay) {
                settingsOverlay.classList.remove('active');
            }
        });

        // Close settings with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && settingsOverlay.classList.contains('active')) {
                settingsOverlay.classList.remove('active');
            }
        });

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

        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
        });

        // Modal functionality
        function closeModal() {
            document.getElementById('explanationModal').classList.remove('active');
        }

       document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('explanationModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});
/*
// Export/Import functionality for user translations
function exportUserTranslations() {
    const exportData = {
        translations: userTranslations,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mis_traducciones.json';
    link.click();
    URL.revokeObjectURL(url);
    
    showNotification('Traducciones exportadas exitosamente');
}

function importUserTranslations(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            if (importData.translations) {
                // Merge with existing translations
                Object.keys(importData.translations).forEach(bookId => {
                    if (!userTranslations[bookId]) {
                        userTranslations[bookId] = importData.translations[bookId];
                    } else {
                        // Merge segments
                        importData.translations[bookId].segments.forEach((segment, index) => {
                            if (segment && !userTranslations[bookId].segments[index]) {
                                userTranslations[bookId].segments[index] = segment;
                            }
                        });
                    }
                });
                
                saveUserTranslations();
                showNotification('Traducciones importadas exitosamente');
            } else {
                showNotification('Archivo de importación inválido', 'error');
            }
        } catch (error) {
            showNotification('Error al importar traducciones', 'error');
        }
    };
    reader.readAsText(file);
}
*/
// Analytics for user progress
function getUserAnalytics() {
    const analytics = {
        totalBooks: Object.keys(userTranslations).length,
        totalSegments: 0,
        completedSegments: 0,
        averageProgress: 0,
        mostActiveDay: null,
        translationStreak: 0,
        favoriteWords: {},
        difficultyProgress: { easy: 0, medium: 0, hard: 0 }
    };
    
    Object.values(userTranslations).forEach(bookData => {
        analytics.totalSegments += bookData.segments.length;
        analytics.completedSegments += bookData.segments.filter(s => s && s.userTranslation).length;
        
        // Count word usage
        bookData.segments.forEach(segment => {
            if (segment && segment.userTranslation) {
                const words = segment.userTranslation.toLowerCase().split(/\s+/);
                words.forEach(word => {
                    analytics.favoriteWords[word] = (analytics.favoriteWords[word] || 0) + 1;
                });
            }
        });
    });
    
    analytics.averageProgress = analytics.totalSegments > 0 ? 
        (analytics.completedSegments / analytics.totalSegments) * 100 : 0;
    
    return analytics;
}

document.addEventListener('DOMContentLoaded', () => {
  const settingsTab = document.getElementById('settingsTab');
  const settingsOverlay = document.getElementById('settingsOverlay');
  const closeSettings = document.getElementById('closeSettings');

  if (settingsTab && settingsOverlay) {
    settingsTab.addEventListener('click', (e) => {
      e.preventDefault();
      settingsOverlay.classList.add('active');
    });
  }

  if (closeSettings && settingsOverlay) {
    closeSettings.addEventListener('click', () => {
      settingsOverlay.classList.remove('active');
    });

    settingsOverlay.addEventListener('click', (e) => {
      if (e.target === settingsOverlay) {
        settingsOverlay.classList.remove('active');
      }
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsOverlay.classList.contains('active')) {
      settingsOverlay.classList.remove('active');
    }
  });
});
