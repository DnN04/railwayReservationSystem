# Rail Bandhu (GenZ Railway Reservation System) - Technical Overview

This document explains the technical architecture of the Rail Bandhu project, with a deep dive into the Database Management System (DBMS) aspects. Use this guide to prepare for teacher cross-questions during your project defense.

## 1. System Architecture overview
The project follows a classic **3-Tier Architecture**:
1. **Presentation Tier (Frontend):** Handles the user interface, routing, and user interactions.
2. **Application Tier (Backend):** Contains the business logic, handles API requests, authenticates users, and communicates with the database.
3. **Data Tier (Database):** Stores all persistent data reliably using a Relational Database Management System (RDBMS).

---

## 2. Frontend Technologies
- **React.js:** A component-based JavaScript library used to build the single-page application (SPA). This ensures there are no page reloads when navigating, making the app feel incredibly fast.
- **Tailwind CSS:** A utility-first CSS framework used for rapid UI styling, ensuring a modern, responsive, and consistent dark-mode aesthetic.
- **Framer Motion:** A React animation library used for smooth, professional transitions and micro-interactions (e.g., page transitions, hover effects).
- **Vite:** The build tool used instead of Create React App, providing faster server starts and lightning-fast Hot Module Replacement (HMR).
- **React Router:** Used for managing navigation between different pages (`/login`, `/dashboard`, `/search`, etc.) on the client-side.
- **Leaflet / React-Leaflet:** Used for the simulated Live Tracking map.

---

## 3. Backend Technologies
- **Node.js:** The JavaScript runtime that executes the server-side code.
- **Express.js:** A minimal and flexible Node.js web application framework used to build the RESTful APIs (e.g., `/api/auth/login`, `/api/trains`).
- **MySQL2:** The Node.js driver used to connect the backend server to the MySQL database.
- **JSON Web Tokens (JWT):** Used for stateless authentication. When a user logs in, they receive a token. They send this token in the header of subsequent requests to prove they are authenticated.
- **Bcrypt.js:** A password-hashing function used to securely store user passwords in the database. Passwords are *never* stored in plain text.

---

## 4. Deep Dive: The Database (MySQL)

Since this is a DBMS project, the database design is the most critical part.

### A. Tables and Normalization
The database is named `railway_db` and contains 6 main tables. The design is normalized to **3NF (Third Normal Form) / BCNF (Boyce-Codd Normal Form)** to reduce data redundancy and prevent update anomalies.

1. **USERS:** Stores user accounts (`id`, `name`, `email`, `password`, `role`).
   - *Key Concept:* `password` is hashed. `role` is an `ENUM` to distinguish between 'user' and 'admin'.
2. **PASSENGER:** Stores details of the actual travelers (`passenger_id`, `name`, `age`, `gender`).
   - *Key Concept:* Separated from `USERS` because one user (booking agent) can book tickets for multiple different passengers.
3. **TRAIN:** Stores train schedule information (`train_code`, `train_name`, `source`, `destination`, `departure_time`, `arrival_time`).
   - *Key Concept:* `train_code` is the Primary Key.
4. **TRAIN_FARE:** Stores the pricing for different classes on a train.
   - *Key Concept:* Uses a Composite Unique Key (`train_code`, `class`) to ensure there is only one specific fare per class per train. This explicitly satisfies 3NF.
5. **TICKET_RESERVATION:** The core transaction table (`pnr_no`, `user_id`, `passenger_id`, `train_code`, `status`).
   - *Key Concept:* Acts as a junction table connecting Users, Passengers, and Trains via Foreign Keys.
6. **PAYMENT:** Stores payment transaction details (`payment_id`, `pnr_no`, `amount`, `status`).
   - *Key Concept:* Has a 1:1 relationship with `TICKET_RESERVATION` because one `pnr_no` corresponds to one payment.

### B. Relational Integrity (Foreign Keys)
Foreign Keys ensure **Referential Integrity**. For example, in the `TICKET_RESERVATION` table, `user_id` MUST exist in the `USERS` table.
- We use `ON DELETE CASCADE` in places like `PAYMENT`. If a `TICKET_RESERVATION` is deleted, the corresponding `PAYMENT` record is automatically deleted to prevent orphaned records.

### C. Advanced DBMS Concepts Implemented

#### 1. SQL Views
**Implementation:** `BOOKED_TICKETS_VIEW`
- **What it does:** A View is a virtual table based on the result-set of an SQL statement. We created a view that `JOIN`s 5 tables (`TICKET_RESERVATION`, `USERS`, `PASSENGER`, `TRAIN`, `PAYMENT`) into one massive readable table.
- **Why we used it:** It abstracts the complexity. When the backend or admin dashboard needs to see full ticket details, it queries the `VIEW` instead of writing a massive 5-table `JOIN` every single time.

#### 2. SQL Triggers
**Implementation 1: `after_payment_insert`**
- **What it does:** This is an `AFTER INSERT` trigger on the `PAYMENT` table. If a new payment is inserted and its status is 'Success', it automatically updates the `TICKET_RESERVATION` table to change the ticket status from 'Pending' to 'Confirmed'.
- **Why we used it:** Automates business logic at the database level, ensuring data consistency without relying entirely on the backend code.

**Implementation 2: `before_payment_insert`**
- **What it does:** A `BEFORE INSERT` trigger that checks if the payment amount is `<= 0`. If it is, it throws an SQL Error (Signal SQLSTATE '45000').
- **Why we used it:** Enforces strict domain constraints at the database level to prevent invalid or malicious data from ever being written.

---

## 5. Potential Teacher Cross-Questions & Answers

> **Q1: Why did you use MySQL instead of MongoDB for this project?**
> **Answer:** Railway reservation systems require strict ACID (Atomicity, Consistency, Isolation, Durability) properties and structured relationships. A relational database like MySQL ensures referential integrity (e.g., you cannot book a ticket for a train that doesn't exist) and supports complex multi-table JOINs, which are essential for processing tickets and payments reliably.

> **Q2: What is Normalization and what normal form is your database in?**
> **Answer:** Normalization is the process of organizing data to minimize redundancy. Our database is in **3NF / BCNF**. For example, we separated `TRAIN` and `TRAIN_FARE`. If we kept fare in the `TRAIN` table, we would have to repeat the train's source and destination for every class (Economy, Business), which is redundant.

> **Q3: How do you handle passwords securely?**
> **Answer:** Passwords are never stored in plain text. When a user registers, the Node.js backend uses `bcrypt.js` to hash the password before inserting it into the MySQL database. When logging in, we hash the provided password and compare the hashes.

> **Q4: Explain the difference between a Trigger and a Stored Procedure. Which did you use?**
> **Answer:** A Stored Procedure is a block of code you call explicitly when needed. A Trigger is a block of code that executes *automatically* when a specific event (INSERT, UPDATE, DELETE) occurs on a table. We used **Triggers**, such as the `after_payment_insert` trigger, to automatically confirm a ticket when a successful payment is recorded.

> **Q5: How does your frontend communicate with your database?**
> **Answer:** The frontend (React) NEVER communicates directly with the database for security reasons. It sends HTTP requests (using Axios or Fetch) to our Backend (Node.js/Express). The backend validates the request, checks the JWT for authorization, and then the backend executes the SQL queries using the `mysql2` driver to interact with the MySQL database.

> **Q6: Why is there a separate PASSENGER and USERS table?**
> **Answer:** To support real-world scenarios. A User is the account holder (the person logging in and paying). A Passenger is the person traveling. One User might book 4 tickets for their family members (4 Passengers). Keeping them separate prevents us from having to create an account for a 10-year-old child traveling with their parents.
