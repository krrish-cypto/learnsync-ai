import { GoogleGenAI } from '@google/genai';

const FALLBACK_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.6-pro',
  'local-mock-model' // Ultimate fallback to prevent the app from freezing
];

export async function generateWithFallback(prompt, config = {}) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  let lastError = null;

  for (const model of FALLBACK_MODELS) {
    try {
      console.log(`[Gemini] Attempting generation with model: ${model}`);
      
      const payload = {
        model: model,
        contents: prompt
      };
      if (Object.keys(config).length > 0) {
        payload.config = config;
      }

      let response;
      
      if (model === 'local-mock-model') {
        console.log(`[Gemini] Using local mock fallback due to rate limits`);
        // If it's a JSON request (like Onboarding)
        if (config.responseMimeType === 'application/json') {
          response = {
            text: JSON.stringify([
              { title: "Introduction to the Basics", type: "Course", description: "Learn the fundamentals.", aiNote: "Essential for beginners.", resourceUrl: "https://youtube.com", estimatedTime: "1 Week" },
              { title: "Build your first project", type: "Project", description: "Apply what you've learned.", aiNote: "Hands-on experience.", resourceUrl: "https://github.com", estimatedTime: "2 Weeks" }
            ])
          };
        } else {
          response = {
            text: "I apologize, but the AI API servers have hit their daily quota limit for this environment. \n\n*This is a fallback simulated response so you can continue testing the user interface and app flow without getting stuck.*"
          };
        }
      } else {
        response = await ai.models.generateContent(payload);
      }
      
      console.log(`[Gemini] Success using model: ${model}`);
      return response;
    } catch (err) {
      console.warn(`[Gemini] Model ${model} failed: ${err.message}`);
      lastError = err;
      // Continue to the next fallback model
    }
  }

  throw new Error(`All Gemini fallback models failed. Last error: ${lastError.message}`);
}
