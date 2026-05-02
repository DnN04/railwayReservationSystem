const db = require('../config/db');

// ── GET /api/trains ───────────────────────────────────────────
// Query params: ?source=&destination=&date=
// Returns direct trains and 1-hop connecting trains
const getTrains = async (req, res) => {
  const { source, destination, date } = req.query;

  try {
    // 1. Fetch Direct Trains
    let queryDirect = `
      SELECT t.train_code, t.train_name, t.source, t.destination, t.departure_time, t.arrival_time, t.total_seats, tf.class, tf.fare
      FROM TRAIN t
      LEFT JOIN TRAIN_FARE tf ON t.train_code = tf.train_code
      WHERE 1 = 1
    `;
    const paramsDirect = [];

    if (source) {
      queryDirect += ' AND t.source LIKE ?';
      paramsDirect.push(`%${source}%`);
    }
    if (destination) {
      queryDirect += ' AND t.destination LIKE ?';
      paramsDirect.push(`%${destination}%`);
    }
    queryDirect += ' ORDER BY t.train_code, tf.class';

    const [directRows] = await db.execute(queryDirect, paramsDirect);

    const directMap = {};
    directRows.forEach((row) => {
      if (!directMap[row.train_code]) {
        directMap[row.train_code] = {
          train_code:     row.train_code,
          train_name:     row.train_name,
          source:         row.source,
          destination:    row.destination,
          departure_time: row.departure_time,
          arrival_time:   row.arrival_time,
          total_seats:    row.total_seats,
          journey_date:   date, // Apply the searched date
          fares: {},
        };
      }
      if (row.class) {
        directMap[row.train_code].fares[row.class] = parseFloat(row.fare);
      }
    });

    const directTrains = Object.values(directMap);

    // 2. Fetch Connecting Trains (1-hop)
    let connectingTrains = [];
    if (source && destination) {
      const queryConn = `
        SELECT 
          t1.train_code as t1_code, t1.train_name as t1_name, t1.source as t1_source, t1.destination as t1_dest, t1.departure_time as t1_dep, t1.arrival_time as t1_arr, tf1.class as t1_class, tf1.fare as t1_fare,
          t2.train_code as t2_code, t2.train_name as t2_name, t2.source as t2_source, t2.destination as t2_dest, t2.departure_time as t2_dep, t2.arrival_time as t2_arr, tf2.class as t2_class, tf2.fare as t2_fare
        FROM TRAIN t1
        JOIN TRAIN t2 ON t1.destination = t2.source
        LEFT JOIN TRAIN_FARE tf1 ON t1.train_code = tf1.train_code
        LEFT JOIN TRAIN_FARE tf2 ON t2.train_code = tf2.train_code
        WHERE t1.source LIKE ? AND t2.destination LIKE ?
      `;
      const [connRows] = await db.execute(queryConn, [`%${source}%`, `%${destination}%`]);

      const connMap = {};
      connRows.forEach(row => {
        const pairKey = `${row.t1_code}-${row.t2_code}`;
        if (!connMap[pairKey]) {
          // Calculate dates
          let t1_date = new Date(date);
          let t1_arr_date = new Date(date);
          if (row.t1_arr < row.t1_dep) {
            t1_arr_date.setDate(t1_arr_date.getDate() + 1); // Crosses midnight
          }
          
          let t2_date = new Date(t1_arr_date);
          // If t2 departs before t1 arrives (or within 1 hour buffer), it must be the next day
          let t1_arr_val = parseFloat(row.t1_arr.replace(':', '.'));
          let t2_dep_val = parseFloat(row.t2_dep.replace(':', '.'));
          if (t2_dep_val <= t1_arr_val + 1) { // 1 hr buffer
            t2_date.setDate(t2_date.getDate() + 1);
          }

          connMap[pairKey] = {
            train1: {
              train_code: row.t1_code,
              train_name: row.t1_name,
              source: row.t1_source,
              destination: row.t1_dest,
              departure_time: row.t1_dep,
              arrival_time: row.t1_arr,
              journey_date: t1_date.toISOString().split('T')[0],
              fares: {}
            },
            train2: {
              train_code: row.t2_code,
              train_name: row.t2_name,
              source: row.t2_source,
              destination: row.t2_dest,
              departure_time: row.t2_dep,
              arrival_time: row.t2_arr,
              journey_date: t2_date.toISOString().split('T')[0],
              fares: {}
            },
            hub: row.t1_dest
          };
        }
        if (row.t1_class && row.t1_fare) connMap[pairKey].train1.fares[row.t1_class] = parseFloat(row.t1_fare);
        if (row.t2_class && row.t2_fare) connMap[pairKey].train2.fares[row.t2_class] = parseFloat(row.t2_fare);
      });

      connectingTrains = Object.values(connMap);
    }

    return res.json({ 
      directTrains, 
      connectingTrains,
      // fallback for old frontend versions:
      trains: directTrains 
    });
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
  const { train_code, class: ticketClass, journey_date, passengers, payment } = req.body;

  // Validation
  if (!train_code || !ticketClass || !journey_date || !passengers || !Array.isArray(passengers) || passengers.length === 0 || !payment) {
    return res.status(400).json({ message: 'All booking fields are required.' });
  }
  for (const p of passengers) {
    if (!p.name || !p.age || !p.gender) {
      return res.status(400).json({ message: 'Passenger name, age and gender are required.' });
    }
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

    let totalFare = 0;
    const tickets = [];

    // Loop through passengers
    for (const passenger of passengers) {
      // 2. Insert PASSENGER
      const [paxResult] = await conn.execute(
        'INSERT INTO PASSENGER (name, age, gender) VALUES (?, ?, ?)',
        [passenger.name, passenger.age, passenger.gender]
      );
      const passenger_id = paxResult.insertId;

      // 3. Generate a simple seat number
      const seat_no = `${ticketClass[0]}${Math.floor(Math.random() * 100) + 1}`;

      // 4. Insert TICKET_RESERVATION
      const [resResult] = await conn.execute(
        `INSERT INTO TICKET_RESERVATION
           (user_id, passenger_id, train_code, class, status, journey_date, seat_no)
         VALUES (?, ?, ?, ?, 'Pending', ?, ?)`,
        [user_id, passenger_id, train_code, ticketClass, journey_date, seat_no]
      );
      const pnr_no = resResult.insertId;

      // 5. Insert PAYMENT
      await conn.execute(
        `INSERT INTO PAYMENT (pnr_no, amount, mode, status) VALUES (?, ?, ?, 'Success')`,
        [pnr_no, fare, payment.mode]
      );

      totalFare += fare;
      tickets.push({ pnr_no, seat_no, passenger: passenger.name });
    }

    await conn.commit();

    return res.status(201).json({
      message:  'Tickets booked & confirmed successfully.',
      tickets,
      train_code,
      class:    ticketClass,
      journey_date,
      total_amount: totalFare,
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

// ── POST /api/book-multi ─────────────────────────────────────
// Body: { connections: [{train_code, class, journey_date}], passenger: { name, age, gender }, payment: { mode } }
const bookMultiTicket = async (req, res) => {
  const user_id = req.user.id;
  const { connections, passengers, payment } = req.body;

  if (!connections || connections.length !== 2 || !passengers || !Array.isArray(passengers) || passengers.length === 0 || !payment) {
    return res.status(400).json({ message: 'Invalid multi-booking payload.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    let totalFare = 0;
    const bookedLegs = [];

    // Loop through passengers
    for (const passenger of passengers) {
      // Insert Passenger
      const [paxResult] = await conn.execute(
        'INSERT INTO PASSENGER (name, age, gender) VALUES (?, ?, ?)',
        [passenger.name, passenger.age, passenger.gender]
      );
      const passenger_id = paxResult.insertId;

      // Loop through connections
      for (const leg of connections) {
        // Get Fare
        const [fares] = await conn.execute(
          'SELECT fare FROM TRAIN_FARE WHERE train_code = ? AND class = ?',
          [leg.train_code, leg.class]
        );
        if (fares.length === 0) throw new Error('Train class not found for ' + leg.train_code);
        const fare = parseFloat(fares[0].fare);
        totalFare += fare;

        // Create Reservation
        const seat_no = `${leg.class[0]}${Math.floor(Math.random() * 100) + 1}`;
        const [resResult] = await conn.execute(
          `INSERT INTO TICKET_RESERVATION (user_id, passenger_id, train_code, class, status, journey_date, seat_no)
           VALUES (?, ?, ?, ?, 'Pending', ?, ?)`,
          [user_id, passenger_id, leg.train_code, leg.class, leg.journey_date, seat_no]
        );
        const pnr_no = resResult.insertId;

        // Payment trigger will confirm ticket
        await conn.execute(
          `INSERT INTO PAYMENT (pnr_no, amount, mode, status) VALUES (?, ?, ?, 'Success')`,
          [pnr_no, fare, payment.mode]
        );

        bookedLegs.push({ train_code: leg.train_code, passenger: passenger.name, pnr_no, seat_no, fare });
      }
    }

    await conn.commit();
    return res.status(201).json({
      message: 'Connecting tickets booked successfully.',
      total_amount: totalFare,
      payment_mode: payment.mode,
      legs: bookedLegs
    });

  } catch (err) {
    await conn.rollback();
    console.error('[bookMultiTicket]', err);
    return res.status(500).json({ message: 'Booking failed. ' + err.message });
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

module.exports = { getTrains, bookTicket, bookMultiTicket, getMyTickets };
