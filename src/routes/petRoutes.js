const express = require('express');
const {
  createPet,
  deletePet,
  getPetById,
  getPets,
  updatePet,
} = require('../controllers/petController');
const { mockClientAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(mockClientAuth);

router.route('/').get(getPets).post(createPet);
router.route('/:id').get(requireAdmin, getPetById).put(updatePet).delete(deletePet);

module.exports = router;
