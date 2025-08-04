document.addEventListener('DOMContentLoaded', function() {
    const earth = document.getElementById('earth');
    const planetEffect = document.getElementById('planetEffect');
    const backButton = document.querySelector('.back-button');
    const spaceSound = document.getElementById('spaceSound');
    const clickSound = document.getElementById('clickSound');
    const tutorIcon = document.querySelector('.tutor-icon');
    
    // Precargar sonidos
    spaceSound.volume = 0.3;
    clickSound.volume = 0.5;
    
    // Reproducir música de fondo
    spaceSound.loop = true;
    setTimeout(() => {
        spaceSound.play().catch(e => console.log("Autoplay bloqueado:", e));
    }, 1000);
    
    // Efecto al hacer clic en la Tierra
    earth.addEventListener('click', function() {
        clickSound.play();
        earth.classList.add('planet-selected');
        planetEffect.style.opacity = '1';
        planetEffect.style.transform = 'scale(2)';
        
        setTimeout(function() {
            // Redirigir usando ruta de Flask
            window.location.href = '/Matematicas';
        }, 2000);
    });
    
    // Efecto hover para el botón de volver
    backButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-5px)';
    });
    
    backButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
    backButton.addEventListener('click', function(e) {
        e.preventDefault(); // Prevenir comportamiento por defecto
        clickSound.play();
        
        // Efecto de transición
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        document.body.appendChild(transition);
        
        setTimeout(() => {
            window.location.href = '/materias';
        }, 500);
    });
    
    // Efectos para planetas bloqueados
    const lockedPlanets = document.querySelectorAll('.locked-planet');
    lockedPlanets.forEach((planet, index) => {
        planet.addEventListener('mouseenter', () => {
            planet.style.transform = 'scale(1.1) rotateY(20deg)';
            planet.style.boxShadow = `0 0 30px ${index === 0 ? '#e57373' : index === 1 ? '#ffb74d' : '#fff176'}`;
        });
        
        planet.addEventListener('mouseleave', () => {
            planet.style.transform = 'scale(1) rotateY(0)';
            planet.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        });
    });
    
    // Interacción con el tutor
    tutorIcon.addEventListener('click', function() {
        this.style.animation = 'none';
        void this.offsetWidth; // Trigger reflow
        this.style.animation = 'shake 0.5s ease, float 3s ease-in-out infinite, rotateTutor 8s linear infinite';
        
        // Cambiar mensaje inmediatamente al hacer clic
        changeTutorMessage();
    });
    
    // Mensajes aleatorios del tutor
    const tutorMessages = [
        "¡La Tierra es nuestro hogar en el universo!",
        "¿Sabías que las matemáticas son el lenguaje del cosmos?",
        "¡Haz clic en la Tierra para comenzar tu misión educativa!",
        "Las estrellas pueden guiarte en tu aprendizaje.",
        "¡Las matemáticas son más divertidas en el espacio!",
        "Pronto exploraremos Marte y Júpiter también.",
        "Cada planeta tiene lecciones especiales para ti.",
        "¡Prepárate para un viaje educativo increíble!"
    ];
    
    const tutorBubble = document.querySelector('.tutor-bubble p');
    
    function changeTutorMessage() {
        const randomIndex = Math.floor(Math.random() * tutorMessages.length);
        const randomMessage = tutorMessages[randomIndex];
        
        // Efecto de desvanecimiento
        tutorBubble.style.animation = 'fadeOut 0.3s forwards';
        
        setTimeout(() => {
            tutorBubble.textContent = randomMessage;
            tutorBubble.style.animation = 'fadeIn 0.3s forwards';
        }, 300);
    }
    
    // Cambiar mensaje cada 8 segundos
    setInterval(changeTutorMessage, 8000);
    
    // Añadir estilos dinámicos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.6; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Efecto de cursor personalizado para elementos interactivos
    const interactiveElements = [earth, backButton, ...lockedPlanets, tutorIcon];
    interactiveElements.forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('mouseenter', () => {
            document.body.style.cursor = 'pointer';
        });
        el.addEventListener('mouseleave', () => {
            document.body.style.cursor = 'default';
        });
    });
    
    // Efecto de carga inicial
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});