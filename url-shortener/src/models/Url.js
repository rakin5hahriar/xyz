import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true, index: true },
  originalUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clicksCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Url', urlSchema);
