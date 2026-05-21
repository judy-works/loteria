/* -------------------------------------------
   SELECT BEST FEMALE SPANISH VOICE
------------------------------------------- */
let selectedVoice = null;

function loadBestVoice() {
    const voices = speechSynthesis.getVoices();

    // Prefer lively female Mexican/LatAm voices
    const preferred = voices.find(v =>
        v.lang.startsWith("es") &&
        /mex|lat|google|sabina|female|mujer/i.test(v.name)
    );

    selectedVoice =
        preferred ||
        voices.find(v => v.lang.startsWith("es")) ||
        null;
}

speechSynthesis.onvoiceschanged = loadBestVoice;
loadBestVoice();

/* -------------------------------------------
   LOTERÍA GAME LOGIC
------------------------------------------- */

const cards = [
    { name: "El Gallo", img: "01_el_gallo.jpg" },
    { name: "El Diablito", img: "02_el_diablito.jpg" },
    { name: "La Dama", img: "03_la_dama.jpg" },
    { name: "El Catrín", img: "04_el_catrin.jpg" },
    { name: "El Paraguas", img: "05_el_paraguas.jpg" },
    { name: "La Sirena", img: "06_la_sirena.jpg" },
    { name: "La Escalera", img: "07_la_escalera.jpg" },
    { name: "La Botella", img: "08_la_botella.jpg" },
    { name: "El Barril", img: "09_el_barril.jpg" },
    { name: "El Árbol", img: "10_el_arbol.jpg" },
    { name: "El Melón", img: "11_el_melon.jpg" },
    { name: "El Valiente", img: "12_el_valiente.jpg" },
    { name: "El Gorrito", img: "13_el_gorrito.jpg" },
    { name: "La Muerte", img: "14_la_muerte.jpg" },
    { name: "La Pera", img: "15_la_pera.jpg" },
    { name: "La Bandera", img: "16_la_bandera.jpg" },
    { name: "El Bandolón", img: "17_el_bandolon.jpg" },
    { name: "El Violoncello", img: "18_el_violoncello.jpg" },
    { name: "La Garza", img: "19_la_garza.jpg" },
    { name: "El Pájaro", img: "20_el_pajaro.jpg" },
    { name: "La Mano", img: "21_la_mano.jpg" },
    { name: "La Bota", img: "22_la_bota.jpg" },
    { name: "La Luna", img: "23_la_luna.jpg" },
    { name: "El Cotorro", img: "24_el_cotorro.jpg" },
    { name: "El Borracho", img: "25_el_borracho.jpg" },
    { name: "El Negrito", img: "26_el_negrito.jpg" },
    { name: "El Corazón", img: "27_el_corazon.jpg" },
    { name: "La Sandía", img: "28_la_sandia.jpg" },
    { name: "El Tambor", img: "29_el_tambor.jpg" },
    { name: "El Camarón", img: "30_el_camaron.jpg" },
    { name: "Las Jaras", img: "31_las_jaras.jpg" },
    { name: "El Músico", img: "32_el_musico.jpg" },
    { name: "La Araña", img: "33_la_araña.jpg" },
    { name: "El Soldado", img: "34_el_soldado.jpg" },
    { name: "La Estrella", img: "35_la_estrella.jpg" },
    { name: "El Cazo", img: "36_el_cazo.jpg" },
    { name: "El Mundo", img: "37_el_mundo.jpg" },
    { name: "El Apache", img: "38_el_apache.jpg" },
    { name: "El Nopal", img: "39_el_nopal.jpg" },
    { name: "El Alacrán", img: "40_el_alacran.jpg" },
    { name: "La Rosa", img: "41_la_rosa.jpg" },
    { name: "La Calavera", img: "42_la_calavera.jpg" },
    { name: "La Campana", img: "43_la_campana.jpg" },
    { name: "El Cantarito", img: "44_el_cantarito.jpg" },
    { name: "El Venado", img: "45_el_venado.jpg" },
    { name: "El Sol", img: "46_el_sol.jpg" },
    { name: "La Corona", img: "47_la_corona.jpg" },
    { name: "La Chalupa", img: "48_la_chalupa.jpg" },
    { name: "El Pino", img: "49_el_pino.jpg" },
    { name: "El Pescado", img: "50_el_pescado.jpg" },
    { name: "La Palma", img: "51_la_palma.jpg" },
    { name: "La Maceta", img: "52_la_maceta.jpg" },
    { name: "El Arpa", img: "53_el_arpa.jpg" },
    { name: "La Rana", img: "54_la_rana.jpg" }
];

let deck = [];
let lastCard = null;
let autoPlayInterval = null;
let history = [];

let isAutoPlaying = false;
let hasPlayedPhraseThisGame = false;

/* SOUND EFFECTS */
function playSwoosh() {
    const audio = new Audio("sounds/swoosh.mp3");
    audio.volume = 0.6;
    audio.play();
}

function playShuffle() {
    const audio = new Audio("sounds/shuffle.mp3");
    audio.volume = 0.7;
    audio.play();
}

/* LIVELY FEMALE VOICE */
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "es-MX";
    msg.pitch = 1.15;
    msg.rate = 0.97;
    msg.volume = 1.0;

    if (selectedVoice) msg.voice = selectedVoice;

    speechSynthesis.speak(msg);
}

function sayCorreYSeVa(callback) {
    const msg = new SpeechSynthesisUtterance("¡Corre y se va!");
    msg.lang = "es-MX";
    msg.pitch = 1.2;
    msg.rate = 0.95;
    msg.volume = 1.0;

    if (selectedVoice) msg.voice = selectedVoice;

    msg.onend = () => setTimeout(callback, 600);
    speechSynthesis.speak(msg);
}

/* PROGRESS BAR */
function startProgressBar(speed) {
    const bar = document.getElementById("timerBar");
    bar.style.transition = "none";
    bar.style.width = "0%";
    void bar.offsetWidth;
    bar.style.transition = `width ${speed}ms linear`;
    bar.style.width = "100%";
}

/* FLIP ANIMATION */
function flipCard() {
    const card = document.getElementById("card");
    card.classList.remove("flip");
    void card.offsetWidth;
    card.classList.add("flip");
}

/* SHOW STARTING CARD */
function showStartCard() {
    document.getElementById("cardImg").src = "images/00_leticias_loteria.jpg";
}

/* SHUFFLE DECK */
function shuffleDeck() {
    deck = [...cards].sort(() => Math.random() - 0.5);
    history = [];
    hasPlayedPhraseThisGame = false;
}

/* NEXT CARD */
function nextCard() {
    if (deck.length === 0) shuffleDeck();

    const speed = parseInt(document.getElementById("speed").value);
    startProgressBar(speed);

    flipCard();
    playSwoosh();

    lastCard = deck.pop();
    history.push(lastCard.name);

    document.getElementById("cardImg").src = "images/" + lastCard.img;

    speak(lastCard.name);
}

/* OVERLAY POP */
function setOverlay(icon) {
    const overlay = document.getElementById("playPauseOverlay");
    overlay.textContent = icon;
    overlay.classList.add("overlay-pop");
    setTimeout(() => overlay.classList.remove("overlay-pop"), 200);
}

/* AUTOPLAY */
function startAutoPlay() {
    const speed = parseInt(document.getElementById("speed").value);

    if (!hasPlayedPhraseThisGame) {
        hasPlayedPhraseThisGame = true;
        sayCorreYSeVa(() => {
            nextCard();
            autoPlayInterval = setInterval(nextCard, speed);
        });
    } else {
        nextCard();
        autoPlayInterval = setInterval(nextCard, speed);
    }

    isAutoPlaying = true;
    setOverlay("⏸️");
    document.getElementById("card").classList.add("glow");
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    isAutoPlaying = false;

    speechSynthesis.cancel();

    const bar = document.getElementById("timerBar");
    bar.style.transition = "none";
    bar.style.width = "0%";

    setOverlay("▶️");
    document.getElementById("card").classList.remove("glow");
}

/* CARD CLICK */
document.addEventListener("DOMContentLoaded", () => {
    const card = document.getElementById("card");

    card.addEventListener("click", () => {
        if (navigator.vibrate) navigator.vibrate(30);

        card.classList.add("pop");
        setTimeout(() => card.classList.remove("pop"), 180);

        if (isAutoPlaying) stopAutoPlay();
        else startAutoPlay();
    });

    /* BARAJAR */
    document.getElementById("resetBtn").onclick = () => {
        stopAutoPlay();
        shuffleDeck();
        playShuffle();
        showStartCard();
        card.classList.remove("glow");

        card.classList.add("shuffle-anim");
        setTimeout(() => card.classList.remove("shuffle-anim"), 450);
    };

    /* NEXT */
    document.getElementById("nextBtn").onclick = nextCard;

    /* HISTORY */
    document.getElementById("historyBtn").onclick = () => {
        const list = document.getElementById("historyList");
        list.innerHTML = "";
        history.forEach(cardName => {
            const li = document.createElement("li");
            li.textContent = cardName;
            list.appendChild(li);
        });
        document.getElementById("historyModal").style.display = "block";
    };

    document.getElementById("closeHistory").onclick = () =>
        document.getElementById("historyModal").style.display = "none";

    /* INITIAL LOAD */
    shuffleDeck();
    showStartCard();
    setOverlay("▶️");
});

