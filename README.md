# SkinScout - AI Skin Analysis

SkinScout is an advanced AI-powered application that analyzes facial skin conditions using computer vision and generative AI. It identifies issues like acne, dark spots, and wrinkles, and provides personalized skincare routine recommendations and product suggestions.

## Features

-   **AI Analysis**: Detects skin issues (Acne, Dark Spots, Wrinkles, etc.) using Google's Gemini 2.0 Flash model.
-   **Semantic Mapping**: Accurately maps issues to specific facial areas (Forehead, Cheeks, Chin, etc.).
-   **Personalized Recommendations**: Generates AM/PM routines and product suggestions based on identified issues.
-   **History Tracking**: Saves analysis results for tracking progress over time.
-   **Privacy Focused**: Images are processed securely and not used for training without consent.

## Tech Stack

-   **Backend**: Python, FastAPI, SQLAlchemy, Google Gemini API
-   **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Shadcn/UI
-   **Database**: SQLite (Development) / PostgreSQL (Production ready)

## Prerequisites

-   Python 3.10+
-   Node.js 18+
-   Google Gemini API Key

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/qingchuh/skin_doctor.git
cd skin_doctor
```

### 2. Backend Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
touch .env
```

**Important**: Add your Gemini API key to `.env`. **Do not commit this file.**
```env
GEMINI_API_KEY=your_api_key_here
```

Run the backend server:
```bash
uvicorn app.main:app --reload
```
The backend will start at `http://127.0.0.1:8000`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```
The frontend will start at `http://localhost:3000`.

## Usage

1.  Open `http://localhost:3000` in your browser.
2.  Allow camera access or upload a photo of your face.
3.  Click **"Analyze Skin"**.
4.  View the results:
    -   **Overlay**: Colored dots indicate identified issues on your face.
    -   **Details**: Click a dot or use the drawer to see severity, healing time, and recommended routines.
5.  Check the **History** tab to see past scans.

## Security Note

This project uses a `.env` file to manage sensitive secrets like your API key. This file is included in `.gitignore` and will **not** be pushed to GitHub. Ensure you never manually commit your `.env` file.
