import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 });
    }

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, name });

    return NextResponse.json({ success: true, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
