from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models, schemas


def get_applications(db: Session, status: Optional[models.ApplicationStatus] = None):
    query = db.query(models.Application)
    if status:
        query = query.filter(models.Application.status == status)
    return query.order_by(models.Application.applied_date.desc()).all()


def get_application(db: Session, application_id: int):
    return db.query(models.Application).filter(models.Application.id == application_id).first()


def create_application(db: Session, application: schemas.ApplicationCreate):
    db_application = models.Application(**application.model_dump())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


def update_application(db: Session, application_id: int, application: schemas.ApplicationUpdate):
    db_application = get_application(db, application_id)
    if not db_application:
        return None
    for field, value in application.model_dump(exclude_unset=True).items():
        setattr(db_application, field, value)
    db.commit()
    db.refresh(db_application)
    return db_application


def delete_application(db: Session, application_id: int):
    db_application = get_application(db, application_id)
    if not db_application:
        return None
    db.delete(db_application)
    db.commit()
    return db_application


def get_status_counts(db: Session):
    results = (
        db.query(models.Application.status, func.count(models.Application.id))
        .group_by(models.Application.status)
        .all()
    )
    return [{"status": status.value, "count": count} for status, count in results]
