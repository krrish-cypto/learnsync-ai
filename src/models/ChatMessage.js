import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  role: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
