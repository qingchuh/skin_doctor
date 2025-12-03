import google.generativeai as genai
from app.core.config import settings
from app.schemas.schemas import SkinAnalysisResponse
import json

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    async def analyze_skin(self, image_bytes: bytes) -> SkinAnalysisResponse:
        """
        Analyzes the image using Gemini with a specific system prompt and strict JSON output.
        """
        
        prompt = """
        Analyze this face for skin issues, specifically looking for ACNE, pimples, and blemishes. Identify specific locations. 
        Return the result in strict JSON format.
        
        For each issue, you MUST provide ALL of the following fields:
        - type: Must be one of "Acne", "Dark Spot", "Wrinkles", "Texture", "Redness", "Pores", "Eye Bags".
        - severity: The severity of the issue.
        - timeframe: Estimated time to heal.
        - location_area: Must be one of "Forehead", "Nose", "Chin", "Left Cheek", "Right Cheek", "Under Eyes".
        - recommendation: Object containing "am", "pm", and "products" list.
        - products: List of objects. Each object MUST have: "name", "price_tier", "link_query". DO NOT return simple strings.

        Example JSON Structure:
        {
          "issues": [
            {
              "type": "Acne",
              "severity": "Moderate",
              "timeframe": "2 weeks",
              "location_area": "Forehead",
              "recommendation": {
                "am": "Cleanse",
                "pm": "Treat",
                "products": []
              }
            }
          ],
          "summary": "Found 1 issue."
        }
        """

        try:
            generation_config = genai.GenerationConfig(
                max_output_tokens=8192,
                temperature=0.1
            )

            response = self.model.generate_content(
                [prompt, {"mime_type": "image/jpeg", "data": image_bytes}],
                generation_config=generation_config
            )
            
            try:
                # Clean response text (remove markdown code blocks if present)
                cleaned_text = response.text.strip()
                if cleaned_text.startswith("```"):
                    cleaned_text = cleaned_text.replace("```json", "").replace("```", "").strip()
                
                print(f"DEBUG: Finish Reason: {response.candidates[0].finish_reason}", flush=True)
                print(f"DEBUG: Response length: {len(cleaned_text)}", flush=True)

                result_json = json.loads(cleaned_text)
                return SkinAnalysisResponse(**result_json)
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error. Raw response: {response.text}", flush=True)
                raise e

        except Exception as e:
            print(f"Error calling Gemini: {e}")
            # In a real production app, we might want to re-raise or return a specific error
            raise e
