import express from 'express';
import {
  createPet,
  deletePet,
  getPetById,
  getPets,
  updatePet,
} from '../controllers/petController.js';
import { mockClientAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(mockClientAuth);

router.route('/').get(getPets).post(createPet);
router.route('/:id').get(requireAdmin, getPetById).put(updatePet).delete(deletePet);

export default router;
