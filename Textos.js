// Global variables
let books = [];
let nextBookId = 3;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
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
                
                showNotification('¡Libro agregado exitosamente!');
                clearFormData();
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
    if (modal) modal.style.display = 'flex';
}

function openAnalyzer(bookId, bookTitle) {
    const modal = document.getElementById('analyzerModal');
    const title = document.getElementById('analyzerTitle');
    
    if (title) title.textContent = `Análisis: ${bookTitle}`;
    if (modal) modal.style.display = 'flex';
}

function deleteBook(bookId, bookCard) {
    if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
        bookCard.remove();
        books = books.filter(function(book) {
            return book.id != bookId;
        });
        showNotification('Libro eliminado exitosamente');
    }
}

function initializeModals() {
    setupModalClose('readerModal', ['closeReader', 'closeReader2']);
    setupModalClose('translatorModal', ['closeTranslator', 'closeTranslator2']);
    setupModalClose('analyzerModal', ['closeAnalyzer', 'closeAnalyzer2']);
    
    // Translation functionality
    const translateText = document.getElementById('translateText');
    const translateAll = document.getElementById('translateAll');
    const exportAnalysis = document.getElementById('exportAnalysis');
    
    if (translateText) {
        translateText.addEventListener('click', function() {
            const translatedText = document.getElementById('translatedText');
            if (translatedText) {
                translatedText.innerHTML = `
                    <p><strong>Traducción automática:</strong></p>
                    <p>El sol salió por el este. Los pájaros cantan en el jardín. Las flores esparcen hermosos aromas. Esta es una hermosa mañana.</p>
                    <p><em>Nota: Esta es una traducción de ejemplo. En una implementación real, se conectaría con un servicio de traducción.</em></p>
                `;
            }
        });
    }
    
    if (translateAll) {
        translateAll.addEventListener('click', function() {
            showNotification('Iniciando traducción completa del libro...\nEsto puede tomar varios minutos.');
        });
    }
    
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

function setupModalClose(modalId, closeBtnIds) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    closeBtnIds.forEach(function(btnId) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initializeFilters() {
    const levelFilter = document.getElementById('levelFilter');
    const genreFilter = document.getElementById('genreFilter');
    const searchBooks = document.getElementById('searchBooks');

    if (levelFilter) {
        levelFilter.addEventListener('change', filterBooks);
    }
    
    if (genreFilter) {
        genreFilter.addEventListener('change', filterBooks);
    }
    
    if (searchBooks) {
        searchBooks.addEventListener('input', filterBooks);
    }
}

function filterBooks() {
    const booksGrid = document.getElementById('booksGrid');
    const levelFilter = document.getElementById('levelFilter');
    const genreFilter = document.getElementById('genreFilter');
    const searchBooks = document.getElementById('searchBooks');
    
    if (!booksGrid) return;
    
    const cards = booksGrid.querySelectorAll('.content-card');
    const levelValue = levelFilter ? levelFilter.value : '';
    const genreValue = genreFilter ? genreFilter.value : '';
    const searchValue = searchBooks ? searchBooks.value.toLowerCase() : '';

    cards.forEach(function(card) {
        const cardLevel = card.getAttribute('data-level');
        const cardGenre = card.getAttribute('data-genre');
        const cardTitleElement = card.querySelector('h3');
        const cardAuthorElement = card.querySelector('.content-artist');
        
        const cardTitle = cardTitleElement ? cardTitleElement.textContent.toLowerCase() : '';
        const cardAuthor = cardAuthorElement ? cardAuthorElement.textContent.toLowerCase() : '';

        const levelMatch = !levelValue || cardLevel === levelValue;
        const genreMatch = !genreValue || cardGenre === genreValue;
        const searchMatch = !searchValue || cardTitle.includes(searchValue) || cardAuthor.includes(searchValue);

        if (levelMatch && genreMatch && searchMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
            } else {
                localStorage.setItem('darkMode', 'disabled');
            }
        });
        
        // Load saved preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    }
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(function(notification) {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#3b82f6';
    }
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span style="margin-left: 8px;">${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// File reader functionality for uploaded books
function readBookFile(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const content = e.target.result;
            resolve(content);
        };
        
        reader.onerror = function(e) {
            reject(new Error('Error reading file'));
        };
        
        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            // For PDF and EPUB files, you would need additional libraries
            // This is a simplified version
            reader.readAsText(file);
        }
    });
}

// Enhanced book actions with actual file content
async function openReaderWithContent(bookId, bookTitle) {
    const book = books.find(function(b) {
        return b.id == bookId;
    });
    
    if (book && book.file) {
        try {
            const content = await readBookFile(book.file);
            const modal = document.getElementById('readerModal');
            const title = document.getElementById('readerTitle');
            const readerContent = document.getElementById('readerContent');
            
            if (title) title.textContent = `Leer: ${bookTitle}`;
            if (readerContent) {
                readerContent.innerHTML = `
                    <div class="book-content">
                        <h4>${book.title}</h4>
                        <p><strong>Autor:</strong> ${book.author}</p>
                        <hr>
                        <div class="text-content">${content.substring(0, 2000)}...</div>
                    </div>
                `;
            }
            
            if (modal) modal.style.display = 'flex';
        } catch (error) {
            showNotification('Error al leer el archivo del libro', 'error');
        }
    } else {
        openReader(bookId, bookTitle);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .drag-over {
        border-color: #3b82f6 !important;
        background-color: rgba(59, 130, 246, 0.1) !important;
    }
`;
document.head.appendChild(style);