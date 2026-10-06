# REPAY — Daily Repayment Tracker

A complete, production-quality personal daily repayment tracker web application built with React 19, Vite, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

---

## 🌟 Overview

REPAY is designed for individuals tracking personal loans or debt repayments on a daily schedule (e.g., total loan of ₹6,000 with a daily target of ₹100). The application features a dedicated **Calendar View**, a comprehensive **Repayment Summary View**, dark mode support, dynamic financial metrics, recent payment history, and secure Supabase authentication with Row Level Security (RLS).

---

## ✨ Key Features

- **Two-Page Responsive Layout:**
  - **Calendar View (`/calendar`):** Focused 7-column monthly calendar displaying paid/unpaid states, amounts, and interactive date selection.
  - **Summary View (`/summary`):** Remaining balance hero display, repayment progress bar, total borrowed, total paid, daily target, and recent payment history.
- **Dark Mode Support:** Clean, high-contrast dark theme with user toggle switch (Sun/Moon icon) persisted in `localStorage`.
- **Dynamic Financial Metrics:**
  - Remaining Balance (`borrowedAmount - totalPaid`)
  - Total Paid (`sum of all recorded payments`)
  - Total Borrowed
  - Progress Percentage & Smooth Progress Bar
- **Flexible Payment Management:** Mark dates as paid, edit payment amounts, or remove payments without arbitrary 24-hour restrictions.
- **Overpayment Protection:** Automatically prevents payments that would exceed the remaining borrowed amount.
- **Duplicate Prevention:** Unique constraint enforcement per user and calendar date (`user_id + payment_date`).
- **User Settings:** Easily update your display name, total borrowed amount, or daily target amount.
- **Supabase Authentication:** User registration (Name, Email, Password), login, persistent session, and logout.
- **Responsive Mobile & Desktop Design:** Touch-friendly calendar grid and controls optimized for 320px–430px mobile screens up to 4K desktops.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide React, date-fns
- **Backend & Database:** Supabase (Auth, PostgreSQL, Row Level Security, JS Client)
- **Deployment Target:** Vercel

---

## 🔐 Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Note:** Only public publishable / anon keys are used in the frontend. Never expose or use a Supabase service-role key in frontend code.

---

## 🗄️ Database Structure & RLS

### 1. `profiles` Table
Stores user profile information and loan parameters.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key (references `auth.users.id`) |
| `name` | TEXT | User display name |
| `borrowed_amount` | NUMERIC | Total borrowed amount (e.g. 6000) |
| `daily_payment` | NUMERIC | Default daily repayment target (e.g. 100) |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### 2. `payments` Table
Stores daily payment entries.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key referencing `auth.users.id` |
| `payment_date` | DATE | Date of payment (`YYYY-MM-DD`) |
| `amount` | NUMERIC | Payment amount recorded |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

**Unique Constraint:** `(user_id, payment_date)` ensures a user cannot record duplicate payments for the same date.

### Row Level Security (RLS)
Row Level Security is enabled on both tables to ensure users can only view, insert, update, and delete their own records:

- `profiles` policy: `auth.uid() = id`
- `payments` policy: `auth.uid() = user_id`

---

## 🚀 Local Development

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.example` to `.env` (or `.env.local`) and fill in your Supabase credentials.

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 📦 Vercel Deployment

1. Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the repository in [Vercel](https://vercel.com/).
3. Add the environment variables under Project Settings -> Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Click **Deploy**. Vercel will automatically run `npm run build` and deploy the application.
