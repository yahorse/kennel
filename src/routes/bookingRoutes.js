const express = require('express');
const {
  createBooking,
  currentRoster,
  listBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { mockClientAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(mockClientAuth);

router.route('/').get(listBookings).post(createBooking);
router.get('/current', requireAdmin, currentRoster);
router.put('/:id/status', requireAdmin, updateBookingStatus);

module.exports = router;
