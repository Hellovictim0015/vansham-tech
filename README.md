# Vansham (Next.js + MySQL)

Frontend (React/Next) and backend (Express) merged into one Next.js app.
API lives in `app/api/**` (Route Handlers), shared server code in `lib/server/`.

## Setup
1. Create the DB: `mysql -u root -p < database/schema.sql`
2. Copy `.env.example` to `.env.local` and fill in values (MySQL, JWT_SECRET, Razorpay).
3. `npm install` then `npm run dev` -> http://localhost:3000

OTP has no SMS gateway yet: it is printed in the server console and (dev only) listed at `/api/auth/checkOtp-otp`.
To create an admin, insert a user with `role='admin'` and a bcrypt-hashed password.
Uploaded files are stored in the root `uploads/` folder (not `public/`) and served through `/api/uploads/...`.
