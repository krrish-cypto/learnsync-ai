import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  interests: { type: String },
  experience: { type: String },
  goals: { type: String },
  level: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
