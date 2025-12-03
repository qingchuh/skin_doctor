import sys
import os
from unittest.mock import MagicMock

# Ensure local directory is first in path
sys.path.insert(0, os.getcwd())

print("Current Working Directory:", os.getcwd())

# Mock sqlalchemy.ext.asyncio.create_async_engine to avoid driver issues
try:
    import sqlalchemy.ext.asyncio
    sqlalchemy.ext.asyncio.create_async_engine = MagicMock()
    print("Mocked create_async_engine")
except ImportError:
    print("Could not import sqlalchemy to mock")

try:
    # Try to import app package
    import app
    print("App package file:", app.__file__)
    
    from app.main import app as fastapi_app
    print("FastAPI App imported successfully")
    
    from app.models.models import User, Scan, ScanResult
    print("Models imported successfully")
    
    from app.services.gemini import GeminiService
    print("GeminiService imported successfully")
    
    print("ALL CHECKS PASSED")
    
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
