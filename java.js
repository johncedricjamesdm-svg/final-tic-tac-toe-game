// Game Variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let musicEnabled = true;

// Array of Dares for losing players
const dares = [
    "Do 10 push-ups! 💪",
    "Sing your favorite song out loud! 🎤",
    "Do a funny dance! 💃",
    "Speak in an accent for 1 minute! 🎭",
    "Do 20 jumping jacks! 🦘",
    "Imitate an animal! 🐯",
    "Tell a joke to everyone! 😂",
    "Walk backwards for 30 seconds! 🚶",
    "Do a handstand (or try)! 🤸",
    "Say the alphabet backwards! 🔤",
    "Do frog jumps across the room! 🐸",
    "Yodel for 10 seconds! 🏔️",
    "Make a funny face for photos! 📸",
    "Speak like a robot! 🤖",
    "Do the worm! 🐛",
    "Say 5 compliments to the winner! 💝",
    "Hop on one foot for 20 seconds! 🦵",
    "Tickle yourself and laugh! 😆",
    "Make up a silly song! 🎵",
    "Pretend to be a chicken! 🐔",
    "Lick your elbow! 👅",
    "Run around the room making airplane noises! ✈️",
    "Do the moonwalk! 🌙"
];

// Winning Combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// DOM Elements
const homePage = document.getElementById('homePage');
const gamePage = document.getElementById('gamePage');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const homeBtn = document.getElementById('homeBtn');
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const winPopup = document.getElementById('winPopup');
const losePopup = document.getElementById('losePopup');
const drawPopup = document.getElementById('drawPopup');
const winMessage = document.getElementById('winMessage');
const loserMessage = document.getElementById('loserMessage');
const playAgainBtn = document.getElementById('playAgainBtn');
const playAgainLoseBtn = document.getElementById('playAgainLoseBtn');
const playAgainDrawBtn = document.getElementById('playAgainDrawBtn');
const homeFromWinBtn = document.getElementById('homeFromWinBtn');
const homeFromLoseBtn = document.getElementById('homeFromLoseBtn');
const homeFromDrawBtn = document.getElementById('homeFromDrawBtn');
const player1Input = document.getElementById('player1Name');
const player2Input = document.getElementById('player2Name');
const musicToggle = document.getElementById('musicToggle');
const dareText = document.getElementById('dareText');
const generateDareBtn = document.getElementById('generateDareBtn');

// Audio Context for sound effects
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Background Music Generator - More Enjoyable Version
class BackgroundMusic {
    constructor() {
        this.isPlaying = false;
        this.oscillators = [];
        this.gainNode = null;
    }

    play() {
        if (this.isPlaying) return;
        
        try {
            this.isPlaying = true;
            this.gainNode = audioContext.createGain();
            this.gainNode.connect(audioContext.destination);
            this.gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            
            this.playMelody();
        } catch (e) {
            console.log('Music error:', e);
        }
    }

    playMelody() {
        const now = audioContext.currentTime;
        // Upbeat melody inspired by popular game music
        const melody = [
            { freq: 523, dur: 0.2 }, // C5
            { freq: 587, dur: 0.2 }, // D5
            { freq: 659, dur: 0.2 }, // E5
            { freq: 784, dur: 0.4 }, // G5
            { freq: 698, dur: 0.2 }, // F5
            { freq: 659, dur: 0.2 }, // E5
            { freq: 587, dur: 0.2 }, // D5
            { freq: 523, dur: 0.4 }, // C5
            { freq: 587, dur: 0.2 }, // D5
            { freq: 659, dur: 0.2 }, // E5
            { freq: 784, dur: 0.2 }, // G5
            { freq: 880, dur: 0.4 }, // A5
            { freq: 784, dur: 0.2 }, // G5
            { freq: 659, dur: 0.2 }, // E5
            { freq: 587, dur: 0.4 }, // D5
            { freq: 523, dur: 0.4 }, // C5
        ];
        
        let time = now;
        let noteIndex = 0;
        
        const playNote = () => {
            if (!this.isPlaying) return;
            
            if (noteIndex >= melody.length) {
                // Loop the melody
                noteIndex = 0;
                setTimeout(playNote, 200);
                return;
            }
            
            const note = melody[noteIndex];
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.freq, audioContext.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, audioContext.currentTime);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.gainNode);
            
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + note.dur);
            
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + note.dur);
            
            this.oscillators.push(osc);
            
            // Schedule next note
            const nextDelay = note.dur * 1000;
            setTimeout(() => {
                noteIndex++;
                playNote();
            }, nextDelay);
        };
        
        playNote();
    }

    stop() {
        this.isPlaying = false;
        this.oscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {}
        });
        this.oscillators = [];
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, audioContext.currentTime);
            this.gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        }
    }
}

const backgroundMusic = new BackgroundMusic();

// Play sound effect
function playSound(type) {
    try {
        const now = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        if (type === 'move') {
            // Upbeat beep for move
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523, now);
            oscillator.frequency.exponentialRampToValueAtTime(659, now + 0.1);
            oscillator.start(now);
            oscillator.stop(now + 0.12);
        } else if (type === 'win') {
            // Triumphant win sound - chord progression
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, now);
            
            // Play ascending notes quickly
            oscillator.frequency.setValueAtTime(523, now);        // C
            oscillator.frequency.setValueAtTime(659, now + 0.1);  // E
            oscillator.frequency.setValueAtTime(784, now + 0.2);  // G
            oscillator.frequency.setValueAtTime(1047, now + 0.3); // High C
            
            oscillator.start(now);
            oscillator.stop(now + 0.5);
            
            // Add second oscillator for harmony
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.type = 'sine';
            osc2.connect(gain2);
            gain2.connect(gainNode);
            gain2.gain.setValueAtTime(0.1, now);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            
            osc2.frequency.setValueAtTime(392, now);        // G
            osc2.frequency.setValueAtTime(494, now + 0.1);  // B
            osc2.frequency.setValueAtTime(587, now + 0.2);  // D
            osc2.frequency.setValueAtTime(784, now + 0.3);  // G
            
            osc2.start(now);
            osc2.stop(now + 0.5);
        } else if (type === 'draw') {
            // Neutral draw sound
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.exponentialRampToValueAtTime(330, now + 0.3);
            oscillator.start(now);
            oscillator.stop(now + 0.3);
        } else if (type === 'lose') {
            // Epic "sad trombone" loss sound with meme vibes
            oscillator.type = 'sawtooth';
            gainNode.gain.setValueAtTime(0.4, now);
            
            // Sad descending sound
            oscillator.frequency.setValueAtTime(800, now);
            oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.8);
            
            oscillator.start(now);
            oscillator.stop(now + 0.8);
            
            // Add a "wah wah wah" effect with LFO
            const lfoOsc = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            lfoOsc.frequency.setValueAtTime(3, now); // LFO frequency
            lfoGain.gain.setValueAtTime(100, now);
            lfoGain.gain.exponentialRampToValueAtTime(10, now + 0.8);
            
            lfoOsc.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            
            lfoOsc.start(now);
            lfoOsc.stop(now + 0.8);
        }
    } catch (e) {
        console.log('Audio playback error:', e);
    }
}

// Classic "Sad Trombone" loss sound - Meme sound
function playLossSound() {
    try {
        const now = audioContext.currentTime;
        
        // Main sad trombone sound
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        oscillator1.type = 'sine';
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        
        gainNode1.gain.setValueAtTime(0.3, now);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        
        // Frequency slide from high to low - classic sad trombone
        oscillator1.frequency.setValueAtTime(600, now);
        oscillator1.frequency.exponentialRampToValueAtTime(150, now + 0.4);
        oscillator1.frequency.exponentialRampToValueAtTime(80, now + 0.8);
        oscillator1.frequency.exponentialRampToValueAtTime(40, now + 1.2);
        
        oscillator1.start(now);
        oscillator1.stop(now + 1.2);
        
        // Add a second oscillator for depth
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator2.type = 'triangle';
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        gainNode2.gain.setValueAtTime(0.15, now);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        
        oscillator2.frequency.setValueAtTime(400, now);
        oscillator2.frequency.exponentialRampToValueAtTime(100, now + 0.4);
        oscillator2.frequency.exponentialRampToValueAtTime(50, now + 0.8);
        oscillator2.frequency.exponentialRampToValueAtTime(25, now + 1.2);
        
        oscillator2.start(now);
        oscillator2.stop(now + 1.2);
        
    } catch (e) {
        console.log('Loss sound error:', e);
    }
}

// Get random dare
function getRandomDare() {
    return dares[Math.floor(Math.random() * dares.length)];
}

// Update current player display
function updatePlayerDisplay() {
    const playerName = currentPlayer === 'X' ? player1Name : player2Name;
    currentPlayerDisplay.textContent = `Current Player: ${playerName} (${currentPlayer})`;
}

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');
    
    if (gameBoard[index] !== '' || !gameActive) {
        return;
    }
    
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken', currentPlayer.toLowerCase());
    
    playSound('move');
    
    checkGameStatus();
}

// Check game status
function checkGameStatus() {
    let gameWon = false;
    
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] === '' || gameBoard[b] === '' || gameBoard[c] === '') {
            continue;
        }
        if (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c]) {
            gameWon = true;
            break;
        }
    }
    
    if (gameWon) {
        const winnerName = currentPlayer === 'X' ? player1Name : player2Name;
        const loserName = currentPlayer === 'X' ? player2Name : player1Name;
        
        winMessage.textContent = `${winnerName} (${currentPlayer}) Won! 🎊`;
        loserMessage.textContent = `${loserName}, you lost! Time for your dare!`;
        dareText.textContent = getRandomDare();
        
        playSound('win');
        
        // Play meme loss sound after a brief delay
        setTimeout(() => {
            playLossSound();
        }, 500);
        
        gameActive = false;
        
        setTimeout(() => {
            losePopup.classList.remove('hidden');
        }, 800);
        return;
    }
    
    if (!gameBoard.includes('')) {
        playSound('draw');
        gameActive = false;
        setTimeout(() => {
            drawPopup.classList.remove('hidden');
        }, 300);
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updatePlayerDisplay();
}

// Reset game
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    losePopup.classList.add('hidden');
    drawPopup.classList.add('hidden');
    winPopup.classList.add('hidden');
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o');
    });
    
    updatePlayerDisplay();
}

// Start game from home
function startGame() {
    player1Name = player1Input.value.trim() || 'Player 1';
    player2Name = player2Input.value.trim() || 'Player 2';
    
    homePage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    
    resetGame();
    updatePlayerDisplay();
    
    if (musicEnabled) {
        backgroundMusic.play();
    }
}

// Go back to home
function goHome() {
    gamePage.classList.add('hidden');
    losePopup.classList.add('hidden');
    drawPopup.classList.add('hidden');
    winPopup.classList.add('hidden');
    homePage.classList.remove('hidden');
    backgroundMusic.stop();
}

// Toggle music
function toggleMusic() {
    musicEnabled = !musicEnabled;
    
    if (musicEnabled) {
        musicToggle.textContent = '🔊 Music: ON';
        if (gamePage.classList.contains('hidden')) {
            // We're on home page, don't play music yet
        } else {
            backgroundMusic.play();
        }
    } else {
        musicToggle.textContent = '🔇 Music: OFF';
        backgroundMusic.stop();
    }
}

// Event Listeners
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
homeBtn.addEventListener('click', goHome);
playAgainBtn.addEventListener('click', resetGame);
playAgainLoseBtn.addEventListener('click', resetGame);
playAgainDrawBtn.addEventListener('click', resetGame);
homeFromWinBtn.addEventListener('click', goHome);
homeFromLoseBtn.addEventListener('click', goHome);
homeFromDrawBtn.addEventListener('click', goHome);
musicToggle.addEventListener('click', toggleMusic);
generateDareBtn.addEventListener('click', () => {
    dareText.textContent = getRandomDare();
});

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Allow Enter key to start game
player1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});

player2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
}); 

