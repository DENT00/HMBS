# 👥 HMBS Team Roles & Responsibilities

To ensure the Human Milk Bank System is built efficiently for Sprint 2, our 6-person team is divided into Backend, Frontend, and Hybrid roles. Please stick to your assigned domain to avoid code conflicts.

## ⚙️ The Backend & Database Team
**Members:** Marcus Torralba  & Cezar (Database Lead)
* **Core Tasks:**
  * Manage `server.js`, `db.js`, and all files inside the `backend/` folder.
  * Write SQL queries and ensure the MySQL database (`hmbs_db`) is stable.
  * Build the API routes (e.g., `/api/donors`, `/api/inventory`) that the frontend will call.
  * Handle security, password hashing, and session tokens.
* **Rule:** Only the Backend Team is allowed to modify the database schema or backend logic. 

## 🌉 The Hybrid Developer (Full-Stack Support)
**Member:** Bobe Rowyn/ Cezar/ Marcus
* **Core Tasks:**
  * Act as the "Bridge" between the Frontend and Backend teams.
  * Help the Backend team write route controllers when workload is heavy.
  * Help the Frontend team write the `fetch()` requests in JavaScript to connect the HTML forms to the database.
  * Troubleshoot data flow issues (e.g., "Why isn't the donor data showing up on the dashboard?").

## 🎨 The Frontend UI/UX Team
**Members:** Riel/Raphael/Chedlar
* **Core Tasks:**
  * Manage all files inside the `frontend/html/`, `frontend/css/`, and `frontend/js/` folders.
  * Design the user interface for Donors, Inventory, Dispensing, and Reports based on our SRS Use Case diagram.
  * Ensure the dashboard looks professional, clean, and responsive.
  * Write the client-side JavaScript to capture button clicks and form submissions.
* **Rule:** Do not write any HTML inside the backend files. The Frontend team owns the visual experience.

---