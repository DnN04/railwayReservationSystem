const db = require('../config/db');

// ── POST /api/admin/add-train ─────────────────────────────────
// Body: { train_code, train_name, source, destination, departure_time,
//         arrival_time, total_seats, fares: [{class, fare}, ...] }
const addTrain = async (req, res) => {
  const {
    train_code, train_name, source, destination,
    departure_time, arrival_time, total_seats, fares,
  } = req.body;

  if (!train_code || !train_name || !source || !destination) {
    return res.status(400).json({ message: 'train_code, train_name, source and destination are required.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Insert TRAIN
    await conn.execute(
      `INSERT INTO TRAIN
         (train_code, train_name, source, destination, departure_time, arrival_time, total_seats)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        train_code, train_name, source, destination,
        departure_time || null, arrival_time || null, total_seats || 100,
      ]
    );

    // Insert TRAIN_FARE rows (if provided)
    if (Array.isArray(fares) && fares.length > 0) {
      for (const { class: cls, fare } of fares) {
        await conn.execute(
          'INSERT INTO TRAIN_FARE (train_code, class, fare) VALUES (?, ?, ?)',
          [train_code, cls, fare]
        );
      }
    }

    await conn.commit();
    return res.status(201).json({ message: `Train ${train_code} added successfully.` });
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: `Train code ${train_code} already exists.` });
    }
    console.error('[addTrain]', err);
    return res.status(500).json({ message: 'Server error adding train.' });
  } finally {
    conn.release();
  }
};

// ── PUT /api/admin/update-train/:train_code ───────────────────
// Body: any subset of { train_name, source, destination,
//                       departure_time, arrival_time, total_seats, fares }
const updateTrain = async (req, res) => {
  const { train_code } = req.params;
  const {
    train_name, source, destination,
    departure_time, arrival_time, total_seats, fares,
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Verify train exists
    const [existing] = await conn.execute(
      'SELECT train_code FROM TRAIN WHERE train_code = ?', [train_code]
    );
    if (existing.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: `Train ${train_code} not found.` });
    }

    // Build dynamic SET clause from provided fields only
    const fields = [];
    const values = [];
    if (train_name)     { fields.push('train_name = ?');     values.push(train_name); }
    if (source)         { fields.push('source = ?');         values.push(source); }
    if (destination)    { fields.push('destination = ?');    values.push(destination); }
    if (departure_time !== undefined) { fields.push('departure_time = ?'); values.push(departure_time); }
    if (arrival_time   !== undefined) { fields.push('arrival_time = ?');   values.push(arrival_time); }
    if (total_seats    !== undefined) { fields.push('total_seats = ?');    values.push(total_seats); }

    if (fields.length > 0) {
      values.push(train_code);
      await conn.execute(
        `UPDATE TRAIN SET ${fields.join(', ')} WHERE train_code = ?`,
        values
      );
    }

    // Update fares if provided — replace existing entries using UPSERT
    if (Array.isArray(fares) && fares.length > 0) {
      for (const { class: cls, fare } of fares) {
        await conn.execute(
          `INSERT INTO TRAIN_FARE (train_code, class, fare) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE fare = ?`,
          [train_code, cls, fare, fare]
        );
      }
    }

    await conn.commit();
    return res.json({ message: `Train ${train_code} updated successfully.` });
  } catch (err) {
    await conn.rollback();
    console.error('[updateTrain]', err);
    return res.status(500).json({ message: 'Server error updating train.' });
  } finally {
    conn.release();
  }
};

// ── DELETE /api/admin/delete-train/:train_code ─────────────────
// CASCADE in schema auto-deletes TRAIN_FARE rows
const deleteTrain = async (req, res) => {
  const { train_code } = req.params;

  try {
    const [result] = await db.execute(
      'DELETE FROM TRAIN WHERE train_code = ?', [train_code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: `Train ${train_code} not found.` });
    }

    return res.json({ message: `Train ${train_code} deleted successfully.` });
  } catch (err) {
    // FK constraint — train has existing bookings
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        message: `Cannot delete train ${train_code} — it has existing reservations.`,
      });
    }
    console.error('[deleteTrain]', err);
    return res.status(500).json({ message: 'Server error deleting train.' });
  }
};

// ── GET /api/admin/all-bookings ────────────────────────────────
// Reads from the BOOKED_TICKETS_VIEW (defined in schema.sql)
// Supports optional filters: ?status=&train_code=&date=
const getAllBookings = async (req, res) => {
  const { status, train_code, date } = req.query;

  try {
    let query = 'SELECT * FROM BOOKED_TICKETS_VIEW WHERE 1 = 1';
    const params = [];

    if (status)     { query += ' AND ticket_status = ?'; params.push(status); }
    if (train_code) { query += ' AND train_code = ?';    params.push(train_code); }
    if (date)       { query += ' AND journey_date = ?';  params.push(date); }

    query += ' ORDER BY booked_at DESC';

    const [bookings] = await db.execute(query, params);
    return res.json({ count: bookings.length, bookings });
  } catch (err) {
    console.error('[getAllBookings]', err);
    return res.status(500).json({ message: 'Server error fetching bookings.' });
  }
};

// ── GET /api/admin/stats ───────────────────────────────────────
// Quick dashboard numbers
const getStats = async (req, res) => {
  try {
    const [[{ total_users }]]    = await db.execute('SELECT COUNT(*) AS total_users    FROM USERS    WHERE role = "user"');
    const [[{ total_trains }]]   = await db.execute('SELECT COUNT(*) AS total_trains   FROM TRAIN');
    const [[{ total_bookings }]] = await db.execute('SELECT COUNT(*) AS total_bookings FROM TICKET_RESERVATION');
    const [[{ total_revenue }]]  = await db.execute('SELECT IFNULL(SUM(amount),0) AS total_revenue FROM PAYMENT WHERE status = "Success"');

    return res.json({ total_users, total_trains, total_bookings, total_revenue });
  } catch (err) {
    console.error('[getStats]', err);
    return res.status(500).json({ message: 'Server error fetching stats.' });
  }
};

module.exports = { addTrain, updateTrain, deleteTrain, getAllBookings, getStats };
