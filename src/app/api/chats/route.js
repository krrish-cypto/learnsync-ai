import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Chat from '@/models/Chat';
import ChatMessage from '@/models/ChatMessage';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    await connectDB();
    const chats = await Chat.find({ user_id: userId }).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ 
      chats: chats.map(c => ({ id: c._id.toString(), title: c.title, created_at: c.createdAt })) 
    });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, title } = await req.json();
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    await connectDB();
    
    const newChat = await Chat.create({ user_id: userId, title: title || "New Chat" });
    
    // Insert initial AI greeting
    const initialContent = "Hi! I'm your AI Learning Assistant. You can tell me about your career goals, ask why a specific course was recommended, or request YouTube tutorials. How can I help?";
    await ChatMessage.create({
      chat_id: newChat._id,
      role: 'ai',
      content: initialContent
    });

    return NextResponse.json({ success: true, chatId: newChat._id.toString() });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    if (!chatId) return NextResponse.json({ error: "Missing chatId" }, { status: 400 });

    await connectDB();
    await ChatMessage.deleteMany({ chat_id: chatId });
    await Chat.findByIdAndDelete(chatId);

    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
