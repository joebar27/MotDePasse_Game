// let listeMots = {};
// let motSecret = "";
// let TAILLE_MOT = 0;
// const NOMBRE_ESSAIS = 5;

// let ligneActuelle = 0;
// let indexLettre = 0;

// // -------------------------------
// // INITIALISATION
// // -------------------------------
// async function init() {

//     // Charge ton fichier JSON
//     const res = await fetch("Assets/Dictionnaires/dicoParTaille.json");
//     listeMots = await res.json();

//     // Choisir une longueur de mot (par exemple : 6)
//     TAILLE_MOT = 6;

//     // Sélection du mot secret
//     const motsValides = listeMots[TAILLE_MOT];
//     motSecret = motsValides[Math.floor(Math.random() * motsValides.length)].toUpperCase();

//     // Génère la grille
//     creerGrille();

//     console.log("Mot secret :", motSecret); // Pour tester
// }

// init();

// // -------------------------------
// // CREATION DE LA GRILLE
// // -------------------------------
// function creerGrille() {
//     const section = document.querySelector(".panel-mdp");
//     section.innerHTML = "";

//     for (let r = 0; r < NOMBRE_ESSAIS; r++) {
//         const row = document.createElement("div");
//         row.classList.add("row");
//         row.id = `row-${r}`;

//         for (let c = 0; c < TAILLE_MOT; c++) {
//             const cell = document.createElement("div");
//             cell.classList.add("case");
//             cell.innerHTML = `<p class="letter"></p>`;
//             row.appendChild(cell);
//         }
//         section.appendChild(row);
//     }
// }

// // -------------------------------
// // GESTION DU CLAVIER
// // -------------------------------
// document.querySelectorAll(".key").forEach(btn => {
//     const letter = btn.textContent.trim();
//     if (/^[A-Z]$/.test(letter)) {
//         btn.addEventListener("click", () => ajouterLettre(letter));
//     }
// });

// document.getElementById("key-btn-clear").addEventListener("click", effacerLettre);
// document.getElementById("key-btn-validate").addEventListener("click", validerMot);

// // -------------------------------
// // SAISIE DES LETTRES
// // -------------------------------
// function ajouterLettre(lettre) {
//     if (indexLettre >= TAILLE_MOT) return;

//     const cell = document.querySelector(`#row-${ligneActuelle} .case:nth-child(${indexLettre + 1}) .letter`);
//     cell.textContent = lettre;
//     indexLettre++;
// }

// function effacerLettre() {
//     if (indexLettre === 0) return;

//     indexLettre--;
//     const cell = document.querySelector(`#row-${ligneActuelle} .case:nth-child(${indexLettre + 1}) .letter`);
//     cell.textContent = "";
// }

// // -------------------------------
// // VALIDATION DU MOT
// // -------------------------------
// function validerMot() {
//     if (indexLettre < TAILLE_MOT) return;

//     const ligne = Array.from(document.querySelectorAll(`#row-${ligneActuelle} .letter`)).map(el => el.textContent).join("");

//     if (!listeMots[TAILLE_MOT].includes(ligne.toLowerCase())) {
//         alert("Mot inconnu !");
//         return;
//     }

//     colorerLigne(ligne);

//     if (ligne === motSecret) {
//         alert("Gagné !");
//         return;
//     }

//     ligneActuelle++;
//     indexLettre = 0;

//     if (ligneActuelle >= NOMBRE_ESSAIS) {
//         alert(`Perdu ! Le mot était : ${motSecret}`);
//     }
// }

// // -------------------------------
// // COLORATION DES CASES
// // -------------------------------
// function colorerLigne(motJoueur) {
//     const cases = document.querySelectorAll(`#row-${ligneActuelle} .case`);
//     const lettresRestantes = motSecret.split("");

//     // 1. Lettres bien placées
//     motJoueur.split("").forEach((lettre, i) => {
//         if (lettre === motSecret[i]) {
//             cases[i].classList.add("correct");
//             lettresRestantes[i] = null;
//         }
//     });

//     // 2. Lettres mal placées / absentes
//     motJoueur.split("").forEach((lettre, i) => {
//         if (cases[i].classList.contains("correct")) return;

//         if (lettresRestantes.includes(lettre)) {
//             cases[i].classList.add("present");
//             lettresRestantes[lettresRestantes.indexOf(lettre)] = null;
//         } else {
//             cases[i].classList.add("absent");
//         }
//     });
// }







// Revised version of script.js
const TAILLE_MOT = 5;
const NOMBRE_ESSAIS = 6;

let motSecret = "";
let ligneActuelle = 0;
let positionLettre = 0;
let listeMots = {};

function normaliser(texte) {
    return texte.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toUpperCase();
}

async function chargerMots() {
    const r = await fetch("Assets/Dictionnaires/dicoParTaille.json");
    listeMots = await r.json();

    const mots = listeMots[TAILLE_MOT];
    motSecret = mots[Math.floor(Math.random() * mots.length)].toUpperCase();

    console.log("Mot secret :", motSecret);
}

function creerGrille() {
    const section = document.querySelector(".panel-mdp");
    section.innerHTML = "";

    for (let r = 0; r < NOMBRE_ESSAIS; r++) {
        const row = document.createElement("div");
        row.classList.add("row");
        row.id = `row-${r}`;

        for (let c = 0; c < TAILLE_MOT; c++) {
            const cell = document.createElement("div");
            cell.classList.add("case");
            cell.innerHTML = `<p class="letter"></p>`;
            row.appendChild(cell);
        }

        section.appendChild(row);
    }
}

function ajouterLettre(l) {
    if (positionLettre >= TAILLE_MOT) return;

    const cellule = document.querySelector(
        `#row-${ligneActuelle} .case:nth-child(${positionLettre + 1}) .letter`
    );
    cellule.textContent = l.toUpperCase();
    positionLettre++;
}

function supprimerLettre() {
    if (positionLettre <= 0) return;
    positionLettre--;

    const cellule = document.querySelector(
        `#row-${ligneActuelle} .case:nth-child(${positionLettre + 1}) .letter`
    );
    cellule.textContent = "";
}

function shakeLigne() {
    const row = document.querySelector(`#row-${ligneActuelle}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 400);
}

function validerMot() {
    if (positionLettre < TAILLE_MOT) {
        shakeLigne();
        return;
    }

    const cases = document.querySelectorAll(`#row-${ligneActuelle} .letter`);
    const motJoueur = Array.from(cases).map(c => c.textContent).join("");

    const motNormalise = normaliser(motJoueur);
    const listeNormalisee = listeMots[TAILLE_MOT].map(m => normaliser(m));

    if (!listeNormalisee.includes(motNormalise)) {
        shakeLigne();
        return;
    }

    colorerLigne(motJoueur);

    if (normaliser(motJoueur) === normaliser(motSecret)) {
        setTimeout(() => alert("Bravo !"), 300);
        return;
    }

    ligneActuelle++;
    positionLettre = 0;

    if (ligneActuelle === NOMBRE_ESSAIS) {
        setTimeout(() => alert(`Perdu ! Le mot était : ${motSecret}`), 300);
    }
}

function colorerLigne(motJoueur) {
    const cases = document.querySelectorAll(`#row-${ligneActuelle} .case`);
    const lettresRestantes = motSecret.split("");

    // Correct (vert)
    for (let i = 0; i < TAILLE_MOT; i++) {
        if (normaliser(motJoueur[i]) === normaliser(motSecret[i])) {
            cases[i].classList.add("correct");
            lettresRestantes[i] = null;
        }
    }

    // Present / absent
    for (let i = 0; i < TAILLE_MOT; i++) {
        if (cases[i].classList.contains("correct")) continue;

        const index = lettresRestantes.findIndex(
            l => l && normaliser(l) === normaliser(motJoueur[i])
        );

        if (index !== -1) {
            cases[i].classList.add("present");
            lettresRestantes[index] = null;
        } else {
            cases[i].classList.add("absent");
        }
    }
}

function setupClavier() {
    document.querySelectorAll(".key").forEach(key => {
        key.addEventListener("click", () => {
            const val = key.dataset.key;

            if (val === "ENTER") validerMot();
            else if (val === "DEL") supprimerLettre();
            else ajouterLettre(val);
        });
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    await chargerMots();
    creerGrille();
    setupClavier();
});
