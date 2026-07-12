# GrowDoctor — Setup Guide

## What changed in this update

1. **Profile page (`/profile`)** — after logging in you now see a full profile
   with your **name, email, phone number, and profession**, plus your order
   history. It's linked from a new account menu in the header (top-right,
   shows your first name once logged in) and from the mobile menu.
2. **Header now reflects login state** — previously "Login" and "Sign Up"
   always showed, even when you were already logged in. Now it shows an
   account menu (Profile / Logout) once you're signed in.
3. **Registration auto-signs you in** — after creating an account you land
   straight in your profile instead of having to log in a second time.
4. **Fixed a checkout bug** — "Add to Cart" / "Buy Now" was saving a plain
   text ID (e.g. `resume-cv`) into a database field that only accepted
   MongoDB ObjectIds. This caused a server error on every add-to-cart and
   order-creation call. It's fixed now.
5. **Razorpay checkout is wired up correctly** — the checkout modal now
   explicitly shows a **UPI** payment block, and pre-fills your name/email/
   phone. Real payments will work as soon as you add your own Razorpay keys
   (see below) — this cannot work with the placeholder keys the project
   shipped with.
6. Friendlier error message if Razorpay isn't configured yet, instead of a
   generic server crash.

## Running the app

### 1. Frontend
```bash
cd growdoctor-app
npm install
npm run dev
```

### 2. Backend
```bash
cd growdoctor-app/backend
npm install
npm run dev
```
The backend runs on `http://localhost:5000` and the frontend already points
there in `src/api/axios.js`.

## Required: enable real payments (Razorpay + UPI)

The zip ships with **placeholder** Razorpay keys, so payments are
intentionally disabled until you add your own. Nobody but you can generate
real keys — I can't create a Razorpay account on your behalf.

1. Sign up at https://dashboard.razorpay.com (free, test mode is instant).
2. Go to **Settings → API Keys → Generate Test Key**.
3. Copy the **Key Id** and **Key Secret**.
4. Open `growdoctor-app/backend/.env` and replace:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
   with your real values.
5. Restart the backend (`npm run dev` inside `backend/`).

Once real test keys are in place, the checkout modal will show UPI, cards,
netbanking and wallets. In **test mode** you can pay with Razorpay's test UPI
ID `success@razorpay` or any test card from
https://razorpay.com/docs/payments/payments/test-card-upi-details/ — no real
money moves in test mode.

When you're ready to accept real payments, switch to **Live Keys** in the
Razorpay dashboard (requires KYC) and use those instead.

## Security note

`backend/.env` currently contains a live MongoDB Atlas connection string with
a username/password embedded in it. Since this file was shared in a zip,
it's a good idea to rotate that database password in MongoDB Atlas and
update `MONGO_URI` with the new one, and to make sure `.env` is never
committed to a public git repo.
