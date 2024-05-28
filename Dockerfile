FROM node:22

# Määrame töökausta konteineris
WORKDIR /usr/src/app

# Kopeerime package.json ja package-lock.json
COPY package*.json ./

# Installime sõltuvused
RUN npm install -g pm2
RUN npm install

# Kopeerime ülejäänud rakenduse koodi
COPY . .

# Ava vajalik port
EXPOSE 3000

# Käivita rakendus PM2 abil
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
