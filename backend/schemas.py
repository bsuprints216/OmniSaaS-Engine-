from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    org_name: str

class UserSchema(UserBase):
    id: int
    org_id: int
    is_admin: bool

    class Config:
        from_attributes = True

class MetricBase(BaseModel):
    name: str
    value: float
    unit: str

class MetricSchema(MetricBase):
    id: int
    org_id: int
    timestamp: datetime.datetime

    class Config:
        from_attributes = True

class WorkflowBase(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_type: str

class WorkflowSchema(WorkflowBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class DashboardData(BaseModel):
    metrics: List[MetricBase]
    recent_actions: List[dict]
    system_status: str
