HRMS Lite
=========
![License: GNU](https://img.shields.io/badge/License-GNU-green.svg)   ![Python](https://img.shields.io/badge/Python-3.12-blue)   ![Django](https://img.shields.io/badge/Django-6.0-brightgreen)   ![React](https://img.shields.io/badge/React-18.2-blueviolet)
**HRMS Lite** is a lightweight Human Resource Management System (HRMS) with a **React** frontend and a **Django** backend. It provides basic employee management, attendance tracking, and department-wise reporting functionality.
* * *
Features
--------
*   Employee management (add, update, delete employees)
*   Attendance tracking per employee
*   Daily and Month-to-Date (MTD) attendance reports
*   Department-wise attendance summaries
*   Filter attendance by date or department
*   Dashboard-ready API endpoints
*   Lightweight and extendable for additional HR features
* * *
Tech Stack
----------
Layer
Technology
Frontend
React.js, HTML5, CSS3, Axios
Backend
Django, Django REST Framework
Database
PostgreSQL / SQLite (configurable)
API
RESTful APIs
Authentication
Django Auth (extendable)
* * *
Installation
------------
### Backend (Django)
Clone the repository:
git clone https://github.com/yourusername/hrms-lite.git
cd hrms-lite/backend
Create a virtual environment and activate it:
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows
venv\\Scripts\\activate
Install dependencies:
pip install -r requirements.txt
Apply migrations:
python manage.py migrate
Run the development server:
python manage.py runserver
### Frontend (React)
Navigate to the frontend folder:
cd ../frontend
Install dependencies:
npm install
Start the development server:
npm start
* * *
Usage
-----
Create super user using:
python manage.py createsuperuser
Login to Django admin and add departments. Add employees using the frontend UI, mark attendance per employee per day, and access daily or MTD reports. Filter reports by department or date as needed.
* * *
Contributing
------------
Fork the repository. Create a feature branch:
git checkout -b feature/my-feature
Commit your changes:
git commit -am 'Add feature'
Push to the branch:
git push origin feature/my-feature
Open a Pull Request.
* * *
License
-------
This project is licensed under the GNU License.
* * *
Author
------
Your Name – Your contact or portfolio link