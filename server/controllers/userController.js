const db = require('../config/db');

// ── GET /api/trains ───────────────────────────────────────────
// Query params: ?source=&destination=
// Joins TRAIN + TRAIN_FARE to return fares per class alongside each train
const getTrains = async (req, res) => {
  const { source, destination } = req.query;

  try {
    let query = `
      SELECT
        t.train_code,
        t.train_name,
        t.source,
        t.destination,
        t.departure_time,
        t.arrival_time,
        t.total_seats,
        tf.class,
        tf.fare
      FROM TRAIN t
      LEFT JOIN TRAIN_FARE tf ON t.train_code = tf.train_code
      WHERE 1 = 1
    `;
    const params = [];

    if (source) {
      query += ' AND t.source LIKE ?';
      params.push(`%${source}%`);
    }
    if (destination) {
      query += ' AND t.destination LIKE ?';
      params.push(`%${destination}%`);
    }

    query += ' ORDER BY t.train_code, tf.class';

    const [rows] = await db.execute(query, params);

    // Group fares under each train object
    const trainMap = {};
    rows.forEach((row) => {
      if (!trainMap[row.train_code]) {
        trainMap[row.train_code] = {
          train_code:     row.train_code,
          train_name:     row.train_name,
          source:         row.source,
          destination:    row.destination,
          departure_time: row.departure_time,
          arrival_time:   row.arrival_time,
          total_seats:    row.total_seats,
          fares: {},
        };
      }
      if (row.class) {
        trainMap[row.train_code].fares[row.class] = parseFloat(row.fare);
      }
    });

    const trains = Object.values(trainMap);
    return res.json({ count: trains.length, trains });
  } catch (err) {
    console.error('[getTrains]', err);
    return res.status(500).json({ message: 'Server error fetching trains.' });
  }
};

// ── POST /api/book-ticket ─────────────────────────────────────
// Body: { train_code, class, journey_date, passenger: { name, age, gender }, payment: { mode } }
// Uses a transaction: PASSENGER → TICKET_RESERVATION → PAYMENT
// Trigger auto-confirms ticket when PAYMENT.status = 'Success'
const bookTicket = async (req, res) => {
  const user_id = req.user.id;
  const { train_code, class: ticketClass, journey_date, passenger, payment } = req.body;

  // Validation
  if (!train_code || !ticketClass || !journey_date || !passenger || !payment) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }
  if (!passenger.name || !passenger.age || !passenger.gender) {
    return res.status(400).json({ message: 'Passenger name, age and gender are required.' });
  }
  if (!payment.mode) {
    return res.status(400).json({ message: 'Payment mode is required.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Verify the train + class exists and fetch fare
    const [fares] = await conn.execute(
      'SELECT fare FROM TRAIN_FARE WHERE train_code = ? AND class = ?',
      [train_code, ticketClass]
    );
    if (fares.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Train or class not found.' });
    }
    const fare = parseFloat(fares[0].fare);

    // 2. Insert PASSENGER
    const [paxResult] = await conn.execute(
      'INSERT INTO PASSENGER (name, age, gender) VALUES (?, ?, ?)',
      [passenger.name, passenger.age, passenger.gender]
    );
    const passenger_id = paxResult.insertId;

    // 3. Generate a simple seat number
    const seat_no = `${ticketClass[0]}${Math.floor(Math.random() * 100) + 1}`;

    // 4. Insert TICKET_RESERVATION (status starts as 'Pending')
    const [resResult] = await conn.execute(
      `INSERT INTO TICKET_RESERVATION
         (user_id, passenger_id, train_code, class, status, journey_date, seat_no)
       VALUES (?, ?, ?, ?, 'Pending', ?, ?)`,
      [user_id, passenger_id, train_code, ticketClass, journey_date, seat_no]
    );
    const pnr_no = resResult.insertId;

    // 5. Insert PAYMENT with status='Success'
    //    → TRIGGER after_payment_insert fires and sets TICKET_RESERVATION.status = 'Confirmed'
    await conn.execute(
      `INSERT INTO PAYMENT (pnr_no, amount, mode, status) VALUES (?, ?, ?, 'Success')`,
      [pnr_no, fare, payment.mode]
    );

    await conn.commit();

    return res.status(201).json({
      message:  'Ticket booked & confirmed successfully.',
      pnr_no,
      seat_no,
      train_code,
      class:    ticketClass,
      journey_date,
      passenger: passenger.name,
      amount:   fare,
      payment_mode: payment.mode,
    });
  } catch (err) {
    await conn.rollback();
    console.error('[bookTicket]', err);
    return res.status(500).json({ message: 'Booking failed. Please try again.' });
  } finally {
    conn.release();
  }
};

// ── GET /api/my-tickets ───────────────────────────────────────
// Returns all reservations for the logged-in user
// Joins: TICKET_RESERVATION → TRAIN, PASSENGER, PAYMENT
const getMyTickets = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [tickets] = await db.execute(
      `SELECT
         tr.pnr_no,
         tr.journey_date,
         tr.class,
         tr.status          AS ticket_status,
         tr.seat_no,
         tr.booked_at,
         t.train_code,
         t.train_name,
         t.source,
         t.destination,
         t.departure_time,
         t.arrival_time,
         p.name             AS passenger_name,
         p.age,
         p.gender,
         py.amount,
         py.mode            AS payment_mode,
         py.status          AS payment_status,
         py.paid_at
       FROM   TICKET_RESERVATION tr
       JOIN   TRAIN              t  ON tr.train_code   = t.train_code
       LEFT JOIN PASSENGER       p  ON tr.passenger_id = p.passenger_id
       LEFT JOIN PAYMENT         py ON tr.pnr_no       = py.pnr_no
       WHERE  tr.user_id = ?
       ORDER  BY tr.booked_at DESC`,
      [user_id]
    );

    return res.json({ count: tickets.length, tickets });
  } catch (err) {
    console.error('[getMyTickets]', err);
    return res.status(500).json({ message: 'Server error fetching tickets.' });
  }
};

module.exports = { getTrains, bookTicket, getMyTickets };
