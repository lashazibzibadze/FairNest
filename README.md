# FairNest NYC – Housing Fairness Website

**Deployed Site:** [https://fairnest.onrender.com](https://fairnest.onrender.com)

**Project Summary:**  
FairNest is a housing fairness website designed to rank real estate listings for sale in New York City based on fairness. It uses web scraping to collect housing data from various platforms and applies a fairness algorithm to help users assess if a listing is appropriately priced for its location.

**Tools & Technologies Used:**  
- **Frontend:** Vite, React, TypeScript, Tailwind CSS v3.4.17 
- **APIs:** Google Maps Places, Google Geocoding, Google Maps JavaScript  
- **Authentication:** Auth0  
- **Backend & Scraping:** Python (FastAPI, Async Web Scraper), Fairness Algorithm

**Why FairNest?**  
We often struggled to understand whether a listing was fairly priced based on its borough or neighborhood. That frustration inspired us to build FairNest—a platform designed to make this confusing process simpler and more transparent for everyone.

**What We Do**  
FairNest is built for fairness and accessibility. We prioritize ethical and inclusive listings, and our location insights help you find the right home in the right place.

**Why It Matters**  
Fair housing is essential for building strong, inclusive communities. By promoting transparency and fairness, we help ensure everyone has access to a safe and affordable home.

---

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
Dependencies installed through requirements.txt in `backend` folder
```
cd /backend/app/scraper/
python scraper-async.py
```
