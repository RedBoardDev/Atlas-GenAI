FROM node:22 AS builder

WORKDIR /app

# Copier les fichiers de configuration et les dépendances
COPY package*.json ./
COPY tsconfig*.json ./
COPY serverless.yml ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Générer le client Prisma
# RUN npx prisma generate

# Construire l'application
RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/serverless.yml ./
COPY --from=builder /app/static ./static

# Installer serverless globalement
RUN npm install -g serverless@3

# Exposer le port 3000
EXPOSE 3000

# Commande par défaut pour démarrer l'application
CMD ["serverless", "deploy", "--stage", "prod"]