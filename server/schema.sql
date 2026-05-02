-- ============================================================
--  GenZ Railway Reservation System — MySQL Schema
--  Run this in MySQL Workbench BEFORE starting the server
-- ============================================================

CREATE DATABASE IF NOT EXISTS railway_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE railway_db;

-- ── 1. USERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS USERS (
  id         INT           AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  UNIQUE NOT NULL,
  password   VARCHAR(255)  NOT NULL,            -- bcrypt hash
  role       ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ── 2. PASSENGER ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PASSENGER (
  passenger_id INT          AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  age          INT          NOT NULL CHECK (age > 0 AND age < 150),
  gender       ENUM('Male','Female','Other') NOT NULL
);

-- ── 3. TRAIN ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS TRAIN (
  train_code     VARCHAR(20)  PRIMARY KEY,
  train_name     VARCHAR(100) NOT NULL,
  source         VARCHAR(100) NOT NULL,
  destination    VARCHAR(100) NOT NULL,
  departure_time TIME,
  arrival_time   TIME,
  total_seats    INT          NOT NULL DEFAULT 100
);

-- ── 4. TRAIN_FARE ────────────────────────────────────────────
--  Composite PK ensures one fare per class per train
CREATE TABLE IF NOT EXISTS TRAIN_FARE (
  fare_id    INT           AUTO_INCREMENT PRIMARY KEY,
  train_code VARCHAR(20)   NOT NULL,
  class      ENUM('Economy','Business','First') NOT NULL,
  fare       DECIMAL(10,2) NOT NULL CHECK (fare > 0),
  FOREIGN KEY (train_code) REFERENCES TRAIN(train_code)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_train_class (train_code, class)  -- 3NF / BCNF
);

-- ── 5. TICKET_RESERVATION ────────────────────────────────────
CREATE TABLE IF NOT EXISTS TICKET_RESERVATION (
  pnr_no       INT          AUTO_INCREMENT PRIMARY KEY,
  user_id      INT          NOT NULL,
  passenger_id INT,
  train_code   VARCHAR(20)  NOT NULL,
  class        ENUM('Economy','Business','First') NOT NULL DEFAULT 'Economy',
  status       ENUM('Pending','Confirmed','Cancelled') NOT NULL DEFAULT 'Pending',
  journey_date DATE         NOT NULL,
  seat_no      VARCHAR(10),
  booked_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)      REFERENCES USERS(id)      ON DELETE CASCADE,
  FOREIGN KEY (passenger_id) REFERENCES PASSENGER(passenger_id),
  FOREIGN KEY (train_code)   REFERENCES TRAIN(train_code)
);

-- ── 6. PAYMENT ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS PAYMENT (
  payment_id INT           AUTO_INCREMENT PRIMARY KEY,
  pnr_no     INT           UNIQUE NOT NULL,          -- 1:1 with reservation
  amount     DECIMAL(10,2) NOT NULL,
  mode       ENUM('Credit Card','Debit Card','UPI','Net Banking','Neo-Token') NOT NULL,
  status     ENUM('Success','Failed','Pending') NOT NULL DEFAULT 'Pending',
  paid_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pnr_no) REFERENCES TICKET_RESERVATION(pnr_no)
    ON DELETE CASCADE
);

-- ============================================================
--  VIEWS
-- ============================================================

CREATE OR REPLACE VIEW BOOKED_TICKETS_VIEW AS
SELECT
  tr.pnr_no,
  tr.journey_date,
  tr.class,
  tr.status        AS ticket_status,
  tr.seat_no,
  tr.booked_at,
  u.id             AS user_id,
  u.name           AS user_name,
  u.email,
  p.name           AS passenger_name,
  p.age,
  p.gender,
  t.train_code,
  t.train_name,
  t.source,
  t.destination,
  t.departure_time,
  t.arrival_time,
  py.payment_id,
  py.amount,
  py.mode          AS payment_mode,
  py.status        AS payment_status,
  py.paid_at
FROM       TICKET_RESERVATION tr
JOIN       USERS     u  ON tr.user_id      = u.id
LEFT JOIN  PASSENGER p  ON tr.passenger_id = p.passenger_id
JOIN       TRAIN     t  ON tr.train_code   = t.train_code
LEFT JOIN  PAYMENT   py ON tr.pnr_no       = py.pnr_no;

-- ============================================================
--  TRIGGERS
-- ============================================================

DELIMITER $$

-- Trigger 1: Auto-confirm ticket after SUCCESSFUL payment
CREATE TRIGGER after_payment_insert
AFTER INSERT ON PAYMENT
FOR EACH ROW
BEGIN
  IF NEW.status = 'Success' THEN
    UPDATE TICKET_RESERVATION
    SET    status = 'Confirmed'
    WHERE  pnr_no = NEW.pnr_no;
  END IF;
END$$

-- Trigger 2: Reject payment if amount is zero or negative
CREATE TRIGGER before_payment_insert
BEFORE INSERT ON PAYMENT
FOR EACH ROW
BEGIN
  IF NEW.amount <= 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Payment amount must be greater than zero.';
  END IF;
END$$

DELIMITER ;

-- ============================================================
--  SAMPLE DATA
-- ============================================================

-- Default admin account
--   email   : admin@velocityrail.com
--   password: admin123
INSERT IGNORE INTO USERS (name, email, password, role) VALUES
  ('Rail Admin',
   'admin@velocityrail.com',
   '$2a$10$aO2lULrkOh/b3LQEzeDbyOyHYR7IB.uakaNdIKXm8hrB9VgmMU6nq',
   -- plain: admin123 (real bcrypt hash)
   'admin');

-- Sample trains
INSERT IGNORE INTO TRAIN (train_code, train_name, source, destination, departure_time, arrival_time, total_seats) VALUES
  ('KR-101', 'NEO TOKYO EXPRESS',   'Mumbai',    'Delhi',     '06:00:00', '14:00:00', 200),
  ('KR-202', 'ALPINE DOME',         'Delhi',     'Shimla',    '08:00:00', '14:00:00', 150),
  ('KR-303', 'AZURE COAST',         'Chennai',   'Goa',       '07:30:00', '15:30:00', 180),
  ('KR-411', 'KR-411 HYPERLOOP',    'Bangalore', 'Hyderabad', '09:00:00', '13:00:00', 200),
  ('KR-505', 'SILICON SHUTTLE',     'Pune',      'Mumbai',    '07:00:00', '09:00:00', 120);

-- Sample fares
INSERT IGNORE INTO TRAIN_FARE (train_code, class, fare) VALUES
  ('KR-101','Economy',  850.00), ('KR-101','Business', 1500.00), ('KR-101','First', 2500.00),
  ('KR-202','Economy',  500.00), ('KR-202','Business',  900.00), ('KR-202','First', 1500.00),
  ('KR-303','Economy',  650.00), ('KR-303','Business', 1200.00), ('KR-303','First', 2000.00),
  ('KR-411','Economy',  450.00), ('KR-411','Business',  800.00), ('KR-411','First', 1400.00),
  ('KR-505','Economy',  250.00), ('KR-505','Business',  450.00), ('KR-505','First',  750.00);
