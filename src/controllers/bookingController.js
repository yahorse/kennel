const Booking = require('../models/Booking');
const Kennel = require('../models/Kennel');

const nightsBetween = (start, end) =>
  Math.ceil((end.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24));

const validateDateRange = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) {
    throw new Error('checkInDate and checkOutDate are required');
  }
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    throw new Error('Invalid date values');
  }
  if (checkIn >= checkOut) {
    throw new Error('checkOutDate must be after checkInDate');
  }

  return { checkIn, checkOut };
};

const calculateTotalPrice = (kennel, petsCount, checkIn, checkOut) => {
  const nights = nightsBetween(new Date(checkIn), new Date(checkOut));
  return nights * kennel.pricePerNight * petsCount;
};

const listBookings = async (req, res, next) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { client: req.user._id };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('pets')
      .populate('kennelType')
      .sort('-checkInDate');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const createBooking = async (req, res, next) => {
  try {
    const { pets = [], kennelType, checkInDate, checkOutDate } = req.body;

    if (!Array.isArray(pets) || pets.length === 0) {
      res.status(400);
      throw new Error('At least one pet must be selected');
    }

    const { checkIn, checkOut } = validateDateRange(checkInDate, checkOutDate);

    const kennel = await Kennel.findById(kennelType);
    if (!kennel) {
      res.status(404);
      throw new Error('Selected kennel type not found');
    }

    const overlapping = await Booking.aggregate([
      {
        $match: {
          kennelType: kennel._id,
          status: { $in: ['Pending', 'Confirmed'] },
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn },
        },
      },
      {
        $group: {
          _id: null,
          bookedUnits: { $sum: { $size: '$pets' } },
        },
      },
    ]);

    const bookedUnits = overlapping[0]?.bookedUnits ?? 0;
    const availableUnits = kennel.maxCapacity - bookedUnits;

    if (availableUnits < pets.length) {
      res.status(400);
      throw new Error('Not enough availability for the selected kennel type');
    }

    const totalPrice = calculateTotalPrice(kennel, pets.length, checkIn, checkOut);

    const booking = await Booking.create({
      client: req.user._id,
      pets,
      kennelType,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
    });

    const populated = await booking.populate(['pets', 'kennelType']);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate(['pets', 'kennelType']);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

const currentRoster = async (req, res, next) => {
  try {
    const today = new Date();
    const bookings = await Booking.find({
      status: 'Confirmed',
      checkInDate: { $lte: today },
      checkOutDate: { $gt: today },
    })
      .populate('pets')
      .populate('client')
      .populate('kennelType');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listBookings,
  createBooking,
  updateBookingStatus,
  currentRoster,
};
