# Job Application Tracker

A full-stack web app to log and track job applications through their pipeline
(Applied → Interview → Offer / Rejected), with a live dashboard summarizing
where things stand.

<img width="1895" height="914" alt="image" src="https://github.com/user-attachments/assets/a43b3b09-d798-4852-9582-cb092801bfda" />


**Stack:** FastAPI + SQLAlchemy + SQLite (backend) · React + Vite + Recharts (frontend)

## Features

- Add, edit, and delete job applications (company, role, status, date, notes)
- Filter the list by status
- Dashboard header showing a live count per status
- Bar chart breakdown of applications by status
- REST API with auto-generated docs at `/docs`

## Project structure

```
job-application-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app + routes
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── schemas.py     # Pydantic request/response schemas
│   │   ├── crud.py        # DB access functions
│   │   └── database.py    # Engine/session setup
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ApplicationForm.jsx
    │   │   ├── ApplicationList.jsx
    │   │   └── StatusChart.jsx
    │   ├── App.jsx
    │   ├── api.js          # Axios client
    │   └── index.css
    └── package.json
```

## Running locally

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 2. Frontend (React)

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

Make sure the backend is running first — the frontend calls
`http://localhost:8000/api` directly (see `src/api.js`).

## API endpoints

| Method | Path                        | Description                     |
|--------|-----------------------------|----------------------------------|
| GET    | `/api/applications`         | List applications (optional `?status=`) |
| POST   | `/api/applications`         | Create an application            |
| GET    | `/api/applications/stats`   | Count of applications per status |
| GET    | `/api/applications/{id}`    | Get one application              |
| PUT    | `/api/applications/{id}`    | Update an application            |
| DELETE | `/api/applications/{id}`    | Delete an application             |

## Possible extensions

- JWT authentication for multi-user support
- PostgreSQL instead of SQLite for deployment
- Deploy backend to Render/Railway and frontend to Vercel/Netlify

---

**Resume bullet:**

> Job Application Tracker — Full-stack web app (FastAPI, React, SQLAlchemy)
> with a REST API for CRUD operations and a dashboard to track application
> status across a job search
