import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import LearningPath from '@/models/LearningPath';
import Milestone from '@/models/Milestone';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    await connectDB();
    const user = await User.findById(userId).lean();
    const path = await LearningPath.findOne({ user_id: userId }).lean();
    
    if (!user || !path) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    const milestones = await Milestone.find({ learning_path_id: path._id }).sort({ display_order: 1 }).lean();

    const completed = milestones.filter(m => m.status === 'completed').length;
    const total = milestones.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    const nextAction = milestones.find(m => m.status === 'in-progress' || m.status === 'locked');
    const recentMilestones = milestones.filter(m => m.status === 'completed').slice(-3).reverse();

    // Map _id to id for frontend compatibility
    const pathMapped = { ...path, id: path._id.toString() };
    const milestonesMapped = milestones.map(m => ({ ...m, id: m._id.toString() }));

    return NextResponse.json({ 
      user: { ...user, id: user._id.toString() }, 
      path: pathMapped, 
      stats: { completed, total, progress }, 
      nextAction: nextAction ? { ...nextAction, id: nextAction._id.toString() } : null, 
      recentMilestones: recentMilestones.map(m => ({ ...m, id: m._id.toString() })), 
      allMilestones: milestonesMapped 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
