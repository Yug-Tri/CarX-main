# CarX - Car Rental Agency Management System

> **A modern, responsive, enterprise-grade vehicle rental and fleet management web application.**  
> Built with **pure Vanilla HTML5, CSS3, and ES6+ JavaScript** (Zero Frameworks, Zero Build Pipelines, Zero Node.js Backends). Runs entirely frontend-only in any modern web browser out-of-the-box.

---

## 🌟 Highlights & Architecture

- **Strict Vanilla Stack**: Built without React, Vue, Angular, or Tailwind build tooling. Cleanly separated into standalone `index.html`, `styles.css`, and `app.js`.
- **Dual-Tier Client-Side Persistence**:
  - **Main Database (`localStorage`)**: Stores registered rental agencies, complete vehicle fleet registry with RC numbers, driver rosters, customer reservations, KYC documentation records, and customer reviews. Pre-seeded automatically on first launch.
  - **Active Session Cache (`sessionStorage`)**: Stores transient authentication tokens (`CRX-SEC-...`) and active session profiles. Automatically verifies cache on app initialization to restore active workflows without re-authenticating.
- **Single Page Application (SPA)**: Zero page reloads with seamless DOM state rendering across all Customer and Agency Manager views.
- **Modern Automotive UI/UX**: Deep slate dark theme (`#0f172a`), clean card surfaces, electric blue accent actions (`#2563eb`), emerald green verified/available badges (`#10b981`), and amber/rose warning states.
- **Printable Boarding Pass / Ticket**: High-fidelity digital receipt with QR code representation and print-optimized media queries (`@media print`).

---

## 🚀 Key Modules & Functional Workflows

### 1. User & Agency Authentication Gateway
- **Role Switcher**: Instant switching between **Customer (User)** and **Agency Manager**.
- **Dual Authentication**: Standard Email/Password authentication + **Continue with Gmail / Simulated Google OAuth**.
- **Cache Memory Check (`sessionStorage`)**: On app load, the system probes `sessionStorage` for active session tokens. If validated, the user is immediately routed to their designated dashboard.
- **1-Click Demo Login Bar**: Instant test buttons at the top of the interface for evaluating both customer and agency roles.
- **Database Reset**: Dedicated button to reset `localStorage` to initial seed data at any time.

### 2. Customer Portal (CarX User Experience)
- **Top Navigation Bar & Hub**: Persistent dashboard header with real-time session token status and quick navigation across 5 core workflows.
- **Workflow 1: Browse Available Vehicles (`View_agency_list()` & `View_Vehicle_List()`)**:
  - Real-time filtering by **Rental Agency**, **Vehicle Category** (SUV, Sedan, Hatchback, Luxury), **Price Range Slider**, and **Operational Availability**.
  - Vehicle cards displaying photos, model name, **RC Number** (e.g., `DL-01-AB-1024`), agency partner, daily rate, star ratings, specs (fuel, transmission, seats), and status badges.
  - Interactive "View Details" modal with full technical specifications and driver options.
- **Workflow 2: Booking & Document Verification System (`Book_Vehicle()`)**:
  - Schedule trip pickup and return dates/times with automated multi-day calculations.
  - Select pickup location hub and choose between **Self-Drive** or **With Agency Chauffeur** (adds $25/day driver fee).
  - Driving License validation and KYC document ID verification.
  - **Interactive File Upload Preview**: Instant client-side document preview card with a simulated KYC verification stamp.
  - **Dynamic Fare Breakdown**: Real-time computation of daily rate, duration, base fare, driver fee, refundable security deposit ($100), taxes (12%), and total payable amount.
- **Workflow 3: Payment Gateway Simulation & Ticket Generation (`Payment_Process()` & `Generate_ticket()`)**:
  - Simulated payment modal supporting **Credit/Debit Card**, **UPI / QR Code**, and **Net Banking**.
  - **Result Toggle**: Test both **Payment Success** and **Payment Failure** (error toasts and transaction aborts).
  - On Success: Automatically generates a unique Booking ID (e.g., `CARX-BK-1042`), renders a printable **Digital Ticket / Acknowledgement Receipt**, changes the vehicle's status in `localStorage` from `Available` to `Booked`, and triggers `Contact_User()` notification.
- **Workflow 4: Active Ride Status, Cancellation & Dynamic Time-Based Refunds (`View_Ride_Status()` & Cancel Ride Page)**:
  - View all active, completed, and cancelled reservations.
  - "Mark Ride Returned" action: Marks vehicle returned, refunds security deposit, restores vehicle to `Available`, and directs customer to review.
  - **Dynamic Time-Based Refund Engine**:
    - **> 24 hours to pickup**: **90% refund** (10% short-notice processing fee) + 100% security deposit.
    - **6 to 24 hours to pickup**: **50% refund** (50% deduction) + 100% security deposit.
    - **< 6 hours to pickup**: **20% refund** (80% late penalty) + 100% security deposit.
    - **Interactive Test Simulator**: Quick-test buttons to simulate 36 hrs left, 14 hrs left, or 2 hrs left.
    - Generates a **Cancellation Acknowledgement Receipt** and automatically resets vehicle status to `Available` in `localStorage`.
- **Workflow 5: Reviews & Feedback System (`Feedback()`)**:
  - Submit 1-to-5 star ratings, vehicle cleanliness/condition feedback, and agency handover service reviews for completed bookings.
  - Dynamically recalculates the vehicle's and agency's average rating in the Main Database.

### 3. Agency Manager Portal (Fleet Command)
- **KPI Summary Cards**: Real-time metrics for **Total Fleet Size**, **Active Bookings**, **Gross Revenue**, and **Average Agency Rating**.
- **Panel 1: Vehicle Fleet Management (`Add_Vehicles()` & `Update_Vehicles()`)**:
  - Add new vehicles with model, RC number, category, daily pricing, fuel, transmission, seating, and image URL.
  - Interactive fleet table with inline status dropdown toggles (`Available`, `Booked`, `Maintenance`) and rate modification modals.
- **Panel 2: Driver Management (`Add_Drivers()` & `Update_Drivers()`)**:
  - Add and manage certified chauffeurs (License number, contact phone, duty status: `Available`, `Assigned`, `Off-Duty`).
- **Panel 3: Bookings, Receipts & Refund Monitor**:
  - Real-time audit table of all customer reservations, KYC verification status, payment state, and cancellation receipts.
  - **Contact User (`Contact_User()`) Action**: Dispatch vehicle handover spot, physical key collection details, and assigned chauffeur info to customer notifications.
- **Panel 4: Agency Feedback & Ratings Viewer (`View_Feedback()` & `Agency_Feedback()`)**:
  - View verified customer reviews and star ratings specifically for this agency's fleet.

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Customer** | `user@carx.com` | `pass123` | Priya Sharma (Has active & completed bookings) |
| **Customer** | `john@carx.com` | `pass123` | John Doe |
| **Agency Manager** | `apex@carx.com` | `admin123` | Apex Velocity Rentals (Downtown Hub) |
| **Agency Manager** | `royal@carx.com` | `admin123` | Royal Wheels Luxury Hub (Airport Zone) |
| **Agency Manager** | `metro@carx.com` | `admin123` | MetroDrive Fleet Services (Central Station) |

*Note: You can also click **"⚡ 1-Click Demo Login"** in the top bar or use **"Continue with Gmail / Google OAuth"** to test immediately without typing.*

---

## 💻 How to Run Locally

Because CarX is built strictly with vanilla web technologies:
1. Clone or download this repository:
   ```bash
   git clone https://github.com/Yug-Tri/CarX-main.git
   cd CarX-main
   ```
2. Double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
3. No local web server or build step is required!

---

## 📁 Repository Structure

```text
├── index.html   # Semantic Single Page Application markup & system modals
├── styles.css   # Modern automotive styling system, design tokens & print styles
├── app.js       # Core application engine, persistence layer & workflow logic
└── README.md    # Documentation and usage guide
```

