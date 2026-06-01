import os
from datetime import datetime
from enum import Enum

from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

load_dotenv()
app = FastAPI(
    title="API Lapor Jalan Rusak",
    description="Backend service untuk menampung laporan jalan rusak dari warga",
    version="1.0.0"
)

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

try:
    client = MongoClient(MONGO_URL)
    db = client.hackathon_db
    reports_collection = db.reports
    client.admin.command('ping')
except ConnectionFailure:
    raise RuntimeError("Gagal terhubung ke MongoDB Atlas! Cek koneksi internetmu.")

class ReportStatus(str, Enum):
    MENUNGGU = "menunggu_audit"
    DIPERBAIKI = "diperbaiki"
    SELESAI = "selesai"

class ReportSchema(BaseModel):
    photo_url: str = Field(..., description="Link URL foto dari cloud storage")
    latitude: float = Field(..., description="Titik koordinat Y")
    longitude: float = Field(..., description="Titik koordinat X")
    description: str = Field(..., description="Penjelasan detail lokasi/kerusakan")

class UpdateStatusSchema(BaseModel):
    status: ReportStatus = Field(..., description="Pilih: menunggu_audit, diperbaiki, selesai")
@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Backend Lapor Jalan Rusak Aktif! 🚀"}

@app.post("/api/reports", status_code=status.HTTP_201_CREATED, tags=["Reports"])
async def create_report(report: ReportSchema):
    try:
        new_report = {
            "photo_url": report.photo_url,
            "location": {
                "type": "Point",
                "coordinates": [report.longitude, report.latitude]
            },
            "description": report.description,
            "status": ReportStatus.MENUNGGU,
            "created_at": datetime.utcnow()
        }
        result = reports_collection.insert_one(new_report)
        return {
            "message": "Laporan berhasil dikirim", 
            "id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan server: {str(e)}")

@app.get("/api/reports", tags=["Reports"])
async def get_reports():
    try:
        reports = []
        for report in reports_collection.find().sort("created_at", -1):
            report["_id"] = str(report["_id"])
            reports.append(report)
        return {"status": "success", "data": reports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengambil data: {str(e)}")

@app.patch("/api/reports/{report_id}", tags=["Reports"])
async def update_report_status(report_id: str, status_data: UpdateStatusSchema):
    if not ObjectId.is_valid(report_id):
        raise HTTPException(status_code=400, detail="Format ID laporan tidak valid")

    try:
        result = reports_collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": {"status": status_data.status}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")

        return {"message": f"Status berhasil diubah menjadi {status_data.status.value}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal mengubah status: {str(e)}")
