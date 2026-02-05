from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional
from models import AttendanceStatus

class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    employee_id: int

class AttendanceOut(AttendanceBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeOut(EmployeeBase):
    id: int
    attendance_count: Optional[int] = 0

    class Config:
        from_attributes = True