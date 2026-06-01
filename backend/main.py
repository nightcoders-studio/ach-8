import os
import jwt 
from datetime import datetime, timedelta
from enum import Enum
from bson import ObjectId
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

load_dotenv()

app = FastAPI(
    title="API Fix-In ",
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

SECRET_KEY = os.getenv("JWT_SECRET", "fallback_secret")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
MONGO_URL = os.getenv("MONGO_URI")
if not MONGO_URL:
    raise ValueError("Gawat! MONGO_URI kosong. File .env belum terbaca!")

try:
    client = MongoClient(MONGO_URL)
    db = client.hackathon_db
    reports_collection = db.reports
    client.admin.command('ping')
except ConnectionFailure:
    raise RuntimeError("Gagal terhubung ke MongoDB Atlas!")
class ReportStatus(str, Enum):
    MENUNGGU = "menunggu_audit"
    DIPERBAIKI = "diperbaiki"

    SELESAI = "selesai"
class ReportSchema(BaseModel):
    photo_url: str = Field(..., description="Link URL foto dari cloud storage")
    tingkat_kerusakan: str = Field(..., description="Pilih: Ringan, Sedang, Berat")
    kecamatan: str = Field(..., description="Nama Kecamatan")
    desa: str = Field(..., description="Nama Desa/Gampong")
    latitude: float = Field(..., description="Titik koordinat Y")
    longitude: float = Field(..., description="Titik koordinat X")
    description: str = Field(..., description="Penjelasan patokan/deskripsi tambahan")

class UpdateStatusSchema(BaseModel):
    status: ReportStatus = Field(..., description="Pilih: menunggu_audit, diperbaiki, selesai")
async def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != os.getenv("ADMIN_USERNAME"):
            raise HTTPException(status_code=401, detail="Token tidak valid")
        return username
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token kadaluarsa atau tidak valid",
            headers={"WWW-Authenticate": "Bearer"},
        )
@app.get("/", tags=["Health Check"])
async def root():
    return {"message": "Backend Fix-In Aktif! 🚀"}

@app.post("/api/auth/login", tags=["Auth"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    valid_username = os.getenv("ADMIN_USERNAME")
    valid_password = os.getenv("ADMIN_PASSWORD")

    if form_data.username != valid_username or form_data.password != valid_password:
        raise HTTPException(status_code=400, detail="Username atau password salah")

    expire = datetime.utcnow() + timedelta(hours=2)
    to_encode = {"sub": valid_username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": encoded_jwt, "token_type": "bearer"}

@app.post("/api/reports", status_code=status.HTTP_201_CREATED, tags=["Reports"])
async def create_report(report: ReportSchema):
    try:
        new_report = {
            "photo_url": report.photo_url,
            "tingkat_kerusakan": report.tingkat_kerusakan,
            "kecamatan": report.kecamatan,
            "desa": report.desa,
            "location": {
                "type": "Point",
                "coordinates": [report.longitude, report.latitude]
            },
            "description": report.description,
            "status": ReportStatus.MENUNGGU,
            "created_at": datetime.utcnow()
        }
        result = reports_collection.insert_one(new_report)
        return {"message": "Laporan berhasil dikirim", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan: {str(e)}")

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

@app.patch("/api/reports/{report_id}", tags=["Reports (Admin Only)"])
async def update_report_status(
    report_id: str, 
    status_data: UpdateStatusSchema, 
    current_admin: str = Depends(get_current_admin) 
):
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
