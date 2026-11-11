# MERN Todo App

React (Vite) frontend + Express + MongoDB backend. Full CRUD: add, edit, complete, delete, filter.

## Folder structure

```
todo-mern/
├── server/
│   ├── server.js
│   ├── models/Todo.js
│   ├── routes/todos.js
│   ├── .env.example
│   └── package.json
└── client/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── App.css
```

## Run karne ke steps

Pehle MongoDB local chalna chahiye (ya MongoDB Atlas ka URI use karo).

**1. Backend**
```bash
cd server
cp .env.example .env      # zaroorat ho to MONGO_URI badlo
npm install
npm run dev               # http://localhost:5000
```

**2. Frontend** (naye terminal me)
```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

Vite proxy `/api` ko `localhost:5000` par bhej deta hai, isliye CORS ki dikkat nahi aati.

## API

| Method | Route            | Kaam                         |
|--------|------------------|------------------------------|
| GET    | /api/todos       | Saare todos                  |
| POST   | /api/todos       | Naya todo `{ title }`        |
| PUT    | /api/todos/:id   | Update `{ title, completed }`|
| DELETE | /api/todos/:id   | Todo delete                  |
