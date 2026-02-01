# Finlingo

Finlingo is a web-based financial literacy platform designed to teach kids essential money skills early. It turns complex financial concepts into short lessons, interactive mini-games, and quizzes so children can learn without relying on trial and error later in life.

The platform focuses on building confidence around money by teaching spending, saving, credit, investing, and financial decision-making in a fun, game-like environment.

---

## Quick Start

## Frontend (React + Vite)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Opens at [http://localhost:5173/](http://localhost:5173/)

---

## Backend (Python + Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Runs at [http://localhost:5050](http://localhost:5050)

## What it does

Finlingo is an interactive financial literacy web app for kids. It teaches core money concepts through short lessons, quizzes, and interactive tasks that reinforce learning through action rather than long explanations.

The app guides users through topics such as:
* Basic money concepts
* First paychecks and earning
* Credit cards and interest
* Investing and long-term thinking
* Financial responsibility and planning

User progress is saved so children can continue learning where they left off.

---

## How we built it

We built Finlingo using a simple, reliable full-stack setup:
* Frontend: React (Vite) for an interactive, game-like user interface
* Backend: Python with Flask to handle authentication, progress tracking, and APIs
* Database: SQL to store user data and level progression

The frontend handles navigation, animations, and interactive quizzes, while the backend ensures progress is saved and unlocked levels persist across sessions.

---

## Features

* User login and account creation
* Interactive homepage with unlockable levels
* Short lessons and quizzes per topic
* Progress tracking with locked and unlocked levels
* Badge system - earn achievements by completing levels and reaching goals
* Goal Jar - set savings goals and track progress visually
* Add money to goals with preset or custom amounts
* Settings page with appearance themes and advanced options
* Simple, kid-friendly UI design

---

## Project Structure

```
├── backend/
│   ├── routes/
│   ├── services/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md
```
## Built For

* **ElleHacks** - Challenge 3: Empowerment 💼⚖️

* **Financial empowerment** - Breaking down barriers to money knowledge

* **Early education access** - Teaching kids before trial-and-error becomes costly

* **Inclusive learning** - Making complex concepts simple and approachable for all

💰 **Finlingo** — empowering the next generation with financial confidence, one lesson at a time.