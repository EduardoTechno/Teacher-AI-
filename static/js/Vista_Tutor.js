document.addEventListener('DOMContentLoaded', function() {
   // Elementos del DOM
   const audioPlayer = document.getElementById('audioPlayer');
   const numberAudioPlayer = document.getElementById('numberAudioPlayer');
   const avatarContainer = document.getElementById('avatarContainer');
   const avatarImage = document.getElementById('avatarImage');
   const avatarVideo = document.getElementById('avatarVideo');
   const btnReplay = document.getElementById('btnReplay');
   const btnNext = document.getElementById('btnNext');

   // Añade esto al inicio de tu archivo JS, después del DOMContentLoaded

    // Variables globales adicionales
    let score = 0;
    let currentNumber = null;
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].sort(() => Math.random() - 0.5);
    const gameArea = document.getElementById('gameArea');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const scoreDisplay = document.getElementById('score');
    const teacherCharacter = document.getElementById('teacherCharacter');

    // Efectos especiales
    function createConfetti(x, y) {
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${x + Math.random() * 40 - 20}px`;
            confetti.style.top = `${y}px`;
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
            document.body.appendChild(confetti);
            
            // Eliminar después de la animación
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    function createExplosion(x, y) {
        for (let i = 0; i < 15; i++) {
            const explosion = document.createElement('div');
            explosion.className = 'explosion';
            explosion.style.left = `${x + Math.random() * 40 - 20}px`;
            explosion.style.top = `${y + Math.random() * 40 - 20}px`;
            explosion.style.backgroundColor = `hsl(${Math.random() * 30 + 10}, 100%, 50%)`;
            explosion.style.animationDuration = `${Math.random() * 0.5 + 0.3}s`;
            document.body.appendChild(explosion);
            
            // Eliminar después de la animación
            setTimeout(() => explosion.remove(), 500);
        }
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

    // Modificar la función checkAnswer para incluir efectos
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
            createConfetti(x, y);
            animateCharacter('jump');
            
            // Sonido de éxito
            const successSound = new Audio('/static/Matematicas/audio/success.mp3');
            successSound.play().catch(e => console.error("Error al reproducir sonido:", e));
        } else {
            // Respuesta incorrecta
            showFeedback('Intenta de nuevo', 'incorrect');
            card.classList.add('incorrect');
            createExplosion(x, y);
            animateCharacter('shake');
            
            // Sonido de error
            const errorSound = new Audio('/static/Matematicas/audio/error.mp3');
            errorSound.play().catch(e => console.error("Error al reproducir sonido:", e));
        }

        setTimeout(() => {
            resetCards();
            playNextNumber();
        }, 1500);
    }

    // Modificar la función endGame para hacerla más especial
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
            for (let i = 0; i < 100; i++) {
                setTimeout(() => {
                    createConfetti(
                        Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight / 2
                    );
                }, i * 50);
            }
            
            // Sonido de victoria
            const victorySound = new Audio('/static/Matematicas/audio/victory.mp3');
            victorySound.play().catch(e => console.error("Error al reproducir sonido:", e));
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

    // Añadir esto a la función setupButtons
    btnReplay.addEventListener('click', function() {
        numberAudioPlayer.currentTime = 0;
        numberAudioPlayer.play();
        animateCharacter('nod');
    });

    btnNext.addEventListener('click', function() {
        if (numbers.length > 0) {
            resetCards();
            playNextNumber();
            animateCharacter('spin');
        }
    });
   // Configuración inicial del avatar
   function setupAvatar() {
       // Asegurar que el video esté preparado
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

       // Debug: Verificar que los elementos existen
       console.log("Elementos del avatar:", {
           avatarContainer,
           avatarImage,
           avatarVideo,
           audioPlayer,
           numberAudioPlayer
       });
   }

   // Animación y comportamiento de botones
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

       // Debug: Verificar botones
       console.log("Botones encontrados:", {
           btnReplay,
           btnNext
       });
   }

   // Inicializar
   setupAvatar();
   setupButtons();

    // Inicializar el juego
    initGame();

    // Función para inicializar el juego
    function initGame() {
        score = 0;
        updateScore();
        createNumberCards();
        setupAvatar();
        playNextNumber();
    }

    // Configurar el comportamiento del avatar
    function setupAvatar() {
        avatarVideo.muted = true;
        avatarVideo.currentTime = 0;

        // Controlar visibilidad del avatar según el audio
        function toggleAvatar(showVideo) {
            avatarImage.style.opacity = showVideo ? '0' : '1';
            avatarVideo.style.opacity = showVideo ? '1' : '0';
            
            if (showVideo) {
                avatarVideo.play().catch(e => console.error("Error al reproducir video:", e));
            } else {
                avatarVideo.pause();
            }
        }

        // Configurar eventos para ambos reproductores de audio
        [audioPlayer, numberAudioPlayer].forEach(audio => {
            audio.addEventListener('play', () => toggleAvatar(true));
            audio.addEventListener('ended', () => toggleAvatar(false));
            audio.addEventListener('pause', () => toggleAvatar(false));
        });
    }

    // Crear las tarjetas de números
    function createNumberCards() {
        gameArea.innerHTML = '';
        numbers.forEach(number => {
            const card = document.createElement('div');
            card.className = 'number-card';
            card.textContent = number;
            card.dataset.number = number;
            card.addEventListener('click', () => checkAnswer(number));
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
    }

    // Reproducir audio del número
    function playNumberAudio(number) {
        numberAudioPlayer.src = `/static/Matematicas/audio/numbers/${number}.mp3`;
        numberAudioPlayer.play().catch(e => console.error("Error al reproducir audio:", e));
    }

    // Verificar respuesta
    function checkAnswer(selectedNumber) {
        if (selectedNumber === currentNumber) {
            // Respuesta correcta
            score++;
            updateScore();
            showFeedback('¡Correcto!', 'correct');
            document.querySelector(`.number-card[data-number="${selectedNumber}"]`).classList.add('correct');
        } else {
            // Respuesta incorrecta
            showFeedback('Intenta de nuevo', 'incorrect');
            document.querySelector(`.number-card[data-number="${selectedNumber}"]`).classList.add('incorrect');
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
    }

    // Actualizar puntuación
    function updateScore() {
        scoreDisplay.textContent = score;
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
        showFeedback(`¡Juego terminado! Puntuación: ${score}/10`, score === 10 ? 'correct' : 'incorrect');
        
        // Deshabilitar tarjetas
        document.querySelectorAll('.number-card').forEach(card => {
            card.style.pointerEvents = 'none';
        });
    }

    // Event listeners para botones
    btnReplay.addEventListener('click', function() {
        numberAudioPlayer.currentTime = 0;
        numberAudioPlayer.play();
    });

    btnNext.addEventListener('click', function() {
        if (numbers.length > 0) {
            resetCards();
            playNextNumber();
        }
    });

    // Ajustar scroll al cargar
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, 500);
});

// Polyfill para scrollIntoViewIfNeeded
if (!HTMLElement.prototype.scrollIntoViewIfNeeded) {
    HTMLElement.prototype.scrollIntoViewIfNeeded = function(centerIfNeeded) {
        centerIfNeeded = arguments.length === 0 ? true : !!centerIfNeeded;
        
        var parent = this.parentNode,
            parentComputedStyle = window.getComputedStyle(parent, null),
            parentBorderTopWidth = parseInt(parentComputedStyle.getPropertyValue('border-top-width')),
            parentBorderLeftWidth = parseInt(parentComputedStyle.getPropertyValue('border-left-width')),
            overTop = this.offsetTop - parent.offsetTop < parent.scrollTop,
            overBottom = (this.offsetTop - parent.offsetTop + this.clientHeight - parentBorderTopWidth) > (parent.scrollTop + parent.clientHeight),
            overLeft = this.offsetLeft - parent.offsetLeft < parent.scrollLeft,
            overRight = (this.offsetLeft - parent.offsetLeft + this.clientWidth - parentBorderLeftWidth) > (parent.scrollLeft + parent.clientWidth),
            alignWithTop = overTop && !overBottom;
        
        if ((overTop || overBottom) && centerIfNeeded) {
            parent.scrollTop = this.offsetTop - parent.offsetTop - parent.clientHeight / 2 - parentBorderTopWidth + this.clientHeight / 2;
        }
        
        if ((overLeft || overRight) && centerIfNeeded) {
            parent.scrollLeft = this.offsetLeft - parent.offsetLeft - parent.clientWidth / 2 - parentBorderLeftWidth + this.clientWidth / 2;
        }
        
        if ((overTop || overBottom || overLeft || overRight) && !centerIfNeeded) {
            this.scrollIntoView(alignWithTop);
        }
    };
}