const express = require('express');
const router  = express.Router();
const { protect, adminOnly }                                     = require('../middleware/authMiddleware');
const { addTrain, updateTrain, deleteTrain, getAllBookings, getStats } = require('../controllers/adminController');

// All admin routes are protected + require admin role
router.use(protect, adminOnly);

// GET  /api/admin/stats
router.get('/stats', getStats);

// GET  /api/admin/all-bookings?status=&train_code=&date=
router.get('/all-bookings', getAllBookings);

// POST /api/admin/add-train
router.post('/add-train', addTrain);

// PUT  /api/admin/update-train/:train_code
router.put('/update-train/:train_code', updateTrain);

// DELETE /api/admin/delete-train/:train_code
router.delete('/delete-train/:train_code', deleteTrain);

module.exports = router;
