document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const audioPlayer = document.getElementById('audioPlayer');
    const numberAudioPlayer = document.getElementById('numberAudioPlayer');
    const avatarContainer = document.getElementById('avatarContainer');
    const avatarImage = document.getElementById('avatarImage');
    const avatarVideo = document.getElementById('avatarVideo');
    const btnReplay = document.getElementById('btnReplay');
    const btnNext = document.getElementById('btnNext');
    const gameArea = document.getElementById('gameArea');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const scoreDisplay = document.getElementById('score');
    const teacherCharacter = document.getElementById('teacherCharacter');
    const gameInstruction = document.getElementById('gameInstruction');

    // Variables del juego
    let score = 0;
    let currentNumber = null;
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let gameStarted = false;

    // Inicializar el juego
    function initGame() {
        // Mezclar los números aleatoriamente
        numbers = shuffleArray([...numbers]);
        
        score = 0;
        updateScore();
        createNumberCards();
        setupAvatar();
        
        // Animación inicial
        animateTitle();
        createStars(50);
        
        // Mensaje de bienvenida
        showWelcomeMessage();
    }

    // Función para mezclar array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Configuración del avatar
    function setupAvatar() {
        avatarVideo.muted = true;
        avatarVideo.loop = true;
        avatarVideo.playsInline = true;
        avatarVideo.currentTime = 0;

        // Controlador de eventos para audio
        function handleAudioEvent(event) {
            if (event.type === 'play') {
                avatarContainer.classList.add('talking');
                avatarVideo.play().catch(e => {
                    console.error("Error al reproducir video:", e);
                    avatarContainer.classList.remove('talking');
                });
            } else {
                avatarContainer.classList.remove('talking');
                avatarVideo.pause();
                avatarVideo.currentTime = 0;
            }
        }

        // Configurar eventos para ambos reproductores de audio
        [audioPlayer, numberAudioPlayer].forEach(audio => {
            if (audio) {
                audio.addEventListener('play', handleAudioEvent);
                audio.addEventListener('ended', handleAudioEvent);
                audio.addEventListener('pause', handleAudioEvent);
            }
        });

        // Interacción con el avatar
        avatarContainer.addEventListener('click', () => {
            animateElement(avatarContainer, 'pulse');
            showTemporaryMessage("¡Soy tu guía espacial!", 2000);
        });
    }

    // Configuración de botones
    function setupButtons() {
        // Efecto hover y animación
        btnReplay.addEventListener('mouseenter', () => {
            btnReplay.classList.add('pulse');
        });
        
        btnReplay.addEventListener('mouseleave', () => {
            btnReplay.classList.remove('pulse');
        });
        
        btnNext.addEventListener('mouseenter', () => {
            btnNext.classList.add('pulse');
        });
        
        btnNext.addEventListener('mouseleave', () => {
            btnNext.classList.remove('pulse');
        });

        // Eventos de click
        btnReplay.addEventListener('click', function() {
            if (currentNumber) {
                animateElement(btnReplay, 'jump');
                numberAudioPlayer.currentTime = 0;
                numberAudioPlayer.play();
                animateCharacter('nod');
            }
        });

        btnNext.addEventListener('click', function() {
            if (numbers.length > 0 || !gameStarted) {
                animateElement(btnNext, 'jump');
                gameStarted = true;
                resetCards();
                playNextNumber();
                animateCharacter('spin');
            }
        });
    }

    // Crear las tarjetas de números
    function createNumberCards() {
        gameArea.innerHTML = '';
        
        // Crear estrellas de fondo para las tarjetas
        createCardStars(10);
        
        numbers.forEach(number => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = number;
            card.dataset.number = number;
            
            // Efecto hover
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('correct') && !card.classList.contains('incorrect')) {
                    animateElement(card, 'float');
                }
            });
            
            // Click para seleccionar
            card.addEventListener('click', () => {
                if (gameStarted && currentNumber) {
                    checkAnswer(number, card);
                }
            });
            
            gameArea.appendChild(card);
        });
    }

    // Reproducir el siguiente número
    function playNextNumber() {
        if (numbers.length === 0) {
            endGame();
            return;
        }

        currentNumber = numbers.shift();
        playNumberAudio(currentNumber);
        updateInstruction(`Toca el número: ${currentNumber}`);
    }

    // Reproducir audio del número
    function playNumberAudio(number) {
        numberAudioPlayer.src = `/static/audio/numero${number}.mp3`;
        numberAudioPlayer.play().catch(e => console.error("Error al reproducir audio:", e));
    }

    // Verificar respuesta
    function checkAnswer(selectedNumber, card) {
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
            animateCharacter('jump');
        } else {
            // Respuesta incorrecta
            showFeedback('Intenta de nuevo', 'incorrect');
            card.classList.add('incorrect');
            createParticles(x, y, 'incorrect');
            animateCharacter('shake');
        }

        setTimeout(() => {
            resetCards();
            playNextNumber();
        }, 1500);
    }

    // Mostrar feedback
    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = 'feedback-message ' + type;
        animateElement(feedbackMessage, 'pulse');
    }

    // Mostrar mensaje temporal
    function showTemporaryMessage(message, duration) {
        const tempMsg = document.createElement('div');
        tempMsg.className = 'feedback-message correct';
        tempMsg.textContent = message;
        tempMsg.style.position = 'fixed';
        tempMsg.style.bottom = '20%';
        tempMsg.style.left = '50%';
        tempMsg.style.transform = 'translateX(-50%)';
        tempMsg.style.zIndex = '1000';
        tempMsg.style.animation = 'fadeInUp 0.5s';
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            tempMsg.style.animation = 'fadeOut 0.5s';
            setTimeout(() => tempMsg.remove(), 500);
        }, duration);
    }

    // Mostrar mensaje de bienvenida
    function showWelcomeMessage() {
        gameInstruction.innerHTML = '<i class="fas fa-rocket"></i> ¡Bienvenido, astronauta! <i class="fas fa-star"></i>';
        setTimeout(() => {
            updateInstruction('Presiona "Iniciar Mision" para comenzar');
        }, 3000);
    }

    // Actualizar instrucción
    function updateInstruction(text) {
        gameInstruction.innerHTML = `<i class="fas fa-satellite-dish"></i> ${text}`;
        animateElement(gameInstruction, 'pulse');
    }

    // Actualizar puntuación
    function updateScore() {
        scoreDisplay.textContent = score;
        animateElement(scoreDisplay.parentElement, 'jump');
    }

    // Resetear tarjetas
    function resetCards() {
        document.querySelectorAll('.number-card').forEach(card => {
            card.classList.remove('correct', 'incorrect');
        });
        feedbackMessage.className = 'feedback-message';
    }

    // Finalizar juego
    function endGame() {
        const message = score === 10 ? 
            '¡Misión cumplida! ¡Eres un genio espacial!' : 
            `¡Buen trabajo astronauta! Puntuación: ${score}/10`;
        
        showFeedback(message, score === 10 ? 'correct' : 'incorrect');
        
        // Deshabilitar tarjetas
        document.querySelectorAll('.number-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
        
        // Efecto especial si ganó
        if (score === 10) {
            createFireworks();
        }
        
        // Mostrar botón de reinicio
        const restartBtn = document.createElement('button');
        restartBtn.className = 'action-button pulse';
        restartBtn.innerHTML = '<i class="fas fa-redo"></i> Jugar de nuevo';
        restartBtn.style.margin = '20px auto';
        restartBtn.style.display = 'block';
        restartBtn.addEventListener('click', () => location.reload());
        
        feedbackMessage.insertAdjacentElement('afterend', restartBtn);
    }

    // Animación del personaje
    function animateCharacter(animation) {
        teacherCharacter.style.animation = 'none';
        void teacherCharacter.offsetWidth; // Trigger reflow
        teacherCharacter.style.animation = `${animation} 0.5s`;
        
        setTimeout(() => {
            teacherCharacter.style.animation = 'float 4s ease-in-out infinite';
        }, 500);
    }

    // Animación de elementos
    function animateElement(element, animation) {
        element.style.animation = 'none';
        void element.offsetWidth; // Trigger reflow
        element.style.animation = `${animation} 0.5s`;
    }

    // Crear partículas de efecto
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
                // Partículas de éxito (flotan hacia arriba)
                particle.style.animation = `particleFloatUp ${Math.random() * 1 + 1}s ease-out forwards`;
            } else {
                // Partículas de error (explosión)
                particle.style.animation = `particleExplode ${Math.random() * 0.5 + 0.5}s ease-out forwards`;
            }
            
            document.body.appendChild(particle);
            
            // Eliminar después de la animación
            setTimeout(() => particle.remove(), 2000);
        }
    }

    // Crear fuegos artificiales al ganar
    function createFireworks() {
        const colors = ['#4fc3f7', '#b388ff', '#64dd17', '#ffeb3b', '#ff9800'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight / 2;
                
                for (let j = 0; j < 20; j++) {
                    const firework = document.createElement('div');
                    firework.className = 'particle';
                    firework.style.width = `${Math.random() * 6 + 3}px`;
                    firework.style.height = firework.style.width;
                    firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    firework.style.left = `${x}px`;
                    firework.style.top = `${y}px`;
                    firework.style.animation = `fireworkExplode ${Math.random() * 1 + 0.5}s ease-out forwards`;
                    firework.style.zIndex = '100';
                    
                    document.body.appendChild(firework);
                    
                    setTimeout(() => firework.remove(), 1500);
                }
            }, i * 200);
        }
    }

    // Crear estrellas decorativas
    function createStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'particle';
            star.style.width = `${Math.random() * 4 + 2}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = 'white';
            star.style.position = 'fixed';
            star.style.left = `${Math.random() * 100}vw`;
            star.style.top = `${Math.random() * 100}vh`;
            star.style.opacity = '0';
            star.style.animation = `starTwinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`;
            star.style.zIndex = '1';
            
            document.body.appendChild(star);
        }
    }

    // Crear estrellas para el área de juego
    function createCardStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'particle';
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = 'white';
            star.style.position = 'absolute';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = '0.7';
            star.style.animation = `starTwinkle ${Math.random() * 4 + 2}s infinite ${Math.random() * 4}s`;
            star.style.zIndex = '0';
            
            gameArea.appendChild(star);
        }
    }

    // Animación del título
    function animateTitle() {
        const title = document.querySelector('.game-header h1');
        const letters = title.textContent.split('');
        title.textContent = '';
        
        letters.forEach((letter, i) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.style.display = 'inline-block';
            span.style.animation = `bounceIn 0.5s ${i * 0.1}s both`;
            title.appendChild(span);
        });
    }

    // Inicializar el juego
    initGame();
    setupButtons();

    // Ajustar scroll al cargar
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, 500);

    // Añadir animaciones CSS dinámicas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloatUp {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() * 100 - 50}px, -100px) scale(0); opacity: 0; }
        }
        
        @keyframes particleExplode {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); opacity: 0; }
        }
        
        @keyframes fireworkExplode {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0); opacity: 0; }
        }
        
        @keyframes starTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes bounceIn {
            0% { transform: translateY(-50px) rotate(-30deg); opacity: 0; }
            60% { transform: translateY(20px) rotate(10deg); opacity: 1; }
            80% { transform: translateY(-10px) rotate(-5deg); }
            100% { transform: translateY(0) rotate(0); }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});