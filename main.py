import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import datetime
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="API Lapor Jalan Rusak")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.getenv("MONGO_URI")
if not MONGO_URL:
    raise ValueError("Gawat! MONGO_URI kosong. File .env belum terbaca!")

client = MongoClient(MONGO_URL)
db = client.hackathon_db
reports_collection = db.reports


class ReportSchema(BaseModel):
    photo_url: str
    latitude: float
    longitude: float
    description: str


@app.get("/")
async def root():
    return {"message": "Backend Lapor Jalan Rusak Aktif!"}
    
@app.post("/api/reports")
async def create_report(report: ReportSchema):
    new_report = {
        "photo_url": report.photo_url,
        "location": {
            "type": "Point",
            "coordinates": [report.longitude, report.latitude]
        },
        "description": report.description, # <-- Sudah disamakan
        "status": "menunggu_audit",
        "created_at": datetime.datetime.utcnow()
    }
    result = reports_collection.insert_one(new_report)
    return {"message": "Laporan berhasil dikirim", "id": str(result.inserted_id)}
1