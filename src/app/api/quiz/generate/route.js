import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import LearningPath from '@/models/LearningPath';
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId).lean();
    const path = await LearningPath.findOne({ user_id: userId }).lean();

    if (!user || !path) {
      return NextResponse.json({ error: "User or Learning Path not found" }, { status: 404 });
    }

    // Determine context for the quiz
    const completedMilestones = path.milestones.filter(m => m.status === 'completed');
    
    let contextStr = "";
    if (completedMilestones.length > 0) {
      contextStr = `The user has recently completed learning about: ${completedMilestones.map(m => m.title).join(', ')}.`;
    } else {
      contextStr = `The user is just starting their path: ${path.title}. Their known skills are: ${user.skills?.join(', ') || 'Beginner level'}.`;
    }

    const prompt = `
      You are an expert technical interviewer and AI teacher. Generate a 5-question multiple-choice quiz to test the user's knowledge.
      
      CONTEXT:
      ${contextStr}
      Goal: ${user.goals}
      
      Requirements for the JSON response:
      - Return ONLY a valid JSON array of 5 objects.
      - Each object must match this schema:
        {
          "question": "The question text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswerIndex": 0, // Integer (0 to 3) representing the index of the correct option
          "explanation": "A short sentence explaining why this is the correct answer."
        }
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    const quizData = JSON.parse(text);

    return NextResponse.json({ questions: quizData });

  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
