# Projet Atlas – GenAI

Ce repository contient un projet web complet, composé d’un backend (API REST construite sur Fastify & Prisma) et d’un frontend (React + Vite). Il inclut également des workflows GitHub pour l’intégration et le déploiement continus, ainsi qu’une configuration pour Docker. Le but est de proposer un socle fonctionnel pour développer des applications web, avec une séparation claire entre le front et le back, et un outillage complet (tests, scripts d’init, linting, etc.).

## Table des matières

1. [Aperçu du projet](#aperçu-du-projet)  
2. [Arborescence générale](#arborescence-générale)  
3. [Prérequis](#prérequis)  
4. [Installation et configuration](#installation-et-configuration)
   - [Configuration des variables d’environnement](#configuration-des-variables-denvironnement)
5. [Lancer le projet](#lancer-le-projet)
   - [Lancer le backend](#lancer-le-backend)
   - [Lancer le frontend](#lancer-le-frontend)
   - [Utiliser Docker](#utiliser-docker)
6. [Scripts utiles](#scripts-utiles)
7. [CI/CD – GitHub Workflows](#cicd--github-workflows)
8. [Contribuer](#contribuer)
9. [Licence](#licence)

---

## 1. Aperçu du projet

- **Backend** :  
  - Basé sur [Fastify](https://www.fastify.io/) et [Prisma](https://www.prisma.io/) (avec PostgreSQL).  
  - Gère l’authentification JWT, la pagination, la configuration de CORS/Helmet, un système de gestion d’erreurs centralisé et la documentation Swagger intégrée.  
  - Déploiement possible via Docker et Docker Compose, ou [Serverless](https://www.serverless.com/) (AWS Lambda par exemple).

- **Frontend** :  
  - Développé en [React](https://reactjs.org/) + [Vite](https://vitejs.dev/).  
  - Inclut un exemple de chat en temps réel, une gestion de la navigation avec React Router, un système de Tchat via WebSocket, ainsi que quelques composants d’interface (Sidebar, Layout Dashboard, etc.).  
  - Configuré avec ESLint, Prettier, TypeScript, etc.  
  - Prévu pour être déployé sur un hébergement statique (ou via Serverless Finch / CloudFront-S3).

- **Workflows GitHub** :  
  - *ci-frontend.yml* : Exécute la CI du frontend, avec installation, tests, build, etc.  
  - *cd-frontend-deployment.yml* : Déploiement continu du frontend sur un environnement défini (S3, etc.).

---

## 2. Arborescence générale

```
redboarddev-atlas-genai/
├── README.md                 # (ce fichier)
├── backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── serverless.yml
│   ├── tsconfig.json
│   ├── app/
│   │   ├── app.ts            # Point d’entrée Fastify
│   │   ├── env/
│   │   │   └── .env_example
│   │   └── src/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── middlewares/
│   │       ├── libs/
│   │       ├── entities/
│   │       ├── config/
│   │       └── ...
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── .env_example
│   └── usefull-scripts/
│       ├── generate-local.sh
│       ├── init-docker.sh
│       ├── migrate-local.sh
│       ├── start-docker.sh
│       └── stop_docker.sh
├── frontend/
│   ├── Dockerfile
│   ├── vite.config.ts
│   ├── package.json
│   ├── public/
│   │   └── locales/          # Fichiers de traduction (i18n)
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── services/
│       ├── routes/
│       └── ...
└── .github/
    └── workflows/
        ├── ci-frontend.yml
        └── cd-frontend-deployment.yml
```

---

## 3. Prérequis

Pour utiliser ce projet localement ou lancer la CI/CD, vous aurez besoin des éléments suivants :

- **Node.js** ≥ 18.x  
- **npm** ≥ 8.x (fourni avec Node.js), ou **yarn**  
- **Docker** ≥ 20.10 (si vous utilisez Docker)  
- **Docker Compose** ≥ 1.29 (pour le docker-compose.yml du backend)  
- **Serverless CLI** (optionnel, si vous comptez déployer sur AWS Lambda)  
  ```bash
  npm install -g serverless
  ```

---

## 4. Installation et configuration

1. **Cloner le repository**  

   ```bash
   git clone https://github.com/votre-nom-utilisateur/redboarddev-atlas-genai.git
   cd redboarddev-atlas-genai
   ```

2. **Installer les dépendances**  
   - Pour le backend :
     ```bash
     cd backend
     npm install
     ```
   - Pour le frontend :
     ```bash
     cd ../frontend
     npm install
     ```

### Configuration des variables d’environnement

- **Backend**  
  - Dans `backend/app/env/.env_example`, vous trouverez un exemple de configuration des variables nécessaires (API_PORT, POSTGRES_USER, POSTGRES_PASSWORD, etc.).  
  - Copiez le fichier en `.env` et adaptez-le à votre environnement :

    ```bash
    cp backend/app/env/.env_example backend/app/env/.env
    ```

  - Faites de même pour `prisma/.env_example` si nécessaire (DATABASE_URL, etc.).

- **Frontend**  
  - Il peut exister un équivalent `.env` pour définir l’URL de l’API, etc.  
  - Reportez-vous à `frontend/config/stages-urls.json` ou `editApiUrl.js` si vous souhaitez personnaliser les URLs en fonction de l’environnement.

---

## 5. Lancer le projet

### Lancer le backend

Vous pouvez lancer le backend soit directement en local (Node.js), soit via Docker.

#### En local (Node.js)

1. Rendez-vous dans le dossier `backend`.
2. Assurez-vous que votre base de données est accessible (via docker ou un service local).
3. Exécutez :
   ```bash
   npm run dev
   ```
4. L’API est normalement accessible sur [http://localhost:3000](http://localhost:3000) (ou le port configuré dans votre `.env`).

#### Lancer le frontend

Dans le dossier `frontend` :

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
2. Accédez ensuite à l’URL fournie dans la console (souvent [http://localhost:5173](http://localhost:5173)).

### Utiliser Docker

Le projet peut aussi être lancé via Docker Compose pour le backend. Les scripts se trouvent dans `backend/usefull-scripts`.

1. **Démarrer les conteneurs** (backend + DB) :
   ```bash
   cd backend
   ./usefull-scripts/start-docker.sh
   ```
2. **Initialiser la base de données** (migrations, seed) :
   ```bash
   ./usefull-scripts/init-docker.sh
   ```
3. **Vérifier** : l’API devrait répondre sur le port `API_PORT` défini dans votre `.env`.  
4. Le frontend peut également être containerisé (Dockerfile dans `frontend`), selon votre workflow habituel. Un exemple de `docker-compose` unifié pourrait être ajouté si besoin.

---

## 6. Scripts utiles

- **Backend** :  
  - `npm run dev` : démarre le serveur Fastify en mode développement (watch).  
  - `npm run prisma:generate` : génère le client Prisma.  
  - `npm run prisma:migrate` : applique les migrations en mode dev.  
  - `npm run prisma:seed` : lance le script de seed.  
  - `npm run lint:check` / `lint:fix` : vérifie / corrige le code via ESLint.  
  - `npm run format:check` / `format:fix` : vérifie / formate via Prettier.  

- **Frontend** :  
  - `npm run dev` : lance Vite en mode dev.  
  - `npm run build` : construit l’application pour la production.  
  - `npm run preview` : prévisualise le build.  

- **Scripts Docker (backend/usefull-scripts)** :  
  - `start-docker.sh` : lance Docker Compose (API + Postgres).  
  - `stop_docker.sh` : stoppe et supprime les conteneurs.  
  - `init-docker.sh` : génère le client Prisma, exécute migrations et seed.  
  - `generate-local.sh`, `migrate-local.sh` : utilitaires pour générer le client Prisma et lancer des migrations en local.

---

![infra as a code](infra-as-a-code.png)
