import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  url: { type: mongoose.Schema.Types.ObjectId, ref: 'Url', required: true, index: true },
  ip: String,
  country: String,
  city: String,
  userAgent: String,
  device: String,       // Mobile, Desktop, Tablet
  browser: String,      // Chrome, Firefox, Safari, etc.
  os: String,          // Windows, macOS, Android, iOS, etc.
  referer: String,
  at: { type: Date, default: Date.now }
}, { timestamps: false });

// Add indexes for better query performance
clickSchema.index({ at: -1 });
clickSchema.index({ country: 1 });
clickSchema.index({ device: 1 });
clickSchema.index({ browser: 1 });

export default mongoose.model('Click', clickSchema);
