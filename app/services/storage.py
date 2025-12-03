import os
import shutil
import uuid
from app.core.config import settings

class StorageService:
    def __init__(self):
        self.upload_dir = "app/static/uploads"
        os.makedirs(self.upload_dir, exist_ok=True)

    async def upload_image(self, file_obj, content_type: str) -> str:
        """
        Uploads a file to local storage and returns the URL.
        """
        extension = content_type.split('/')[-1]
        filename = f"{uuid.uuid4()}.{extension}"
        file_path = os.path.join(self.upload_dir, filename)
        
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file_obj, buffer)
            
            # Return local URL (assuming backend is running on localhost:8002)
            # In production, this would be the domain name
            return f"http://localhost:8002/static/uploads/{filename}"

        except Exception as e:
            print(f"Error saving to local storage: {e}")
            raise e
