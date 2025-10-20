import mongoose from 'mongoose';

const KennelSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },
    maxCapacity: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Kennel', KennelSchema);
