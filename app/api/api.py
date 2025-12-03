from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.services.gemini import GeminiService
from app.services.storage import StorageService
from app.models.models import User, Scan, ScanResult
from app.schemas.schemas import SkinAnalysisResponse, UserUpdatePreferences, UserResponse, HistoryItem
import json

router = APIRouter()
gemini_service = GeminiService()
storage_service = StorageService()

@router.post("/analyze", response_model=SkinAnalysisResponse)
async def analyze_skin(
    file: UploadFile = File(...),
    # user_id: int = Form(...), # Optional: Re-enable if we want to save to DB
    # db: AsyncSession = Depends(get_db) # Optional
):
    # 1. Read Bytes
    content = await file.read()
    
    # 2. Call REAL Gemini API (This should take 2-5 seconds)
    print("Sending to Gemini...") 
    analysis = await gemini_service.analyze_skin(content)
    
    # 3. Save to DB (optional for now, but ensure data is returned)
    # If we want to save, we would need to upload image, create scan, etc.
    # For now, we return the analysis directly as requested.
    return analysis

@router.get("/history/{user_id}", response_model=list[HistoryItem])
async def get_history(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Scan).where(Scan.user_id == user_id).order_by(Scan.created_at.desc())
    )
    scans = result.scalars().all()
    
    history = []
    for scan in scans:
        # We need to fetch the result summary. 
        # Since we didn't eager load, we might need to join or lazy load.
        # Async SQLAlchemy requires explicit loading usually.
        # Let's do a join query for efficiency in a real app, but here:
        res = await db.execute(select(ScanResult).where(ScanResult.scan_id == scan.id))
        scan_result = res.scalars().first()
        
        history.append(HistoryItem(
            scan_id=scan.id,
            image_url=scan.image_url,
            created_at=scan.created_at,
            summary=scan_result.summary if scan_result else "No analysis"
        ))
        
    return history

@router.post("/user/preferences", response_model=UserResponse)
async def update_preferences(
    user_id: int, # Query param or auth
    preferences: UserUpdatePreferences,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        # Create if not exists for demo
        user = User(id=user_id, email=f"user_{user_id}@example.com", skin_profile=preferences.skin_profile)
        db.add(user)
    else:
        user.skin_profile = preferences.skin_profile
        
    await db.commit()
    await db.refresh(user)
    return user
