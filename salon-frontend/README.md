# Marchand & Vance — Salon Management Portal (Frontend)

A role-based React frontend for the Salon Management Portal, built against the
`Salon_management_BackEnd` Express/MongoDB API. Four distinct panels — **Customer**,
**Barber/Stylist**, **Receptionist**, and **Admin** — share one design system but each
get their own navigation, dashboard, and permissions, matching the SRS.

## Stack

- **React 19** + **Vite** — build tooling
- **Tailwind CSS 3** — custom design system (see `tailwind.config.js`)
- **Redux Toolkit** — global state: auth session, shopping cart, booking wizard, UI
- **React Router 7** — role-gated routing
- **React Hook Form** — form validation throughout
- **Axios** — API client with JWT interceptor and auto-logout on 401
- **Recharts** — admin analytics charts
- **Lucide React** — icons

## Getting started

### 1. Start the backend first

This frontend expects the provided `Salon_management_BackEnd` API running on
`http://localhost:5000` (its default port). From that project:

```bash
npm install
npm run seed   # populates demo users, services, products, etc.
npm run dev    # starts the API on :5000
```

Make sure it has a `.env` with at least `MONGODB_URI` and `JWT_SECRET` — see that
project's own README/`.env.example` for details.

### 2. Run this frontend

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The Vite dev server
proxies any request to `/api/*` through to `http://localhost:5000` (see
`vite.config.js`), so no CORS setup is needed in development.

If your backend runs on a different port or host, either:
- set `VITE_API_PROXY_TARGET` before running `npm run dev`, or
- point `VITE_API_BASE_URL` in `.env` directly at the full backend URL (e.g.
  `http://localhost:5000/api`) and skip the proxy entirely.

### 3. Build for production

```bash
npm run build
npm run preview
```

`VITE_API_BASE_URL` should point at your deployed API's `/api` path in production
(the dev-only proxy in `vite.config.js` does not apply to the built app).

## Demo credentials

These match `src/seed.js` in the backend:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@salon.com` | `admin123` |
| Barber | `marcus@salon.com` | `barber123` |
| Barber | `sarah@salon.com` | `barber123` |
| Barber | `david@salon.com` | `barber123` |
| Receptionist | `emily@salon.com` | `recep123` |
| Customer | `alex@example.com` | `customer123` |
| Customer | `jessica@example.com` | `customer123` |

The login screen's role tabs have a **"Fill demo credentials"** button that drops
these in automatically for whichever role is selected. Note that login is always by
email/password — the role tab is a UI convenience for theming and demo data, not an
input to the API; after signing in you're routed to whatever panel your account's
actual role grants.

## Project structure

```
src/
  api/            One module per backend resource (auth, appointments, services, …)
  app/            Redux store setup
  features/       Redux slices: auth, cart, booking wizard, ui
  routes/         ProtectedRoute (auth gate) and RoleRoute (role gate)
  layouts/        AuthLayout (login/register) and DashboardLayout (role shell)
  components/     Shared design-system primitives (Card, Modal, Table, StatCard, …)
  hooks/          useAuth, useFetch
  pages/
    auth/         Login, Register
    customer/     Dashboard, Services, booking wizard, appointments, store, cart, orders
    barber/       Dashboard, schedule, earnings, time-off
    receptionist/ Dashboard, master schedule, customers, staff availability
    admin/        Analytics overview, staff/service/product/inventory/wage management
    shared/       Profile, AppointmentsBoard, TimeOffApprovals — reused across roles
  utils/          Formatters and shared constants (statuses, categories, nav config)
```

## Design notes

The visual identity (ink/brass/emerald/clay palette, Fraunces display serif +
Manrope UI sans) is meant to feel like a considered barbershop brand rather than a
generic admin template — each role gets a subtly different accent color for
wayfinding (brass for Customer, emerald for Barber, clay for Receptionist, ink for
Admin) while sharing one component system.

## A note on Receptionist bookings

The backend's `POST /api/appointments` always books the appointment under the
signed-in user (`req.user._id`), so there's no supported way for a Receptionist to
create a new booking *on behalf of* a customer through the current API. The
Receptionist panel is built around what the API actually supports: viewing the full
schedule, updating appointment status, and reassigning barbers on existing bookings.
If phone-in bookings need to be supported, the backend's `createAppointment`
controller would need a `customer` field accepted from Admin/Receptionist requests.

## Environment variables

See `.env.example`. Only one variable is used at runtime:

```
VITE_API_BASE_URL=/api
```
