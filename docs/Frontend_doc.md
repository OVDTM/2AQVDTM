# Documentation Frontend

## Stack Technique

* **[React.js](https://reactjs.org/)** : Pour faire des composants réutilisables et gérer des états.
* **[Material-UI (MUI)](https://mui.com/)** : Librairie de composants pour un design moderne et cohérent. Permet de gagner du temps pour certains composants.
* **CSS "Vanilla"** : Découpé par composant (`alerts.css`, `navbar.css`, `parcelcard.css`). Pas de préprocesseur, on garde les choses simples et directes.
* **Fetch API** : Requêtes natives. Pas de surcouche lourde.

## Choix de Design & UX

* **Philosophie [Material Design 3](https://m3.material.io/)** : Des guidelines de design créés par Google. Des interfaces aérées, des `BorderRadius` généreux et des ombres douces. L'objectif est d'avoir une interface qui fait "logiciel sérieux" sans ressembler à un tableau Excel.
* **Couleurs Material** : Palette de couleurs inspirée de Material Design générée avec une seed en vert via [Material Theme Builder](https://m3.material.io/theme-builder).
* **Composants Isolés** : Une architecture modulaire (`AlertChart`, `Weather`, `ParcelCard`). Si le widget météo décide de planter, il n'entraîne pas toute la carte des parcelles avec lui dans sa chute.

## Structure du Projet (TL;DR)

* `/src/Components/` : Le dossier qui contient tous les composants React.
* `/src/css/` : Fichiers CSS pour les styles de chaque composant.
* `/src/data/` : Fichiers CSV pour les tests.
* `/src/icons/svg/` : Certaines icônes vectorielles pour les icones de la navbar.