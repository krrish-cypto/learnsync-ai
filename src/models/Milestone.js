import mongoose from 'mongoose';

const MilestoneSchema = new mongoose.Schema({
  learning_path_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
  title: { type: String, required: true },
  type: { type: String },
  status: { type: String, default: 'locked' },
  description: { type: String },
  aiNote: { type: String },
  display_order: { type: Number },
  resourceUrl: { type: String },
  estimatedTime: { type: String }
}, { timestamps: true });

export default mongoose.models.Milestone || mongoose.model('Milestone', MilestoneSchema);
