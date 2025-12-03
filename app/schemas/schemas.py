from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- Gemini Response Structures (Strict JSON) ---

class ProductRecommendation(BaseModel):
    name: str
    price_tier: str = Field(description="Low, Mid, or High")
    link_query: str = Field(description="Search query to buy the product")

class Routine(BaseModel):
    am: str
    pm: str
    products: List[ProductRecommendation]

class SkinIssue(BaseModel):
    type: str = Field(description="Name of condition, e.g., 'Acne', 'Dark Spot'")
    severity: str
    timeframe: str = Field(description="Estimated time to heal")
    location_area: str = Field(description="Forehead, Nose, Chin, Left Cheek, Right Cheek, Under Eyes")
    recommendation: Routine

class SkinAnalysisResponse(BaseModel):
    issues: List[SkinIssue]
    summary: str

# --- API Request/Response Schemas ---

# User
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    pass

class UserUpdatePreferences(BaseModel):
    skin_profile: dict

class UserResponse(UserBase):
    id: int
    created_at: datetime
    skin_profile: dict

    class Config:
        from_attributes = True

# Scan
class ScanBase(BaseModel):
    image_url: str

class ScanResponse(ScanBase):
    scan_id: int
    # We can include the full analysis here if needed, or just summary
    # For backward compatibility or history, we might want to store the raw JSON
    # But for the /analyze endpoint, we will return SkinAnalysisResponse directly
    pass 

    class Config:
        from_attributes = True

class HistoryItem(BaseModel):
    scan_id: int
    image_url: str
    created_at: datetime
    summary: Optional[str] = None

    class Config:
        from_attributes = True
