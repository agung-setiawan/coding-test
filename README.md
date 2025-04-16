# Coding Challenge: Sales Dashboard with Next.js & FastAPI (Agung Test Code)

## Overview
This website tries to demonstrate a simple and clean admin page where there are 2 main pages, namely:
1. **Dashboard**.
   - It is a page where users can interact with AI, if they have questions they want to find answers to quickly.
   - User can easly get the feedback directly from AI based on the question.
2. **Users**.
   - It is a page that can demonstrate a list of Sales persons based on the **dummyData.json** file that has been provided.
   - On the initial display, a list of sales persons will be presented, with column: **ID, Name, Role, Region, Skills, Clients, and Deals**.
   - For Clients column, when clicked it will break down with new layout in below, to show all of client list under sales person include column: **Name, Industry, Contact**.
   - When clicked again it will close the break down layout.
   - Same with client column (when clicked), in Deals columns also have sama behaviour. Inside Deals will show columns: **Client, Value, Status**.
   - Each clicked in Clients and Deals is always fetching data to backend server with loading mask as per request.

---

## Requirements
Before do installation, please make sure your local enviroment is match with this application requirements:

1. **Python**
   - For better and smooth running this application, please makesure at least **Python 3.12.x** or above is already installed.
   
2. **Node JS**
   - This application required installed Node JS in local within minimum version is **20.0.0** or above is installed.

3. **Stable Internet Connection**
   - Since this application connected with Google Gemini AI, as AI agent for question and aswer, please provide stable internet connection for smooth operation.

---

## How to Install

This application can easly to install or deployment to local enviroment within a few step:

- **Initial Step**
   - Clone this repo into local
   ```bash
   https://github.com/agung-setiawan/coding-test
   ```
   - Please start deployment process from Backend and continue with Frontend.

- **Backend**
   - After successfully clone from repo, go to Backend folder and make copy from file ``.env.example`` into ``.env``
   - Still in Backend folder, open terminal to create and activate a virtual environment.
   - After virtual environment is activate, to install dependencies with run this command:  
     ```bash 
     pip install -r requirements.txt
     ```
   - Then try run the server:  
     ```bash
     uvicorn main:app  --reload
     ```  
   - To makesure server is run, open Swagger document by visiting `http://localhost:8000/docs`.

- **Frontend**
   - Navigate to the `frontend` directory.  
   - Opent terminal to install dependencies with run this command:  
     ```bash
     npm install
     ```  
   - When installing dependencies is done, to start the development server pelase run this command:
     ```bash
     npm run dev
     ```  
   - Open browser and navigate to this `http://localhost:3000` to view your Next.js app.

---

**Any question, please eamil me : agungsetiawan11@gmail.com**