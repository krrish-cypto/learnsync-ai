import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/geminiFallback';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import LearningPath from '@/models/LearningPath';
import ChatMessage from '@/models/ChatMessage';
import Chat from '@/models/Chat';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    if (!chatId) return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

    await connectDB();
    const messages = await ChatMessage.find({ chat_id: chatId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json({ messages });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { messages, userId, chatId, isRetry } = data;
    
    if (!chatId) return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

    const userMessage = messages[messages.length - 1].content;
    
    await connectDB();

    if (!isRetry) {
      await ChatMessage.create({
        chat_id: chatId,
        role: 'user',
        content: userMessage
      });
    }

    let userContext = "No specific user profile loaded.";
    let pathContext = "No roadmap generated.";

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ error: "Invalid session. Please click Logout in the sidebar and log in again to sync with the new database." }, { status: 400 });
      }
      const user = await User.findById(userId).lean();
      const path = await LearningPath.findOne({ user_id: userId }).lean();
      
      if (user && path) {
        userContext = `User Profile: Level ${user.level}. Goals: ${user.goals}. Interests: ${user.interests}`;
        pathContext = `Learning Path: ${path.title}. ${path.description}`;
      }
    }

    const prompt = `
      You are an AI learning assistant for the LearnSync platform. The user is asking about their learning path or general software development topics.
      
      --- USER CONTEXT ---
      ${userContext}
      
      --- THEIR CURRENT ROADMAP ---
      ${pathContext}
      
      User Message: ${userMessage}
      
      Respond helpfully, concisely, and use the provided context to give hyper-personalized advice!
      IMPORTANT: If the user asks for courses, tutorials, or projects, ALWAYS provide specific, clickable real URLs (e.g., https://youtube.com/results?search_query=...) formatted properly in Markdown.
    `;

    const response = await generateWithFallback(prompt);

    const replyText = response.text;

    await ChatMessage.create({
      chat_id: chatId,
      role: 'ai',
      content: replyText
    });

    return NextResponse.json({ success: true, reply: replyText });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
