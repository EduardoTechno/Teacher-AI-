document.addEventListener('DOMContentLoaded', function() {
    // Configuración de partículas
    crearParticulas(150);
    
    // Datos de niveles con personalización avanzada
    const niveles = [
        {
            id: 1,
            tema: "Conteo del 1 al 10",
            descripcion: "¡Despega en tu primera aventura numérica! Aprende los números del 1 al 10 con tu amiga tutora. Cada número que domines reparará una parte de nuestra nave espacial.",
            colorLight: "#FF6B6B",
            colorDark: "#D23C3C",
            icono: "1️⃣",
            tieneAnillos: false,
            efectoEspecial: "destello-rojo"
        },
        {
            id: 2,
            tema: "Mini-Juego números del 1 al 10",
            descripcion: "Amplía tus conocimientos matemáticos mientras exploras nuevos planetas. Identifica los numeros del 1 al 10 para recolectar los cristales de energía que alimentan los motores de tu nave.",
            colorLight: "#FFA500",
            colorDark: "#D18700",
            icono: "2️⃣",
            tieneAnillos: false,
            efectoEspecial: "destello-naranja"
        },
        {
            id: 3,
            tema: "Sumas y Restas",
            descripcion: "Domina las sumas y restas para programar las coordenadas de tu recorrido galáctico. Cada cálculo correcto es una estrella que ilumina tu mapa espacial.",
            colorLight: "#32CD32",
            colorDark: "#28A428",
            icono: "3️⃣",
            tieneAnillos: true,
            efectoEspecial: "destello-verde"
        },
        {
            id: 4,
            tema: "Relación número-cantidad",
            descripcion: "Conecta el mundo abstracto con el real. Asocia cada número con la cantidad exacta de meteoritos que necesitamos recolectar para nuestro inventario espacial.",
            colorLight: "#1E90FF",
            colorDark: "#1874CD",
            icono: "4️⃣",
            tieneAnillos: true,
            efectoEspecial: "destello-azul"
        },
        {
            id: 5,
            tema: "Comparar números",
            descripcion: "Toma decisiones críticas para nuestra misión. Aprende qué número es mayor, menor o igual para elegir siempre la ruta más eficiente a través del cosmos.",
            colorLight: "#8A2BE2",
            colorDark: "#6A1B9A",
            icono: "5️⃣",
            tieneAnillos: false,
            efectoEspecial: "destello-purpura"
        },
        {
            id: 6,
            tema: "Series numéricas",
            descripcion: "Descubre los patrones ocultos del universo. Completa secuencias ascendentes y descendentes para activar los sistemas de navegación de nuestra nave.",
            colorLight: "#FFD700",
            colorDark: "#D4AF37",
            icono: "6️⃣",
            tieneAnillos: true,
            efectoEspecial: "destello-dorado"
        }
    ];

    // Elementos del DOM
    const galaxiaNiveles = document.querySelector('.galaxia-niveles');
    const panelMision = document.getElementById('panel-mision');
    const btnCerrar = document.getElementById('btn-cerrar');
    const tituloMision = document.getElementById('titulo-mision');
    const descripcionMision = document.getElementById('descripcion-mision');
    const badgeNivel = document.getElementById('badge-nivel');
    const btnComenzar = document.getElementById('btn-comenzar');
    
    // Variables para el juego de números
    const audioPlayer = document.getElementById('audioPlayer');
    const numberAudioPlayer = document.getElementById('numberAudioPlayer');
    const gameArea = document.getElementById('gameArea');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const scoreDisplay = document.getElementById('score');
    const gameInstruction = document.getElementById('gameInstruction');
    
    // Variables del juego
    let score = 0;
    let currentNumber = null;
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let gameStarted = false;

    // Crear botones de niveles con personalización avanzada
    niveles.forEach(nivel => {
        const btnNivel = document.createElement('button');
        btnNivel.className = 'btn-nivel';
        if (nivel.tieneAnillos) btnNivel.classList.add('anillos');
        
        // Estilos personalizados para cada botón
        btnNivel.style.setProperty('--btn-color-light', nivel.colorLight);
        btnNivel.style.setProperty('--btn-color-dark', nivel.colorDark);
        
        // Contenido del botón
        btnNivel.innerHTML = `
            <span class="numero-nivel">${nivel.id}</span>
            <span class="texto-nivel">${nivel.tema.split(' ')[0]}</span>
            <span class="icono-nivel">${nivel.icono}</span>
        `;
        
        // Efecto al hacer clic
        btnNivel.addEventListener('click', (e) => {
            // Quitar selección anterior
            document.querySelectorAll('.btn-nivel').forEach(btn => {
                btn.classList.remove('seleccionado');
            });
            
            // Seleccionar actual
            btnNivel.classList.add('seleccionado');
            
            // Efecto visual
            crearEfectoDestello(e, nivel.colorLight, nivel.efectoEspecial);
            
            // Mostrar misión
            mostrarMision(nivel);
        });
        
        // Efecto hover avanzado
        btnNivel.addEventListener('mouseenter', () => {
            btnNivel.style.transform = 'scale(1.1) rotateY(15deg)';
            btnNivel.style.boxShadow = `0 15px 30px ${nivel.colorLight}80`;
        });
        
        btnNivel.addEventListener('mouseleave', () => {
            if (!btnNivel.classList.contains('seleccionado')) {
                btnNivel.style.transform = '';
                btnNivel.style.boxShadow = '';
            }
        });
        
        galaxiaNiveles.appendChild(btnNivel);
    });
    
    // Mostrar información de la misión
    function mostrarMision(nivel) {
        tituloMision.textContent = nivel.tema;
        descripcionMision.textContent = nivel.descripcion;
        badgeNivel.textContent = `Nivel ${nivel.id}`;
        
        // Configurar botón comenzar
        btnComenzar.onclick = function() {
            iniciarMision(nivel.id);
        };
        
        // Estilo personalizado para el panel
        panelMision.style.borderColor = `${nivel.colorLight}50`;
        panelMision.style.boxShadow = `0 0 0 100vmax rgba(0, 0, 0, 0.9), 0 0 50px ${nivel.colorLight}80`;
        
        // Mostrar panel con animación
        panelMision.classList.add('mostrar');
        document.body.style.overflow = 'hidden';
    }
    
    // Ocultar panel de misión
    btnCerrar.addEventListener('click', cerrarPanel);
    panelMision.addEventListener('click', function(e) {
        if (e.target === panelMision) cerrarPanel();
    });
    
    function cerrarPanel() {
        panelMision.classList.remove('mostrar');
        document.body.style.overflow = 'auto';
    }
    
    // Efecto visual al hacer clic
    function crearEfectoDestello(event, color, tipo) {
        const destello = document.createElement('div');
        destello.className = 'efecto-destello';
        destello.style.background = color;
        destello.style.boxShadow = `0 0 20px ${color}`;
        
        // Posición del efecto
        const x = event.clientX;
        const y = event.clientY;
        destello.style.left = `${x}px`;
        destello.style.top = `${y}px`;
        
        // Efectos especiales según tipo
        if (tipo === 'destello-dorado') {
            destello.style.animationDuration = '1s';
            destello.style.width = '30px';
            destello.style.height = '30px';
        }
        
        document.body.appendChild(destello);
        
        // Eliminar después de la animación
        setTimeout(() => {
            destello.remove();
        }, 1000);
    }
    
    // Crear partículas de fondo
    function crearParticulas(cantidad) {
        const contenedor = document.getElementById('efecto-particulas');
        
        for (let i = 0; i < cantidad; i++) {
            const particula = document.createElement('div');
            particula.className = 'particula';
            
            // Posición aleatoria
            particula.style.left = `${Math.random() * 100}%`;
            particula.style.top = `${Math.random() * 100}%`;
            
            // Tamaño aleatorio
            const size = Math.random() * 3 + 1;
            particula.style.width = `${size}px`;
            particula.style.height = `${size}px`;
            
            // Opacidad y animación aleatoria
            particula.style.opacity = Math.random();
            particula.style.animationDelay = `${Math.random() * 5}s`;
            particula.style.animationDuration = `${3 + Math.random() * 5}s`;
            
            contenedor.appendChild(particula);
        }
    }
    
    // Iniciar misión
    function iniciarMision(nivelId) {
        console.log(`Iniciando misión del nivel ${nivelId}`);
        
        // Efecto visual antes de redireccionar
        btnComenzar.querySelector('.texto-btn').textContent = '¡Despegando!';
        btnComenzar.style.background = 'linear-gradient(45deg, #32CD32, #228B22)';
        
        // Redirección según el nivel
        setTimeout(() => {
            switch(nivelId) {
                case 1:
                    window.location.href = '/Vista_Tutor';
                    break;
                case 2:
                    window.location.href = '/Vista_Tutor2';
                    break;
                case 3:
                    window.location.href = '/Vista_Tutor3';
                    break;
                default:
                    btnComenzar.querySelector('.texto-btn').textContent = 'Iniciar Viaje';
                    btnComenzar.style.background = 'linear-gradient(45deg, var(--color-primario), var(--color-acento))';
                    cerrarPanel();
                    break;
            }
        }, 1500);
    }

    // =================================================================
    // FUNCIONES PARA EL JUEGO DE NÚMEROS (cuando se entra a Vista_Tutor)
    // =================================================================

    // Función para reproducir o crear audio de números
    async function playNumberAudio(number) {
        const staticAudioPath = `/static/Matematicas/audio/numero${number}.mp3`;
        const piperAudioPath = `/static/audio/numero${number}.mp3`;
        
        // Opciones de reproducción
        const playOptions = {
            volume: 1.0,
            timeout: 5000 // 5 segundos de timeout
        };
        
        try {
            console.log(`Intentando reproducir: ${staticAudioPath}`);
            await playAudioFile(staticAudioPath, playOptions);
            return; // Si tuvo éxito, salimos
        } catch (error) {
            console.log(`Audio original no disponible (${staticAudioPath}), error:`, error);
        }
        
        try {
            console.log(`Intentando reproducir: ${piperAudioPath}`);
            await playAudioFile(piperAudioPath, playOptions);
            return; // Si tuvo éxito, salimos
        } catch (error) {
            console.log(`Audio Piper no disponible (${piperAudioPath}), error:`, error);
        }
        
        try {
            console.log(`Generando nuevo audio para número ${number}`);
            const response = await fetch(`/generar_numero_audio/${number}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al generar audio');
            }
            
            console.log(`Reproduciendo audio recién generado: ${piperAudioPath}`);
            await playAudioFile(piperAudioPath, playOptions);
        } catch (generateError) {
            console.error("Error al generar audio:", generateError);
            
            // Fallback final: usar síntesis de voz del navegador
            await playWithBrowserTTS(number);
            showFeedback(`Encuentra el número: ${number}`, 'correct');
        }
    }
    

    async function playAudioFile(audioPath, options = {}) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(audioPath);
            audio.volume = options.volume || 1.0;
            
            // Timeout para evitar esperas infinitas
            const timeout = setTimeout(() => {
                reject(new Error(`Timeout al cargar audio: ${audioPath}`));
                audio.removeEventListener('canplaythrough', onCanPlay);
                audio.removeEventListener('error', onError);
            }, options.timeout || 3000);
            
            function onCanPlay() {
                clearTimeout(timeout);
                numberAudioPlayer.src = audioPath;
                numberAudioPlayer.play()
                    .then(resolve)
                    .catch(reject);
            }
            
            function onError() {
                clearTimeout(timeout);
                reject(new Error(`No se pudo cargar el audio: ${audioPath}`));
            }
            
            audio.addEventListener('canplaythrough', onCanPlay, { once: true });
            audio.addEventListener('error', onError, { once: true });
            
            audio.load();
        });
    }
    

    async function playWithBrowserTTS(number) {
        return new Promise((resolve) => {
            if (!window.speechSynthesis) {
                console.warn("Síntesis de voz no soportada en este navegador");
                return resolve();
            }
            
            const utterance = new SpeechSynthesisUtterance(number.toString());
            utterance.lang = 'es-ES';
            utterance.rate = 0.8;
            
            utterance.onend = resolve;
            utterance.onerror = resolve;
            
            window.speechSynthesis.speak(utterance);
        });
    }

    // Función para crear las tarjetas de números
    function createNumberCards() {
        gameArea.innerHTML = '';
        
        numbers.forEach(number => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = number;
            card.dataset.number = number;
            
            card.addEventListener('click', () => {
                if (gameStarted && currentNumber) {
                    checkAnswer(number);
                }
            });
            
            gameArea.appendChild(card);
        });
    }

    // Función para verificar la respuesta
    function checkAnswer(selectedNumber) {
        const card = document.querySelector(`.number-card[data-number="${selectedNumber}"]`);
        const rect = card.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        if (selectedNumber === currentNumber) {
            // Respuesta correcta
            score++;
            updateScore();
            showFeedback('¡Correcto!', 'correct');
            card.classList.add('correct');
            createParticles(x, y, 'correct');
        } else {
            // Respuesta incorrecta
            showFeedback('Intenta de nuevo', 'incorrect');
            card.classList.add('incorrect');
            createParticles(x, y, 'incorrect');
        }

        setTimeout(() => {
            resetCards();
            playNextNumber();
        }, 1500);
    }

    // Función para mostrar feedback
    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = 'feedback-message ' + type;
    }

    // Función para actualizar la puntuación
    function updateScore() {
        scoreDisplay.textContent = score;
    }

    // Función para resetear las tarjetas
    function resetCards() {
        document.querySelectorAll('.number-card').forEach(card => {
            card.classList.remove('correct', 'incorrect');
        });
        feedbackMessage.className = 'feedback-message';
    }

    // Función para reproducir el siguiente número
    async function playNextNumber() {
        if (numbers.length === 0) {
            endGame();
            return;
        }

        currentNumber = numbers.shift();
        await playNumberAudio(currentNumber);
    }

    // Función para finalizar el juego
    function endGame() {
        const message = score === 10 ? 
            '¡Misión cumplida! ¡Eres un genio espacial!' : 
            `¡Buen trabajo astronauta! Puntuación: ${score}/10`;
        
        showFeedback(message, score === 10 ? 'correct' : 'incorrect');
        
        // Deshabilitar tarjetas
        document.querySelectorAll('.number-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }

    // Función para crear partículas de efectos
    function createParticles(x, y, type) {
        const colors = type === 'correct' ? 
            ['#64dd17', '#9cff57', '#4fc3f7', '#b388ff'] : 
            ['#ff3d00', '#ff6333', '#ff9800', '#ffeb3b'];
        
        const count = type === 'correct' ? 20 : 15;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${Math.random() * 10 + 5}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            if (type === 'correct') {
                particle.style.animation = `particleFloatUp ${Math.random() * 1 + 1}s ease-out forwards`;
            } else {
                particle.style.animation = `particleExplode ${Math.random() * 0.5 + 0.5}s ease-out forwards`;
            }
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 2000);
        }
    }

    // Seleccionar primer nivel por defecto
    if (niveles.length > 0) {
        const primerNivel = document.querySelector('.btn-nivel');
        if (primerNivel) {
            primerNivel.classList.add('seleccionado');
        }
    }

    // Inicializar el juego si estamos en la página de números
    if (window.location.pathname.includes('Vista_Tutor')) {
        initNumberGame();
    }

    function initNumberGame() {
        numbers = shuffleArray([...numbers]);
        score = 0;
        updateScore();
        createNumberCards();
        gameInstruction.textContent = 'Presiona "Iniciar Misión" para comenzar';
        
        // Configurar botones del juego
        document.getElementById('btnReplay').addEventListener('click', async function() {
            if (currentNumber) {
                await playNumberAudio(currentNumber);
            }
        });
        
        document.getElementById('btnNext').addEventListener('click', async function() {
            if (!gameStarted) {
                gameStarted = true;
                document.getElementById('btnReplay').disabled = false;
                await playNextNumber();
            } else if (numbers.length > 0) {
                resetCards();
                await playNextNumber();
            }
        });
    }

    // Función para mezclar array (usada en el juego de números)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});