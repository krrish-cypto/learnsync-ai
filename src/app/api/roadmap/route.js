import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import LearningPath from '@/models/LearningPath';
import Milestone from '@/models/Milestone';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    await connectDB();
    const path = await LearningPath.findOne({ user_id: userId }).lean();
    if (!path) return NextResponse.json({ error: "No path found" }, { status: 404 });

    const milestones = await Milestone.find({ learning_path_id: path._id }).sort({ display_order: 1 }).lean();

    return NextResponse.json({ 
      path: { ...path, id: path._id.toString() }, 
      milestones: milestones.map(m => ({ ...m, id: m._id.toString() })) 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
