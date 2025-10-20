const express = require('express');
const {
  createKennel,
  deleteKennel,
  getAvailability,
  getKennels,
  updateKennel,
} = require('../controllers/kennelController');
const { mockClientAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(mockClientAuth);

router.get('/availability', getAvailability);
router.route('/').get(getKennels).post(requireAdmin, createKennel);
router.route('/:id').put(requireAdmin, updateKennel).delete(requireAdmin, deleteKennel);

module.exports = router;
