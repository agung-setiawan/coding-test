from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict
from dotenv import load_dotenv
import os
import google.generativeai as genai
import uvicorn
import json
import httpx

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI(
    title="Agung Test Code",
    description="Simple Application to get data of sales representative",
    version="0.0.1",
    contact={
        "name": "Agung Setiawan",
        "url": "https://github.com/agung-setiawan/coding-test",
        "email": "agungsetiawan11@gmail.com",
    }
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # explicitly allowing OPTIONS
    allow_headers=["*"],
)

# Load the data from the JSON file
with open("../dummyData.json") as f:
    data = json.load(f)

# Define Pydantic models
class Deal(BaseModel):
    client: str
    value: int
    status: str

class Client(BaseModel):
    name: str
    industry: str
    contact: str

class SalesRep(BaseModel):
    id: int
    name: str
    role: str
    region: str
    skills: List[str]
    deals: List[Deal]
    clients: List[Client]

# Define request body structure
class UserPrompt(BaseModel):
    prompt: str

# API Endpoints
@app.get("/api/sales-reps", response_model=List[SalesRep])
async def get_all_sales_reps():

    return data["salesReps"]

@app.get("/api/sales-reps/{rep_id}/details", response_model=SalesRep)
async def get_sales_rep_by_id(rep_id: int):
    """
    Retrieve a sales person by its ID.

    - **rep_id**: The ID of the sales person to retrieve.

    Returns the all details sales person information if found.

    if it not found, an exception is raised with message=**Sales person not found**.
    """
    for rep in data["salesReps"]:
        if rep["id"] == rep_id:
            return rep
    raise HTTPException(status_code=404, detail="Sales person not found")

@app.get("/api/sales-reps/{rep_id}/deals", response_model=List[Deal])
async def get_sales_rep_deals(rep_id: int):
    """
    Retrieve a sales deals list by sales person ID.

    - **rep_id**: The ID of the sales person to retrieve.

    Returns the list all deals from selected sales if found.

    if it not found, an exception is raised with message=**Sales person not found**.
    """
    for rep in data["salesReps"]:
        if rep["id"] == rep_id:
            return rep["deals"]
    return {"error": "Sales representative not found"}

@app.get("/api/sales-reps/{rep_id}/skills", response_model=List[str])
async def get_sales_rep_skills(rep_id: int):
    """
    Retrieve a sales skills set list by sales person ID.

    - **rep_id**: The ID of the sales person to retrieve.

    Returns the list all skill from selected sales if found.

    if it not found, an exception is raised with message=**Sales person not found**.
    """
    for rep in data["salesReps"]:
        if rep["id"] == rep_id:
            return rep["skills"]
    return {"error": "Sales representative not found"}

@app.get("/api/sales-reps/{rep_id}/clients", response_model=List[Client])
async def get_sales_rep_clients(rep_id: int):
    """
    Retrieve a sales clients list by sales person ID.

    - **rep_id**: The ID of the sales person to retrieve.

    Returns the list all skill under selected sales if found.

    if it not found, an exception is raised with message=**Sales person not found**.
    """
    for rep in data["salesReps"]:
        if rep["id"] == rep_id:
            return rep["clients"]
    return {"error": "Sales representative not found"}

@app.get("/api/sales-reps/total-deals")
def get_total_deals():
    result: Dict[str, float] = {}

    for rep in data["salesReps"]:
        total_value = sum(deal["value"] for deal in rep["deals"])
        result[rep["name"]] = total_value

    return result

@app.get("/api/sales-reps/deals-by-status")
def get_deals_by_status() -> Dict[str, Dict[str, float]]:
    result = {}

    for rep in data["salesReps"]:
        status_totals: Dict[str, float] = {}

        for deal in rep["deals"]:
            status = deal["status"]
            value = deal["value"]
            status_totals[status] = status_totals.get(status, 0) + value

        result[rep["name"]] = status_totals

    return result

@app.get("/api/sales-reps/total/by-status")
def get_deal_totals_by_status() -> list[dict[str, str]]:
    status_totals: Dict[str, float] = {}

    for rep in data["salesReps"]:
        for deal in rep["deals"]:
            status = deal["status"]
            value = deal["value"]
            status_totals[status] = status_totals.get(status, 0) + value

    output_data: list[dict[str, str]] = [{"name": k, "value": str(v)} for k, v in status_totals.items()]

    return output_data

@app.post("/api/ai/ask-me")
async def ask_me_endpoint(request: Request):
    """
    Accepts a user question and returns a placeholder AI response.

    (Optionally integrate a real AI model or external service here.)
    """
    body = await request.json()
    user_question = body.get("question", "")

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(user_question)
        return {"answer": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=9500, reload=True)