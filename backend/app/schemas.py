from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .models import ApplicationStatus


class ApplicationBase(BaseModel):
    company: str
    role: str
    status: ApplicationStatus = ApplicationStatus.APPLIED
    applied_date: date
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    applied_date: Optional[date] = None
    notes: Optional[str] = None


class ApplicationOut(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class StatusCount(BaseModel):
    status: str
    count: int
