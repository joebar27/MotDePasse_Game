let tailleMot = 5; // Modifier cette valeur pour changer la taille du mot à deviner (entre 5 et 6)
let nombreEssais = 6; // Modifier cette valeur pour changer le nombre d'essais (entre 5 et 7)
let triche = false; // Mettre à true pour afficher le mot secret dans la console
let motSecret = "";
let ligneActuelle = 0;
let positionLettre = 0;
let listeMots = {};

function menuBurger() {
    // Affiche ou cache le menu burger
    const burgerInput = document.getElementById("burgerInput");
    const burgerLabel = document.getElementById("burger");
    const menu = document.getElementById("menu");
    // Ouvrir / fermer via le burger
    burgerInput.addEventListener("change", () => {
        menu.style.display = burgerInput.checked ? "block" : "none";
    });
    // Fermer si clic à l'extérieur
    document.addEventListener("mousedown", (e) => {
        // Si le clic vient du LABEL → NE PAS fermer !
        if (burgerLabel.contains(e.target)) {
            return; // on laisse le change() faire son travail
        }
        // Si le menu est ouvert
        if (burgerInput.checked) {
            // Si le clic est NI dans le menu NI dans le label
            if (!menu.contains(e.target)) {
                burgerInput.checked = false;
                menu.style.display = "none";
            }
        }
    });
    // Gère les options du menu
    const lettersSelect = document.getElementById("letters");
    const attemptsSelect = document.getElementById("essais");
    //! Nombre de lettres
    lettersSelect.addEventListener("change", () => {
        console.log("Nombre de lettres :", lettersSelect.value);
        tailleMot = parseInt(lettersSelect.value);
        nombreEssais = parseInt(attemptsSelect.value);
        ligneActuelle = 0;
        positionLettre = 0;
        gameInit();
    });
    //! Nombre d'essais
    attemptsSelect.addEventListener("change", () => {
        console.log("Nombre d'essais :", attemptsSelect.value);
        nombreEssais = parseInt(attemptsSelect.value);
        tailleMot = parseInt(lettersSelect.value);
        ligneActuelle = 0;
        positionLettre = 0;
        gameInit();
    });
    //! Mode triche
    const cheatToggle = document.getElementById("cheat");
    cheatToggle.addEventListener("change", () => {
        console.log(
            "Mode triche",
            cheatToggle.checked
                ? `Activé \nMot secret : ${motSecret}`
                : "Désactivé"
        );
        triche = cheatToggle.checked;
    });
}

function gameInit() {
    chargerMots();
    creerGrille();
    setupClavier();
}

function normaliser(texte) {
    return texte
        .normalize("NFD") // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .toUpperCase(); // Met en majuscules
}

function mettreEnSurbrillanceCurseur() {
    const ligne = document.querySelectorAll(`#row-${ligneActuelle} .case`);
    ligne.forEach((c, i) => c.classList.remove("focus"));
    if (positionLettre < tailleMot) {
        ligne[positionLettre].classList.add("focus");
    }
}

async function chargerMots() {
    const r = await fetch(
        "Assets/Dictionnaires/mots_filtrés_sans_doublons.json"
    );
    listeMots = await r.json();
    const mots = listeMots[`${tailleMot}_lettres`];
    motSecret = mots[Math.floor(Math.random() * mots.length)].toUpperCase();

    if (triche) {
        console.log("Mot secret :", motSecret);
    }
}

function creerGrille() {
    const section = document.querySelector(".panel-mdp");
    section.innerHTML = "";

    for (let r = 0; r < nombreEssais; r++) {
        // Crée une ligne pour chaque essai
        const row = document.createElement("div");
        row.classList.add("row");
        row.id = `row-${r}`;
        // Crée les cases pour chaque lettre dans la ligne
        for (let c = 0; c < tailleMot; c++) {
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
    // Empêche d'ajouter des lettres si la ligne est complète
    if (positionLettre === tailleMot) return;
    // Récupère la cellule correspondante à la position actuelle
    const cellule = document.querySelector(
        `#row-${ligneActuelle} .case:nth-child(${positionLettre + 1}) .letter`
    );
    // Met à jour le contenu de la cellule avec la lettre ajoutée
    cellule.textContent = l.toUpperCase();
    if (positionLettre <= tailleMot - 1) {
        positionLettre++;
    }
    // Met en surbrillance la nouvelle position du curseur
    if (positionLettre < tailleMot) mettreEnSurbrillanceCurseur();
}

function supprimerLettre() {
    // Récupère la cellule correspondante à la position actuelle
    let cellule = document.querySelector(
        `#row-${ligneActuelle} .case:nth-child(${positionLettre + 1}) .letter`
    );
    // Si aucune cellule n'est trouvée, on verifie si on est a la derniere lettre sinon on sort de la fonction
    if (!cellule) {
        if (positionLettre === tailleMot) {
            positionLettre--;
            cellule = document.querySelector(
                `#row-${ligneActuelle} .case:nth-child(${
                    positionLettre + 1
                }) .letter`
            );
            cellule.textContent = "";
            mettreEnSurbrillanceCurseur();
        } else {
            console.log(
                "Aucune cellule trouvée pour la suppression à la position :",
                positionLettre
            );
        }
        return;
    }
    // Si on est à la première position, on efface simplement la lettre si elle existe
    if (positionLettre === 0) {
        // Empêche de supprimer des lettres si tout est déjà supprimé
        if (cellule.textContent === "" || cellule.textContent === null) {
            return;
        } else {
            cellule.textContent = "";
        }
    }
    // Supprime la lettre à la position actuelle ou recule d'une position si la cellule est vide
    if (positionLettre !== 0) {
        if (cellule.textContent === "" || positionLettre === tailleMot) {
            positionLettre--;
            cellule = document.querySelector(
                `#row-${ligneActuelle} .case:nth-child(${
                    positionLettre + 1
                }) .letter`
            );
            cellule.textContent = "";
        } else {
            cellule.textContent = "";
            positionLettre--;
        }
        mettreEnSurbrillanceCurseur();
    }
}

function shakeLigne() {
    const row = document.querySelector(`#row-${ligneActuelle}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 400);
}

function validerMot() {
    const cases = document.querySelectorAll(`#row-${ligneActuelle} .letter`);
    const motJoueur = Array.from(cases)
        .map((c) => c.textContent)
        .join("");
    // Vérifie si le mot est complet
    if (motJoueur.length < tailleMot) {
        console.log("Mot incomplet", motJoueur);
        shakeLigne();
        return;
    }
    // Vérifie si le mot est dans la liste des mots valides
    const motNormalise = normaliser(motJoueur);
    const listeNormalisee = listeMots[`${tailleMot}_lettres`].map((m) =>
        normaliser(m)
    );
    // Si le mot n'est pas valide, secoue la ligne
    if (!listeNormalisee.includes(motNormalise)) {
        console.log("Mot non valide", motJoueur);
        shakeLigne();
        return;
    }
    // Colorie la ligne en fonction de la validité des lettres
    colorerLigne(motJoueur);
    // Vérifie si le mot est correct
    if (normaliser(motJoueur) === normaliser(motSecret)) {
        setTimeout(() => alert("Bravo !"), 1000);
        return;
    }
    mettreEnSurbrillanceCurseur();
    ligneActuelle++;
    positionLettre = 0;
    mettreEnSurbrillanceCurseur();
    // Vérifie si le joueur a épuisé tous ses essais
    if (ligneActuelle === nombreEssais) {
        setTimeout(() => alert(`Perdu ! Le mot était : ${motSecret}`), 300);
    }
}

function colorerLigne(motJoueur) {
    const cases = document.querySelectorAll(`#row-${ligneActuelle} .case`);
    const lettresRestantes = motSecret.split("");

    // Correct (vert)
    for (let i = 0; i < tailleMot; i++) {
        if (normaliser(motJoueur[i]) === normaliser(motSecret[i])) {
            cases[i].classList.add("correct");
            lettresRestantes[i] = null;
        }
    }

    // Present / absent
    for (let i = 0; i < tailleMot; i++) {
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
    // document.querySelectorAll(".key").forEach((key) => {
    //     key.addEventListener("click", () => {
    //         const val = key.dataset.key;
    //         if (val === "ENTER") validerMot();
    //         else if (val === "DEL") supprimerLettre(positionLettre);
    //         else ajouterLettre(val);
    //     });
    // });
    document.querySelectorAll(".key").forEach((key) => {
        
        // 1️⃣ Retirer les anciens listeners (méthode simple : remplacer le bouton par son clone)
        const newKey = key.cloneNode(true);
        key.parentNode.replaceChild(newKey, key);

        // 2️⃣ Ajouter UN SEUL listener
        newKey.addEventListener("click", () => {
            const val = newKey.dataset.key;
            if (val === "ENTER") validerMot();
            else if (val === "DEL") supprimerLettre(positionLettre);
            else ajouterLettre(val);
        });
    });
}

window.addEventListener("DOMContentLoaded", async () => {
    await chargerMots();
    creerGrille();
    setupClavier();
    menuBurger();
});
