from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Application Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Job Application Tracker API is running"}


@app.get("/api/applications", response_model=List[schemas.ApplicationOut])
def list_applications(
    status: Optional[models.ApplicationStatus] = None, db: Session = Depends(get_db)
):
    return crud.get_applications(db, status=status)


@app.post("/api/applications", response_model=schemas.ApplicationOut, status_code=201)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    return crud.create_application(db, application)


@app.get("/api/applications/stats", response_model=List[schemas.StatusCount])
def application_stats(db: Session = Depends(get_db)):
    return crud.get_status_counts(db)


@app.get("/api/applications/{application_id}", response_model=schemas.ApplicationOut)
def get_application(application_id: int, db: Session = Depends(get_db)):
    db_application = crud.get_application(db, application_id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application


@app.put("/api/applications/{application_id}", response_model=schemas.ApplicationOut)
def update_application(
    application_id: int, application: schemas.ApplicationUpdate, db: Session = Depends(get_db)
):
    db_application = crud.update_application(db, application_id, application)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application


@app.delete("/api/applications/{application_id}", status_code=204)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    db_application = crud.delete_application(db, application_id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Application not found")
