import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    await connectDB();
    const user = await User.findById(userId).select('-password').lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const data = await req.json();
    const { userId, name, college, degree, graduationYear, skills, bio, linkedin, github } = data;
    if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    await connectDB();
    const updated = await User.findByIdAndUpdate(userId, {
      name,
      college,
      degree,
      graduationYear,
      skills: skills || [],
      bio,
      linkedin,
      github
    }, { new: true }).select('-password').lean();

    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, user: updated });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
