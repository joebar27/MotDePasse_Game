const TAILLE_MOT = 6;
const NOMBRE_ESSAIS = 7;

let motSecret = "";
let ligneActuelle = 0;
let positionLettre = 0;
let listeMots = {};

function normaliser(texte) {
    return texte
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase();
}

function mettreEnSurbrillanceCurseur() {
    const ligne = document.querySelectorAll(`#row-${ligneActuelle} .case`);
    ligne.forEach((c, i) => c.classList.remove("focus"));

    ligne[positionLettre].classList.add("focus");
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

            // Permet de cliquer sur une case du mot en cours
            cell.addEventListener("click", () => {
                if (r === ligneActuelle) {
                    positionLettre = c;
                    mettreEnSurbrillanceCurseur();
                }
            });

            row.appendChild(cell);
        }

        section.appendChild(row);
    }
    mettreEnSurbrillanceCurseur();
}

function ajouterLettre(l) {
    if (positionLettre >= TAILLE_MOT) return;
    console.log("Ajout de la lettre pos :", positionLettre);
    const cellule = document.querySelector(
        `#row-${ligneActuelle} .case:nth-child(${positionLettre + 1}) .letter`
    );
    cellule.textContent = l.toUpperCase();
    positionLettre++;
    if (positionLettre < TAILLE_MOT) mettreEnSurbrillanceCurseur();
}

function supprimerLettre() {
    console.log("Suppression de la lettre pos :", positionLettre);
    const cellule = document.querySelector(`#row-${ligneActuelle} .case:nth-child(${positionLettre + 1}) .letter`);
    
    if (positionLettre <= 0) {
        cellule.textContent = ""; 
        return;
    }

    console.log(cellule.textContent);

    if (cellule.textContent === "") {
            positionLettre--;
            cellule.textContent = "";
        }
        else{
            cellule.textContent = "";
    }
    mettreEnSurbrillanceCurseur();
}

function shakeLigne() {
    const row = document.querySelector(`#row-${ligneActuelle}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 400);
}

function validerMot() {
    console.log("Validation du mot");
    console.log("Position lettre :", positionLettre);
    console.log("Taille_mot :", TAILLE_MOT);

    if (positionLettre < TAILLE_MOT) {
        console.log("Mot incomplet");
        shakeLigne();
        return;
    }

    const cases = document.querySelectorAll(`#row-${ligneActuelle} .letter`);
    const motJoueur = Array.from(cases)
        .map((c) => c.textContent)
        .join("");

    const motNormalise = normaliser(motJoueur);
    const listeNormalisee = listeMots[TAILLE_MOT].map((m) => normaliser(m));

    console.log("Mot joueur :", normaliser(motJoueur));
    console.log("Mot secret :", normaliser(motSecret));

    if (!listeNormalisee.includes(motNormalise)) {
        shakeLigne();
        return;
    }

    colorerLigne(motJoueur);

    if (normaliser(motJoueur) === normaliser(motSecret)) {
        setTimeout(() => alert("Bravo !"), 1000);
        return;
    }

    ligneActuelle++;
    positionLettre = 0;
    mettreEnSurbrillanceCurseur();

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
            (l) => l && normaliser(l) === normaliser(motJoueur[i])
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
    document.querySelectorAll(".key").forEach((key) => {
        key.addEventListener("click", () => {
            const val = key.dataset.key;
            console.log("Touche appuyée :", val);
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
