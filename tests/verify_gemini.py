import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env directly to be sure
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing API Key: {api_key[:10]}...{api_key[-5:] if api_key else 'None'}")

if not api_key:
    print("❌ No API Key found in environment variables.")
    exit(1)

try:
    genai.configure(api_key=api_key)
    print("✅ Configuration successful.")
    
    print("Attempting to list models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - {m.name}")
        
    print("\nAttempting simple generation...")
    model = genai.GenerativeModel('gemini-2.0-flash')
    response = model.generate_content("Hello, are you working?")
    print(f"✅ Generation successful: {response.text}")
    
except Exception as e:
    print(f"❌ API Key Verification Failed: {e}")
    exit(1)
