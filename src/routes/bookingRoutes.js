import express from 'express';
import {
  createBooking,
  currentRoster,
  listBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { mockClientAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(mockClientAuth);

router.route('/').get(listBookings).post(createBooking);
router.get('/current', requireAdmin, currentRoster);
router.put('/:id/status', requireAdmin, updateBookingStatus);

export default router;
