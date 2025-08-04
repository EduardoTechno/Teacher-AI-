// Crear estrellas dinámicas
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Tamaño aleatorio entre 1 y 3px
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Posición aleatoria
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Duración de animación aleatoria
        star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
        
        // Retraso de animación aleatorio
        star.style.animationDelay = `${Math.random() * 5}s`;
        
        starsContainer.appendChild(star);
    }
}

// Crear astronautas flotantes
function createFloatingAstronauts() {
    const container = document.getElementById('floatingAstronauts');
    const astronautCount = 5;
    

}

// Animación del personaje alienígena
function setupAlienCharacter() {
    const alien = document.getElementById('alienCharacter');
    
    alien.addEventListener('click', function() {
        this.style.transform = 'scale(1.3) rotate(360deg)';
        this.style.transition = 'transform 0.8s ease';
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            createStarConfetti(this.getBoundingClientRect().x + 90, this.getBoundingClientRect().y + 90);
        }, 800);
    });
}

// Efecto de confeti estelar
function createStarConfetti(x, y) {
    const colors = ['#6c5ce7', '#00cec9', '#ffeaa7', '#fd79a8', '#55efc4'];
    
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.classList.add('star-confetti');
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        
        // Color aleatorio
        star.style.filter = `hue-rotate(${Math.random() * 360}deg) brightness(1.2)`;
        
        document.body.appendChild(star);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const lifetime = 1000 + Math.random() * 500;
        const rotation = Math.random() * 360;
        
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / lifetime;
            
            if (progress >= 1) {
                star.remove();
                return;
            }
            
            star.style.transform = `translate(${vx * elapsed / 20}px, ${vy * elapsed / 20}px) rotate(${rotation + progress * 360}deg) scale(${0.5 + Math.sin(progress * Math.PI) * 0.5})`;
            star.style.opacity = 1 - progress;
            
            requestAnimationFrame(update);
        }
        
        star.style.opacity = '1';
        requestAnimationFrame(update);
    }
}

// Animación del botón
function animateButton() {
    const button = document.getElementById('startButton');
    
    // Elimina los event listeners duplicados
    button.removeEventListener('click', animateButton);
    
    button.addEventListener('click', (event) => {
        // Efectos visuales
        const rect = button.getBoundingClientRect();
        createStarConfetti(rect.x + rect.width/2, rect.y + rect.height/2);
        
        // Animación del botón
        button.style.transform = 'scale(0.95)';
        button.disabled = true;
        
        setTimeout(() => {
            // Redirigir usando la ruta de Flask
            window.location.href = '/grados';  // Usa la ruta definida en app.py
        }, 100);
    });
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
    });
    
    button.addEventListener('click', () => {
        // Efecto de confeti al hacer clic
        const rect = button.getBoundingClientRect();
        createStarConfetti(rect.x + rect.width/2, rect.y + rect.height/2);
        
        // Animación del botón
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
    });
}


// Modificar el evento DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    createFloatingAstronauts();
    setupAlienCharacter();
    animateButton();
    playWelcomeAudio(); // Añadir esta línea
});