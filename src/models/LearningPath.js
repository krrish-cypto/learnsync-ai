import mongoose from 'mongoose';

const LearningPathSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.LearningPath || mongoose.model('LearningPath', LearningPathSchema);
