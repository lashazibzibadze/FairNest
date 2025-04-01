# FairNest Project Setup

## Step 1) Clone GitHub repository

## Step 2) Run FastAPI server on your Machine, Follow Steps Bellow:

### 1. Create a Virtual Environment

Run the following commands

```bash
python3 -m venv venv
```

### 2. Activate the Virtual Environment

-   **Mac/Linux**:
    ```bash
    source venv/bin/activate
    ```
-   **Windows**:
    ```bash
    venv\Scripts\activate
    ```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create an .env file in /backend/app and copy secrets

### 5. Start up the FastAPI server

```bash
cd app
uvicorn main:app --reload
```

## Step 3) Setup & Launch React Project, Follow Steps Bellow:

### 1. To run a Vite React application, you need to have Node.js (version 18 or higher) and a package manager like npm or yarn installed

### 2. Run following commands
```bash
cd frontend/
npm install
npm run dev
```

### 3. Create an .env file in /frontend and copy secrets

## Step 4) How to Run Web Scraper
Dependencies installed through dependencies.txt
```
cd /backend/app/scraper/
python scraper-async.py
```
