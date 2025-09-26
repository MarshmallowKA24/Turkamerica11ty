// ========================================
// GRAMATICA.JS - Funcionalidad específica de la página de gramática
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarPaginaGramatica();
});

function inicializarPaginaGramatica() {
    configurarEnlacesRecursos();
    inicializarModalExplicacion();
}

// ========================================
// EFECTOS DE ENLACES DE RECURSOS
// ========================================
function configurarEnlacesRecursos() {
    document.querySelectorAll('.resource-link').forEach(enlace => {
        enlace.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });

        enlace.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });

        // Agregar seguimiento de clics
        enlace.addEventListener('click', function() {
            rastrearUsoRecurso(this.textContent);
        });
    });
}

function rastrearUsoRecurso(nombreRecurso) {
    const uso = window.AppUtils.Storage.get('usoRecursos', {});
    uso[nombreRecurso] = (uso[nombreRecurso] || 0) + 1;
    uso.ultimoAcceso = new Date().toISOString();
    
    window.AppUtils.Storage.set('usoRecursos', uso);
}

// ========================================
// MODAL DE EXPLICACIÓN
// ========================================
function inicializarModalExplicacion() {
    const modal = document.getElementById('explanationModal');
    if (!modal) return;

    // Configurar funcionalidad de cierre
    window.cerrarModalExplicacion = function() {
        modal.classList.remove('active');
    };

    // Cerrar al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            window.cerrarModalExplicacion();
        }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            window.cerrarModalExplicacion();
        }
    });
}

function mostrarExplicacionGramatica(tema, contenido) {
    const modal = document.getElementById('explanationModal');
    const elementoTitulo = modal.querySelector('.modal-title');
    const elementoContenido = modal.querySelector('.modal-body');

    if (elementoTitulo) elementoTitulo.textContent = tema;
    if (elementoContenido) elementoContenido.innerHTML = contenido;

    modal.classList.add('active');
}

// ========================================
// UTILIDADES DE GRAMÁTICA
// ========================================
function obtenerConsejosGramatica() {
    return window.AppUtils.Storage.get('consejosGramatica', []);
}

function guardarConsejoGramatica(consejo) {
    const consejos = obtenerConsejosGramatica();
    consejos.push({
        contenido: consejo,
        marca: new Date().toISOString(),
        id: window.AppUtils.Utils.generateId()
    });
    
    window.AppUtils.Storage.set('consejosGramatica', consejos);
    window.AppUtils.Notification.success('Consejo guardado correctamente');
}

function obtenerProgresoEstudio() {
    return window.AppUtils.Storage.get('progresoGramatica', {
        temasCompletados: [],
        rachaActual: 0,
        tiempoTotalEstudio: 0
    });
}

function actualizarProgresoEstudio(tema) {
    const progreso = obtenerProgresoEstudio();
    
    if (!progreso.temasCompletados.includes(tema)) {
        progreso.temasCompletados.push(tema);
        progreso.rachaActual++;
        
        window.AppUtils.Storage.set('progresoGramatica', progreso);
        window.AppUtils.Notification.success(`Tema "${tema}" completado`);
    }
}
// EXPORTACIONES GLOBALES
window.utilidadesGramatica = {
    mostrarExplicacion: mostrarExplicacionGramatica,
    guardarConsejo: guardarConsejoGramatica,
    obtenerConsejos: obtenerConsejosGramatica,
    actualizarProgreso: actualizarProgresoEstudio,
    obtenerProgreso: obtenerProgresoEstudio
};

console.log('Página de gramática inicializada correctamente');