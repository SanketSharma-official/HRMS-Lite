# HRMS Lite

A production-ready, full-stack Human Resource Management System designed to manage employee records and track attendance efficiently. Built with a modern React frontend and a high-performance FastAPI backend.

## Project Overview

HRMS Lite is a web application that digitizes workforce management. It provides a centralized interface for administrators to maintain employee directories, track daily attendance statuses, and monitor workforce statistics in real-time. The system emphasizes data integrity through strict input validation and provides a responsive user experience with immediate state updates.

## Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **State Management:** React Hooks

### Backend
- **Framework:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL 
- **Validation:** Pydantic v2
- **Server:** Uvicorn

## Project Structure

```bash
hrms-lite/
├── backend/
│   ├── database.py          # Database connection & session handling
│   ├── main.py              # API routes & application entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic data validation schemas
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AttendanceManager.jsx  # Attendance tracking interface
│   │   │   ├── Dashboard.jsx          # Statistics & charts
│   │   │   ├── DeleteModal.jsx        # Safety confirmation for deletion
│   │   │   ├── EmployeeManager.jsx    # Employee CRUD operations
│   │   │   └── Navbar.jsx             # Application navigation
│   │   ├── api.js           # Centralized Axios API configuration
│   │   ├── App.jsx          # Main React component
│   │   └── main.jsx         # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Steps to Run Locally

Follow these instructions to set up and run the project on your local machine. You will need to run the backend and frontend in **separate terminals**.

### Prerequisites
- Node.js (v20 or higher)
- Python (v3.10 or higher)

### 1. Backend Setup

Open your primary terminal, navigate to the backend folder, and start the server.

```bash
cd backend

# Create a virtual environment
# Windows:
python -m venv venv
venv\Scripts\activate

# Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```
The backend API will be available at:

``` http://127.0.0.1:8000 ```
### 2. Frontend Setup
Open a new terminal
```
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev 
```


# Assumptions and Limitations

## Assumptions

- **Date Handling** : Attendance is recorded based on the local date string (YYYY-MM-DD) to simplify timezone complexities between the client and server.

- **User Freedom** : It is assumed that the admin should be able to change the both future and past dates for convenience and is thus not restricted from changing both future and past dates though warnings are provided. 

- **Unmarked Employees** : An employee must be marked absent and is assumed to be explicitly unmarked until marked absent. 

## Limitations
- **Pagination**: The current Employee Directory displays all employees in a single list. For datasets larger than 100+ users, server-side pagination would be required for optimal performance.
