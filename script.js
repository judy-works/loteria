// ===============================
// LOTERÍA — FULL EFFECTS + MP3 VERSION
// ===============================

// GLOBALS
let cards = [];
let shuffledCards = [];
let currentIndex = 0;
let autoplayInterval = null;
let autoplaySpeed = 7000;
let isPlaying = false;

const cardImg = document.getElementById("cardImg");
const cardContainer = document.getElementById("card");
const playPauseOverlay = document.getElementById("playPauseOverlay");

const resetBtn = document.getElementById("resetBtn");
const nextBtn = document.getElementById("nextBtn");
const historyBtn = document.getElementById("historyBtn");

const speedSelect = document.getElementById("speed");

const historyModal = document.getElementById("historyModal");
const closeHistory = document.getElementById("closeHistory");
const historyList = document.getElementById("historyList");

const timerBar = document.getElementById("timerBar");

let history = [];

// ===============================
// CARD DATA
// ===============================
cards = [
    { img: "01_el_gallo.jpg" }, { img: "02_el_diablito.jpg" }, { img: "03_la_dama.jpg" },
    { img: "04_el_catrin.jpg" }, { img: "05_el_paraguas.jpg" }, { img: "06_la_sirena.jpg" },
    { img: "07_la_escalera.jpg" }, { img: "08_la_botella.jpg" }, { img: "09_el_barril.jpg" },
    { img: "10_el_arbol.jpg" }, { img: "11_el_melon.jpg" }, { img: "12_el_valiente.jpg" },
    { img: "13_el_gorrito.jpg" }, { img: "14_la_muerte.jpg" }, { img: "15_la_pera.jpg" },
    { img: "16_la_bandera.jpg" }, { img: "17_el_bandolon.jpg" }, { img: "18_el_violoncello.jpg" },
    { img: "19_la_garza.jpg" }, { img: "20_el_pajaro.jpg" }, { img: "21_la_mano.jpg" },
    { img: "22_la_bota.jpg" }, { img: "23_la_luna.jpg" }, { img: "24_el_cotorro.jpg" },
    { img: "25_el_borracho.jpg" }, { img: "26_el_negrito.jpg" }, { img: "27_el_corazon.jpg" },
    { img: "28_la_sandia.jpg" }, { img: "29_el_tambor.jpg" }, { img: "30_el_camaron.jpg" },
    { img: "31_las_jaras.jpg" }, { img: "32_el_musico.jpg" }, { img: "33_la_arana.jpg" },
    { img: "34_el_soldado.jpg" }, { img: "35_la_estrella.jpg" }, { img: "36_el_cazo.jpg" },
    { img: "37_el_mundo.jpg" }, { img: "38_el_apache.jpg" }, { img: "39_el_nopal.jpg" },
    { img: "40_el_alacran.jpg" }, { img: "41_la_rosa.jpg" }, { img: "42_la_calavera.jpg" },
    { img: "43_la_campana.jpg" }, { img: "44_el_cantarito.jpg" }, { img: "45_el_venado.jpg" },
    { img: "46_el_sol.jpg" }, { img: "47_la_corona.jpg" }, { img: "48_la_chalupa.jpg" },
    { img: "49_el_pino.jpg" }, { img: "50_el_pescado.jpg" }, { img: "51_la_palma.jpg" },
    { img: "52_la_maceta.jpg" }, { img: "53_el_arpa.jpg" }, { img: "54_la_rana.jpg" }
];

// ===============================
// AUDIO HELPERS
// ===============================

function getCardAudio(card) {
    return `sounds/${card.img.replace(".jpg", ".mp3")}`;
}

function playCardAudio(card) {
    new Audio(getCardAudio(card)).play();
}

function playCorreYSeVa() {
    new Audio("sounds/corre_y_se_va.mp3").play();
}

function playSwoosh() {
    new Audio("sounds/swoosh.mp3").play();
}

function playShuffleSound() {
    new Audio("sounds/shuffle.mp3").play();
}

// ===============================
// VISUAL EFFECTS
// ===============================

// Card press-down animation
cardContainer.addEventListener("mousedown", () => {
    cardContainer.classList.add("pressed");
});
cardContainer.addEventListener("mouseup", () => {
    cardContainer.classList.remove("pressed");
});

// Glowing border during autoplay
function updateGlow() {
    if (isPlaying) cardContainer.classList.add("glow");
    else cardContainer.classList.remove("glow");
}

// Timer bar animation
function animateTimerBar() {
    timerBar.style.transition = "none";
    timerBar.style.width = "0%";

    setTimeout(() => {
        timerBar.style.transition = `width ${autoplaySpeed}ms linear`;
        timerBar.style.width = "100%";
    }, 50);
}

// ===============================
// SHUFFLE
// ===============================
function shuffleCards() {
    playShuffleSound();

    shuffledCards = [...cards];
    for (let i = shuffledCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
    }

    currentIndex = 0;
    history = [];
    historyList.innerHTML = "";
    cardImg.src = "images/00_leticias_loteria.jpg";
}

// ===============================
// SHOW NEXT CARD
// ===============================
function showNextCard() {
    if (currentIndex >= shuffledCards.length) {
        stopAutoplay();
        return;
    }

    const card = shuffledCards[currentIndex];

    playSwoosh();
    cardImg.src = `images/${card.img}`;
    playCardAudio(card);

    history.push(card.img);
    updateHistoryList();

    animateTimerBar();

    currentIndex++;
}

// ===============================
// AUTOPLAY
// ===============================
function startAutoplay() {
    if (isPlaying) return;

    isPlaying = true;
    playPauseOverlay.textContent = "⏸️";
    updateGlow();

    // FIRST CARD FIX — show immediately after ¡Corre y se va!
    if (currentIndex === 0) {
        playCorreYSeVa();

        setTimeout(() => {
            showNextCard();
        }, 1800); // smoother pause before first card
    }

    animateTimerBar();
    autoplayInterval = setInterval(showNextCard, autoplaySpeed);
}

function stopAutoplay() {
    isPlaying = false;
    playPauseOverlay.textContent = "▶️";
    updateGlow();

    clearInterval(autoplayInterval);
    autoplayInterval = null;

    timerBar.style.width = "0%";
}

// ===============================
// HISTORY
// ===============================
function updateHistoryList() {
    historyList.innerHTML = "";
    history.forEach(img => {
        const li = document.createElement("li");
        li.textContent = img.replace(".jpg", "");
        historyList.appendChild(li);
    });
}

// ===============================
// EVENTS
// ===============================

// Tap card = Play/Pause
cardContainer.addEventListener("click", () => {
    if (isPlaying) stopAutoplay();
    else startAutoplay();
});

// Manual next card
nextBtn.addEventListener("click", () => {
    stopAutoplay();
    showNextCard();
});

// Shuffle
resetBtn.addEventListener("click", () => {
    stopAutoplay();
    shuffleCards();
});

// History modal
historyBtn.addEventListener("click", () => {
    historyModal.style.display = "block";
});

closeHistory.addEventListener("click", () => {
    historyModal.style.display = "none";
});

// Speed select
speedSelect.addEventListener("change", () => {
    autoplaySpeed = Number(speedSelect.value);
    if (isPlaying) {
        stopAutoplay();
        startAutoplay();
    }
});

// ===============================
// INIT
// ===============================
shuffleCards();
stopAutoplay();

