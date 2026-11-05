# 🍽️ Healthy Meal Planner ( bachelor project)

**EatMeSlow — Full-Stack Nutrition Tracking Web Application**

A full-stack web application built with **React, FastAPI, SQLAlchemy, and SQLite**. EatMeSlow helps users discover healthy recipes, filter meals based on personal preferences, track daily food consumption, and visualize their nutritional history through interactive charts.

## Project Overview

EatMeSlow is an interactive web application designed to help users make healthier food choices and monitor their eating habits.

The application combines recipe discovery, personalized filtering, and nutritional tracking in a user-friendly interface.

## Key Features

- **Healthy Recipe Discovery:** Browse a variety of healthy and balanced recipes.
- **Advanced Recipe Filtering:** Filter recipes based on ingredients, calorie content, budget, and vegan preferences.
- **Daily Food Tracking:** Monitor daily food consumption.
- **Nutritional Dashboard:** Visualize nutritional history using charts and graphs.

## Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, CSS |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | SQLite |
| API Server | Uvicorn |

## Application Architecture

The application follows a full-stack architecture with three main components:

- **Frontend:** A React-based user interface for recipe discovery, filtering, and nutritional tracking.
- **Backend:** A FastAPI application responsible for processing requests and managing application logic.
- **Database:** A SQLite database managed through SQLAlchemy for storing and retrieving application data.

##  Installation and Setup

### 1. Prerequisites

Make sure the following tools are installed:

- Python
- Node.js and npm
- Required Python dependencies

### 2. Run the Backend

Navigate to the backend directory:

```bash
cd project/backend
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

The backend will be available at:

`http://127.0.0.1:8000`

### 3. Run the Frontend

Open a new terminal and navigate to the project directory:

```bash
cd project
```

Install the frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

### 4. Populate the Database

Navigate to the backend directory:

```bash
cd project/backend
```

Run the database population script:

```bash
python -m app.scripts.populate_db
```

### 5. Troubleshooting Frontend Dependencies

If you encounter dependency issues after moving or cloning the project, reinstall the frontend dependencies:

```bash
cd project
rm -rf node_modules package-lock.json
npm install
npm start
```

## Project Objectives

This project focuses on developing a full-stack web application that integrates:

- Frontend development with React.
- Backend API development with FastAPI.
- Database management using SQLAlchemy and SQLite.
- Data filtering and retrieval.
- Nutritional data visualization.
- User-friendly interface design.
