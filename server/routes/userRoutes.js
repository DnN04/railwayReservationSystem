const express = require('express');
const router  = express.Router();
const { protect }                           = require('../middleware/authMiddleware');
const { getTrains, bookTicket, getMyTickets } = require('../controllers/userController');

// ── Public ────────────────────────────────────────────────────
// GET /api/trains?source=Mumbai&destination=Delhi
router.get('/trains', getTrains);

// ── Protected (logged-in users) ───────────────────────────────
// POST /api/book-ticket
router.post('/book-ticket', protect, bookTicket);

// GET /api/my-tickets
router.get('/my-tickets', protect, getMyTickets);

module.exports = router;
