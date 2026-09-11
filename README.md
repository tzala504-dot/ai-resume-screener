# AI Resume Screener

An AI-powered resume analyzer that gives job seekers instant ATS (Applicant Tracking System) feedback — score, missing keywords, and actionable suggestions — built for Hack Devengers 2.0.

## What it does

Upload a resume (PDF) and optionally paste a job description. The app analyzes the resume using AI and returns:
- **ATS Score** (0–100)
- **Missing keywords** relevant to the target role
- **Actionable suggestions** to improve the resume
- **Formatting issues** that could trip up an ATS parser

## Tech Stack

- **Backend:** Django + Django REST Framework
- **Frontend:** React (Vite) + Tailwind CSS
- **AI:** Google Gemini API
- **Database:** SQLite

## Project Structure


## Setup Instructions

### Backend (Django)

1. Create and activate a virtual environment:
```bash
   python -m venv env
   env\Scripts\activate      # Windows
   source env/bin/activate   # Mac/Linux
```

2. Install dependencies:
```bash
   pip install django djangorestframework django-cors-headers pdfplumber requests python-dotenv
```

3. Create a `.env` file in the project root:


4. Run migrations and start the server:
```bash
   python manage.py migrate
   python manage.py runserver
```

### Frontend (React)

1. Navigate to the frontend folder:
```bash
   cd resume-screener-frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Start the dev server:
```bash
   npm run dev
```

4. Open `http://localhost:5173` in your browser.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/upload-resume/` | POST | Upload a resume PDF + job description |
| `/api/analyze/<resume_id>/` | POST | Run AI analysis on the uploaded resume |
| `/api/analysis/<resume_id>/` | GET | Fetch the saved analysis |

## Built for

Hack Devengers 2.0 — 24-hour open innovation hackathon