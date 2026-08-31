import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Milestone from '@/models/Milestone';

export async function POST(req) {
  try {
    const { milestoneId, pathId } = await req.json();
    
    if (!milestoneId || !pathId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Mark current as completed
    await Milestone.findByIdAndUpdate(milestoneId, { status: 'completed' });
    
    // Find the next locked one and unlock it
    const milestones = await Milestone.find({ learning_path_id: pathId }).sort({ display_order: 1 });
    const nextLocked = milestones.find(m => m.status === 'locked');
    if (nextLocked) {
      await Milestone.findByIdAndUpdate(nextLocked._id, { status: 'in-progress' });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Milestone update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
