from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from datetime import date
import models, schemas, database
from sqlalchemy import func

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    employees = db.query(models.Employee).all()
    today = date.today()
    attendance_recs = db.query(models.Attendance).filter(models.Attendance.date == today).all()
    
    status_map = {rec.employee_id: rec.status for rec in attendance_recs}
    
    detailed_list = []
    present_count = 0
    absent_count = 0
    
    for emp in employees:
        current_status = status_map.get(emp.id, "Unmarked")
        
        if current_status == "Present":
            present_count += 1
        elif current_status == "Absent":
            absent_count += 1
            
        detailed_list.append({
            "id": emp.id,
            "full_name": emp.full_name,
            "department": emp.department,
            "status": current_status
        })

    return {
        "total_employees": len(employees),
        "present_today": present_count,
        "absent_today": absent_count,
        "unmarked_today": len(employees) - (present_count + absent_count),
        "employee_list": detailed_list
    }

@app.post("/employees/", response_model=schemas.EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(database.get_db)):
    db_emp = db.query(models.Employee).filter(models.Employee.email == employee.email).first()
    if db_emp:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_id = db.query(models.Employee).filter(models.Employee.employee_id == employee.employee_id).first()
    if db_id:
        raise HTTPException(status_code=400, detail="Employee ID already exists")

    new_emp = models.Employee(**employee.dict())
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return new_emp

@app.get("/employees/", response_model=List[schemas.EmployeeOut])
def read_employees(db: Session = Depends(database.get_db)):
    employees = db.query(models.Employee).all()
    results = []
    for emp in employees:
        count = db.query(models.Attendance).filter(
            models.Attendance.employee_id == emp.id,
            models.Attendance.status == "Present"
        ).count()
        emp_data = schemas.EmployeeOut.model_validate(emp)
        emp_data.attendance_count = count
        results.append(emp_data)
    return results

@app.delete("/employees/{emp_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(emp_id: int, db: Session = Depends(database.get_db)):
    emp = db.query(models.Employee).filter(models.Employee.id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(emp)
    db.commit()
    return None

@app.post("/attendance/", response_model=schemas.AttendanceOut, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(database.get_db)):
    emp = db.query(models.Employee).filter(models.Employee.id == attendance.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == attendance.employee_id,
        models.Attendance.date == attendance.date
    ).first()

    if existing:
        existing.status = attendance.status
        db.commit()
        db.refresh(existing)
        return existing
    
    new_attendance = models.Attendance(**attendance.dict())
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    return new_attendance

@app.get("/attendance/{emp_id}", response_model=List[schemas.AttendanceOut])
def get_attendance(
    emp_id: int, 
    start_date: Optional[date] = None, 
    end_date: Optional[date] = None, 
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Attendance).filter(models.Attendance.employee_id == emp_id)
    
    if start_date:
        query = query.filter(models.Attendance.date >= start_date)
    if end_date:
        query = query.filter(models.Attendance.date <= end_date)
        
    records = query.order_by(models.Attendance.date.desc()).all()
    return records