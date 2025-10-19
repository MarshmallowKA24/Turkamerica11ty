// ================================
// CAROUSEL SYSTEM - SOLO MÓVIL
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar en móvil
    if (window.innerWidth <= 768) {
        initMobileCarousel();
    }
    
    // Reinicializar en resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth <= 768) {
                initMobileCarousel();
            } else {
                destroyMobileCarousel();
            }
        }, 250);
    });
});

function initMobileCarousel() {
    const levelsGrid = document.querySelector('.levels-grid');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!levelsGrid || indicators.length === 0) return;
    
    // Actualizar indicadores en scroll
    levelsGrid.addEventListener('scroll', updateIndicators);
    
    // Click en indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            scrollToCard(index);
        });
    });
    
    // Actualizar indicador inicial
    updateIndicators();
}

function updateIndicators() {
    const levelsGrid = document.querySelector('.levels-grid');
    const indicators = document.querySelectorAll('.carousel-indicator');
    const cards = document.querySelectorAll('.levels-grid > .level-card:not(.special)');
    
    if (!levelsGrid || !cards.length) return;
    
    const scrollLeft = levelsGrid.scrollLeft;
    const cardWidth = cards[0].offsetWidth + 15; // incluye el gap
    const currentIndex = Math.round(scrollLeft / cardWidth);
    
    indicators.forEach((indicator, index) => {
        if (index === currentIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function scrollToCard(index) {
    const levelsGrid = document.querySelector('.levels-grid');
    const cards = document.querySelectorAll('.levels-grid > .level-card:not(.special)');
    
    if (!levelsGrid || !cards[index]) return;
    
    const cardWidth = cards[0].offsetWidth + 15; // incluye el gap
    const scrollPosition = cardWidth * index;
    
    levelsGrid.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
}

function destroyMobileCarousel() {
    const levelsGrid = document.querySelector('.levels-grid');
    
    if (levelsGrid) {
        levelsGrid.removeEventListener('scroll', updateIndicators);
    }
}

console.log('✅ Carousel system loaded');