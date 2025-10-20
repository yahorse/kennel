import express from 'express';
import {
  createKennel,
  deleteKennel,
  getAvailability,
  getKennels,
  updateKennel,
} from '../controllers/kennelController.js';
import { mockClientAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(mockClientAuth);

router.get('/availability', getAvailability);
router.route('/').get(getKennels).post(requireAdmin, createKennel);
router.route('/:id').put(requireAdmin, updateKennel).delete(requireAdmin, deleteKennel);

export default router;
