# Pizzeria Management Application

Une application de gestion de pizzas qui permet aux utilisateurs de gérer les pizzas et les produits associés. Cette application permet d'ajouter, de visualiser et de supprimer des pizzas tout en affichant les détails des produits associés.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [API](#api)
- [Contributions](#contributions)
- [License](#license)

## Fonctionnalités

- Affichage d'une liste de pizzas.
- Sélection de pizzas pour afficher les détails et les produits associés.
- Ajout de nouvelles pizzas avec des produits associés.
- Suppression de pizzas existantes.
- Communication en temps réel avec Socket.IO pour les notifications ou mises à jour.

## Technologies utilisées

- **Frontend**: Vue.js, Axios, HTML, CSS
- **Backend**: Node.js, Express, Socket.IO, MySQL
- **Outils de développement**: PhpStorm, Postman
- **Middleware**: CORS pour la gestion des requêtes entre différentes origines.

## Installation

1. **Clone le dépôt**:
   ```bash
   git clone <URL_DU_DEPOT>
   cd pizzeria

2. **Installer les dépendances du backend**:
   ```bash
    cd backend
   npm install
   ```
3. **Installer les dépendances du frontend**:
   ```bash
   cd frontend
   npm install
   ```
4. **Configurer la base de données**:

    - Créer une base de données MySQL.
    - Importer le fichier `pizzeria.sql` dans la base de données.
    - Configurer les informations de connexion à la base de données dans le fichier `config/db.config.js`.
5. **Démarrer le serveur**:
   ```bash
    cd backend
    node server.mjs
   ```
6. **Démarrer l'application frontend**:
   ```bash
    cd frontend
    npm run dev
   ```
## Utilisation
Ouvrir le navigateur et accéder à `http://localhost:<PORT>`.

## API
Présente dans le fichier `backend/server.mjs`.

## Contributions
Les contributions sont les bienvenues! Si tu souhaites contribuer, n'hésite pas à soumettre une pull request ou à ouvrir une issue.

## License
Ce projet est sous licence MIT.

### Instructions pour Personnaliser

- Remplace `<URL_DU_DEPOT>` par l'URL de ton dépôt Git.
- Si tu as un fichier SQL pour la configuration de la base de données, mentionne-le dans la section appropriée.
- Ajuste la section des API pour inclure d'autres routes que tu pourrais avoir ajoutées.

N'hésite pas à me faire savoir si tu as besoin d'autres modifications ou d'ajouts !
