import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    weight_kg: {
      type: Number,
      min: 0,
    },
    feedingInstructions: {
      type: String,
      default: '',
    },
    medicationInstructions: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Pet', PetSchema);
