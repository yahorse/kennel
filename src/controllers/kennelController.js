const Kennel = require('../models/Kennel');
const Booking = require('../models/Booking');

const parseDate = (value, fallback) => {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
};

const getKennels = async (req, res, next) => {
  try {
    const kennels = await Kennel.find().sort('type');
    res.json(kennels);
  } catch (error) {
    next(error);
  }
};

const createKennel = async (req, res, next) => {
  try {
    const kennel = await Kennel.create(req.body);
    res.status(201).json(kennel);
  } catch (error) {
    next(error);
  }
};

const updateKennel = async (req, res, next) => {
  try {
    const kennel = await Kennel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!kennel) {
      res.status(404);
      throw new Error('Kennel not found');
    }
    res.json(kennel);
  } catch (error) {
    next(error);
  }
};

const deleteKennel = async (req, res, next) => {
  try {
    const kennel = await Kennel.findByIdAndDelete(req.params.id);
    if (!kennel) {
      res.status(404);
      throw new Error('Kennel not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut, petCount } = req.query;

    if (!checkIn || !checkOut) {
      res.status(400);
      throw new Error('checkIn and checkOut query params are required');
    }

    const startDate = parseDate(checkIn);
    const endDate = parseDate(checkOut);

    if (!startDate || !endDate || startDate >= endDate) {
      res.status(400);
      throw new Error('Invalid date range');
    }

    const petTotal = Number.parseInt(petCount ?? '1', 10);
    if (Number.isNaN(petTotal) || petTotal <= 0) {
      res.status(400);
      throw new Error('petCount must be a positive integer');
    }

    const bookings = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['Pending', 'Confirmed'] },
          checkInDate: { $lt: endDate },
          checkOutDate: { $gt: startDate },
        },
      },
      {
        $group: {
          _id: '$kennelType',
          bookedUnits: { $sum: { $size: '$pets' } },
        },
      },
    ]);

    const bookingMap = bookings.reduce((acc, item) => {
      acc[item._id.toString()] = item.bookedUnits;
      return acc;
    }, {});

    const kennels = await Kennel.find();

    const result = kennels.map((kennel) => {
      const totalCapacity = kennel.maxCapacity;
      const bookedUnits = bookingMap[kennel._id.toString()] ?? 0;
      const availableUnits = Math.max(totalCapacity - bookedUnits, 0);
      return {
        kennelId: kennel._id,
        type: kennel.type,
        pricePerNight: kennel.pricePerNight,
        maxCapacity: totalCapacity,
        bookedUnits,
        availableUnits,
        canAccommodate: availableUnits >= petTotal,
      };
    });

    res.json({
      startDate,
      endDate,
      petCount: petTotal,
      kennels: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getKennels,
  createKennel,
  updateKennel,
  deleteKennel,
  getAvailability,
};
