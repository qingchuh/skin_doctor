import asyncio
import os
from app.services.gemini import GeminiService
from dotenv import load_dotenv

# Load env vars
load_dotenv()

import pytest

@pytest.mark.asyncio
async def test_analysis():
    print("Initializing Gemini Service...")
    service = GeminiService()
    
    image_path = "tests/test_images/test_face.jpg"
    if not os.path.exists(image_path):
        print(f"❌ Test image not found at {image_path}")
        return

    print(f"Reading image from {image_path}...")
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    print("Sending request to Gemini (this may take a few seconds)...")
    try:
        result = await service.analyze_skin(image_bytes)
        
        print("\n✅ Analysis Successful!")
        print(f"Summary: {result.summary}")
        print(f"Issues Found: {len(result.issues)}")
        
        for i, issue in enumerate(result.issues):
            print(f"\n--- Issue {i+1}: {issue.type} ---")
            print(f"Severity: {issue.severity}")
            print(f"Timeframe: {issue.timeframe}")
            print(f"Location Area: {issue.location_area}")
            print(f"Routine AM: {issue.recommendation.am}")
            print(f"Routine PM: {issue.recommendation.pm}")
            print("Products:")
            for prod in issue.recommendation.products:
                print(f"  - {prod.name} ({prod.price_tier})")

    except Exception as e:
        print(f"\n❌ Analysis Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_analysis())
