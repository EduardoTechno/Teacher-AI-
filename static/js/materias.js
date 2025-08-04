// Función para crear el fondo de galaxia con estrellas
function createGalaxyBg() {
    const container = document.getElementById('galaxyBg');
    container.innerHTML = '';
    
    // Crear estrellas grandes
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.animationDuration = `${Math.random() * 10 + 5}s`;
        
        // Hacer algunas estrellas más brillantes
        if (Math.random() > 0.8) {
            star.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px white`;
        }
        
        container.appendChild(star);
    }
}

// Función para configurar la selección de materias
function setupSubjectSelection() {
    const subjectCards = document.querySelectorAll('.subject-card');
    const urlParams = new URLSearchParams(window.location.search);
    const grade = urlParams.get('grade') || '1'; // Obtener el grado de la URL
    
    subjectCards.forEach(card => {
        // Efecto 3D (se mantiene igual)
        card.addEventListener('mousemove', (e) => {
            /* ... (código existente) ... */
        });
        
        card.addEventListener('mouseleave', () => {
            /* ... (código existente) ... */
        });
        
        card.addEventListener('click', function() {
            const subject = this.getAttribute('data-subject');
            
            // Deseleccionar otras tarjetas
            subjectCards.forEach(c => {
                c.classList.remove('selected');
                c.style.transform = 'rotateX(0) rotateY(0) scale(1)';
            });
            
            // Seleccionar esta tarjeta
            this.classList.add('selected');
            this.style.transform = 'rotateX(0) rotateY(0) scale(0.95)';
            
            // Efecto especial de selección
            createSelectionEffect(this);
            
            // Redirigir después de la animación
            setTimeout(() => {
                if (subject === 'math') {
                    // Redirigir usando ruta de Flask
                    window.location.href = `/Planetas?grade=${grade}&subject=math`;
                } else if (subject === 'spanish') {
                    window.location.href = `/lecciones?grade=${grade}&subject=spanish`;
                }
                // Agrega más materias según necesites
            }, 1000);
        });
    });
}

// Función para crear efecto visual al seleccionar
function createSelectionEffect(card) {
    // Rayos de luz
    for (let i = 0; i < 8; i++) {
        const beam = document.createElement('div');
        beam.className = 'beam';
        beam.style.left = '50%';
        beam.style.bottom = '100%';
        beam.style.transform = `rotate(${i * 45}deg)`;
        beam.style.animation = `beam 1.5s ease-out ${i * 0.1}s`;
        
        card.appendChild(beam);
        setTimeout(() => beam.remove(), 2000);
    }
    
    // Partículas
    const particleCount = 30;
    const color = card.getAttribute('data-subject') === 'math' ? '#6c5ce7' : '#00cec9';
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(card, color);
    }
}

// Función para crear partículas animadas
function createParticle(element, color) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.backgroundColor = color;
    particle.style.width = `${Math.random() * 10 + 5}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.position = 'absolute';
    particle.style.left = `${element.offsetLeft + element.offsetWidth/2}px`;
    particle.style.top = `${element.offsetTop + element.offsetHeight/2}px`;
    particle.style.opacity = '0';
    particle.style.boxShadow = `0 0 10px ${color}`;
    particle.style.zIndex = '1000';
    
    document.body.appendChild(particle);
    
    // Animación
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1000 + 500;
    
    particle.animate([
        { 
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0)'
        },
        { 
            opacity: 1,
            transform: 'translate(-50%, -50%) scale(1)',
            offset: 0.1
        },
        { 
            opacity: 0,
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`
        }
    ], {
        duration: duration,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = () => particle.remove();
}

// Función para el botón de volver
function setupBackButton() {
    const backButton = document.getElementById('backButton');
    
    if (!backButton) return;
    
    backButton.addEventListener('click', () => {
        backButton.disabled = true;
        
        // Crear efecto de transición
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        
        // Redirigir usando ruta de Flask
        setTimeout(() => {
            window.location.href = '/grados';
        }, 500);
    });
    backButton.addEventListener('mouseenter', () => {
        backButton.style.transform = 'translateX(-10px)';
        backButton.style.backgroundColor = 'rgba(253, 121, 168, 0.4)';
    });
    
    backButton.addEventListener('mouseleave', () => {
        backButton.style.transform = 'translateX(0)';
        backButton.style.backgroundColor = 'rgba(253, 121, 168, 0.2)';
    });
}

// Función para animar el logo
function animateLogo() {
    const logo = document.getElementById('interactiveLogo');
    if (!logo) return;
    
    const letters = logo.textContent.split('');
    logo.innerHTML = letters.map(letter => 
        `<span class="logo-letter" style="display:inline-block;">${letter}</span>`
    ).join('');
    
    const logoLetters = document.querySelectorAll('.logo-letter');
    logoLetters.forEach((letter, index) => {
        letter.style.animation = `bounce 0.5s ease ${index * 0.1}s forwards`;
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    createGalaxyBg();
    setupSubjectSelection();
    setupBackButton();
    animateLogo();
    
    // Añadir estilos dinámicos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }
        @keyframes beam {
            0% { opacity: 0; transform: translateY(0) scaleY(0); }
            50% { opacity: 0.7; }
            100% { opacity: 0; transform: translateY(-100px) scaleY(2); }
        }
        .page-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dark);
            z-index: 1000;
            opacity: 0;
            animation: fadeIn 0.5s forwards;
        }
        .math-transition {
            background: linear-gradient(135deg, #6c5ce7, #2d3436);
        }
        @keyframes fadeIn {
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});