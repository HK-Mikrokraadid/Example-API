# Projekti Dokumentatsioon

## Ülevaade

See projekt on blogiplatvormi API, mis pakub võimalusi kasutajate, postituste ja kommentaaride haldamiseks ning autentimiseks. Projekti eesmärk on luua täisfunktsionaalne backend-teenus, mis võimaldab kasutajatel autentimist, postituste loomist ja kommentaaride lisamist.

## Projekti Struktuur

Projekt koosneb järgmistest peamistest osadest:

- **Express.js**: Node.js raamistik serveri loomiseks.
- **MySQL**: Andmebaas kasutajate, postituste ja kommentaaride haldamiseks.
- **Docker** ja **Docker Compose**: Konteinerite haldamiseks ja projektikeskkonna kiireks seadistamiseks.
- **JWT**: Autentimine JSON Web Tokenitega.

## Eeltingimused

Enne projekti paigaldamist veenduge, et teie süsteemis on installitud järgmised tarkvarad:

- **Docker** ja **Docker Compose**: Konteinerite ja teenuste haldamiseks.
- **Node.js** ja **npm**: JavaScripti runtime ja paketihaldur.

## Sõltuvused

Projekt kasutab järgmisi Node.js sõltuvusi:

### Põhisõltuvused

- **bcrypt**: Paroolide hashimiseks ja kontrollimiseks.
- **cors**: Cross-Origin Resource Sharing (CORS) lubamiseks.
- **express**: Rakenduse serveri loomiseks.
- **jsonwebtoken**: JSON Web Tokenite genereerimiseks ja valideerimiseks.
- **morgan**: HTTP päringute logimiseks.
- **mysql2**: MySQL andmebaasiga ühenduse loomiseks.
- **swagger-ui-express**: API dokumentatsiooni kuvamiseks.
- **winston**: Logimise haldamiseks.

```json
"dependencies": {
  "bcrypt": "^5.1.1",
  "cjs-module-lexer": "^1.3.1",
  "cors": "^2.8.5",
  "express": "^4.19.2",
  "jsonwebtoken": "^9.0.2",
  "morgan": "^1.10.0",
  "mysql2": "^3.10.0",
  "swagger-ui-express": "^5.0.1",
  "winston": "^3.13.0"
},
```

## Paigaldamine

Järgi järgmisi samme projekti seadistamiseks ja käivitamiseks:

### Laadige projekt alla

Laadige alla projekti lähtekood ja pakkige see lahti oma töökausta.

### Konfigureerige `.env` ja `config.js` failid

Projekti juurkaustas on järgmised näidisfailid:

- `.env.sample`
- `config.sample.js`

Kopeerige need failid vastavalt nimedega `.env` ja `config.js` ning kohandage neid oma vajadustele vastavalt. Näiteks:

- `.env` failis:

```env
DB_HOST=db
DB_USER=mrt
DB_PASSWORD=secret
DB_NAME=blog
DB_PORT=3306
JWT_SECRET=my-secret-key
```

- `config.js` failis:

```javascript
const config = {
  port: 3000,
  jwtSecret: process.env.JWT_SECRET || 'my-secret-key',
  saltRounds: 10,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'database',
    port: process.env.DB_PORT || 3306,
  }
};

module.exports = config;
```

### 3. Käivitage Docker Compose

Projekti käivitamiseks Docker Compose abil:

```bash
docker-compose up --build
```

See käsk seadistab ja käivitab konteinerid, sealhulgas rakenduse konteineri ja MySQL andmebaasi konteineri. `docker-compose.yml` failis on kõik vajalikud konfiguratsioonid olemas.

### 4. Kontrollige rakenduse tööd

Pärast edukat konteinerite käivitamist on rakendus ligipääsetav aadressil:

```bash
http://localhost:3000/ping
```

Testige, kas API töötab, tehes päringud näiteks Postmani või mõne muu HTTP kliendiga.

## Projekti Käivitamine Arendusrežiimis

Kui soovite projekti käivitada väljaspool Dockerit, saate seda teha järgmiselt:

### Paigaldage Node.js sõltuvused

Käivitage järgmine käsk projekti juurkaustas:

```bash
npm install
```

### Käivitage rakendus

Käivitage rakendus Node.js abil:

```bash
npm start
```

See käsk kasutab `package.json` failis määratud käsku `start`, mis käivitab `app.js` faili.

## API Dokumentatsioon

Projekti API dokumentatsioon on kättesaadav pärast rakenduse käivitamist aadressil:

```bash
http://localhost:3000/api-docs
```

Dokumentatsioon on loodud Swagger UI abil, mis võimaldab vaadata ja testida kõiki API otspunkte visuaalselt.

## Andmebaas

Projekti MySQL andmebaas sisaldab järgmisi tabeleid:

- **Users**: Kasutajate haldamiseks.
- **Posts**: Blogipostituste haldamiseks.
- **Comments**: Kommentaaride haldamiseks postituste kohta.

Docker Compose fail loob ja täidab vajalikud andmebaasid ning tabelid automaatselt.

## Koodistruktuur

- **`app.js`**: Rakenduse käivitusfail.
- **`config`**: Konfiguratsioonifailid.
- **`routes`**: API otspunktide marsruudid.
- **`controllers`**: Logika ja toimingud API päringutele vastamiseks.
- **`services`**: Ärilogika ja andmebaasipäringud.
- **`middlewares`**: Vahekihid, näiteks autentimine ja vigade käsitlemine.

## Logimine

Projekt kasutab **Winstoni** logimist, et logida süsteemi teateid ja vigu:

- Logid salvestatakse kausta `./logs`.
- Logid on saadaval nii konsoolis kui ka failides (`combined.log` ja `errors.log`).

## Tõrkeotsing

Kui teil tekib probleeme:

- Kontrollige konteinerite logisid Docker Compose abil: `docker-compose logs`.
- Kontrollige rakenduse logifaile kaustas `./logs`.
- Veenduge, et `.env` ja `config.js` failid on õigesti seadistatud.
