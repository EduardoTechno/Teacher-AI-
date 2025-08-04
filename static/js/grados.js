// Crear estrellas dinámicas (similar a script.js)

// Crear planetas flotantes
function createFloatingPlanets() {
    const container = document.getElementById('floatingPlanets');
    const planetCount = 3;
    const planets = ['🪐', '🌎', '🛸'];
    
    for (let i = 0; i < planetCount; i++) {
        const planet = document.createElement('div');
        planet.style.fontSize = `${Math.random() * 30 + 50}px`;
        planet.style.left = `${Math.random() * 100}%`;
        planet.style.top = `${Math.random() * 100}%`;
        planet.style.setProperty('--duration', `${Math.random() * 20 + 20}s`);
        planet.style.opacity = '0.7';
        planet.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(planet);
    }
}

// Selección de grado (versión para Flask)
function setupGradeSelection() {
    const gradeCards = document.querySelectorAll('.grade-card');
    
    gradeCards.forEach(card => {
        card.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            createStarConfetti(this.getBoundingClientRect().x + 150, this.getBoundingClientRect().y + 150);
            
            this.style.transform = 'scale(0.95)';
            this.style.boxShadow = '0 0 30px rgba(255, 234, 167, 0.8)';
            
            setTimeout(() => {
                // Redirigir usando la ruta de Flask
                window.location.href = `/materias?grade=${grade}`;
            }, 500);
        });
    });
    
    // Botón volver (versión para Flask)
    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = '/';
    });
}

// Inicializar
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    createFloatingPlanets();
    setupGradeSelection();
});