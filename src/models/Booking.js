import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    pets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
      },
    ],
    kennelType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Kennel',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return this.checkInDate < value;
        },
        message: 'Check-out date must be after check-in date.',
      },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Pending',
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

BookingSchema.index(
  { kennelType: 1, checkInDate: 1, checkOutDate: 1 },
  { background: true }
);

export default mongoose.model('Booking', BookingSchema);
