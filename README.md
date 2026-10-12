# Phonebook API

An Express REST API for managing sample contacts, with MongoDB persistence, Mongoose validation, and a bundled frontend.

## Stack and structure

Node.js · Express · MongoDB · Mongoose · Morgan · dotenv · ESLint

- `index.js`: routes, request logging, static frontend serving, and error middleware.
- `models/phonebook.js`: database connection, contact schema, validation, and JSON serialization.
- `dist/`: the bundled frontend served by Express.

## Run locally

Use Node.js 24, npm, and a local MongoDB instance or a MongoDB Atlas database.

```sh
npm ci
cp .env.example .env
npm run dev
```

Set `MONGODB_URI` in `.env` to your own database connection string. `PORT` selects the HTTP port; the example uses 3001. The application reads both through dotenv. `.env` is ignored by Git.

For the non-watching server:

```sh
npm start
```

## API

| Method | Route | Behavior |
| --- | --- | --- |
| GET | `/api/persons` | List contacts |
| GET | `/api/persons/:id` | Read one contact; return 404 if absent |
| POST | `/api/persons` | Create a contact from `name` and `number` |
| PUT | `/api/persons/:id` | Update an existing contact's number |
| DELETE | `/api/persons/:id` | Delete a contact; return 204 |
| GET | `/info` | Show contact count and server time |

Example POST body:

```json
{
  "name": "Demo Contact",
  "number": "12-34567890"
}
```

Names must contain at least three characters. Phone numbers must contain at least eight characters and match a two- or three-digit prefix, a hyphen, and a numeric suffix. Invalid MongoDB identifiers and schema validation failures return 400. Unknown routes return 404.

## Checks and scope

```sh
npm run lint
```

The `npm test` script is currently a placeholder; there is no automated test suite. The API has no authentication or authorization and is intended as a learning/portfolio example using sample contacts. Request logging includes POST bodies.

The `build:ui` helper expects a separate `Phonebook/` frontend checkout, which is not included in this repository. The committed `dist/` is already served by the backend.

This project accompanies my [Full Stack Open exercises](https://github.com/mohliman/FullStackOpen). The previously documented hosted address is `https://phonebook-backend-server.onrender.com`; current backend/database availability has not been verified as part of this documentation update.
