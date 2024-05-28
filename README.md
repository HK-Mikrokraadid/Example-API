# Näidis-API

See API on loodud eesmärgiga demonstreerida RESTful API loomist. API on loodud kasutades Node.js-i ja Express-i.

## API paigaldamine

1. Kloonige see repo oma arvutisse
2. Avage terminal ja navigeerige projekti kausta
3. Nimetage fail `config.sample.js` ümber `config.js`-iks ja muutke sisu vastavalt vajadusele
4. Käivitage käsk `npm install`

## API kasutamine

API-l on kolm endpointi:

### `/login`

- POST `/login` - logib kasutaja sisse

Sisselogimiseks on vaja saata POST päring, kus on e-maili ja parooli kombinatsioon. Näide:

```json
{
  "email": "admin@admin.ee",
  "password": "admin"
}
```

Vastuseks saadetakse JWT token, mida on vaja teiste päringute tegemiseks saata kaasa `Authorization Bearer` päises.

### `/users`

- GET `/users` - tagastab kõik kasutajad
- POST `/users` - lisab kasutaja
- GET `/users/:id` - tagastab kasutaja ID järgi

### `/posts`

- GET `/posts` - tagastab kõik postitused
- GET `/posts/:id` - tagastab postituse ID järgi
