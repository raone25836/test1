# Lalee Patle — A Dreamy Birthday Experience 🎂✨

A heartfelt, elegant, and fully functional birthday website built for my best friend, **Lalee Patle**, celebrating her birthday on **23 November** in the **Asia/Kolkata (IST)** timezone.

---

## 🌸 Visual Identity & Theme
- **Color Palette**:
  - Blush Pink (`#F6C8D5`)
  - Soft Lavender (`#DCD3FA`)
  - Warm Ivory (`#FFF8F0`)
  - Midnight Navy (`#171A35`)
  - Rose Accent (`#D88BA5`)
  - Champagne Gold (`#D9BD83`)
- **Atmosphere**: Twinkling starlight background, ambient pastel glows, smooth glass cards, emotional typography (`Cormorant Garamond` serif and `Plus Jakarta Sans`), and lightweight canvas confetti.

---

## 🌟 Features & Implemented Architecture

### Page A — Public Birthday Homepage
- Hero presentation with Lalee's name, warm welcome, and gentle animations.
- Prominent **"Open Your Surprise"** and **"Read Birthday Letter"** call-to-actions.
- Live countdown ticker preview and shortcut pills to all sections.
- Signature: *"Made with care for Lalee — A digital sanctuary for a wonderful best friend"*.

### Page B — Live Birthday Countdown
- Real-time countdown to the next 23 November in `Asia/Kolkata` timezone.
- Displays Days, Hours, Minutes, and Seconds without hardcoding future years.
- Correctly handles leap years and timezone boundaries.
- **Celebration Mode**: When 23 November arrives, transforms into a birthday celebration state with glowing banners and invitation to blow candles.

### Page C — The Birthday Letter
- Sincere, natural Hinglish letter for a best friend.
- Expresses genuine appreciation for her calm confidence, authentic nature, and steadfast presence.
- Wishes her sound peace of mind, strong health, unstoppable confidence, and boundless happiness.
- Includes **"Read Again"** reveal replay and **"Copy"** button.

### Page D — Interactive Birthday Cake
- Custom SVG birthday cake with three tiers, frosting drips, and 5 candles.
- Interactive candle toggling (tap individual candles to light or extinguish them).
- **"Make a Wish & Blow Candles"** interaction: extinguishes flames with soft smoke puffs, confirms the wish, and triggers celebration confetti.
- **"Celebrate Again"** replay button.

### Page E — Surprise Gift Box
- 3D gift package with golden ribbon and lid unwrap animation.
- Reveals a warm pop-up birthday greeting card with best friend promise badges (*Unlimited Chai*, *Zero Judgement Safe Space*, *Personal Cheerleader*, *Birthday Treat Guaranteed*).

### Page F — 8 Appreciation Cards
- 8 heartfelt appreciation cards written in natural, sincere Hinglish.
- Category filters: *All Wishes*, *Friendship*, *Peace & Vibes*, *Growth*, *Individuality*.
- Interactive flip-to-reveal mechanism and "Reveal All" / "Reset" controls.

### Page G — Illustrated Photo Gallery
- Original, tasteful SVG illustrations (*Starlight Sky*, *Chai & Talks*, *Golden Sunset*, *Quiet Ambition*, *Blossoming Grace*, *Pure Joy*).
- Clearly labeled as artistic placeholders until real photos are supplied.
- Accessible Lightbox modal with Next, Previous, Close, and keyboard arrow keys navigation (`Escape`, `ArrowLeft`, `ArrowRight`).
- Instructions on replacing illustrations with real photographs in `/public/photos/`.

### Page H — Guest Wish Wall
- Allows visitors and friends to leave a birthday message for Lalee.
- Client-side & server-side validation (Name: 2–50 chars, Message: 5–600 chars).
- Strict HTML and XSS sanitization (`sanitizeHtml`) removing executable scripts and event handlers.
- Rate limiting per IP to prevent spam submissions.
- Persistent file storage on the server (`data/wishes.json`).

### Page I — Server-Protected Private Memories Vault
- **Real server-side authorization**: Private memories are **not** bundled in client JS or accessible via public APIs.
- Requests to `/api/private/memories` require a cryptographically verified Bearer session token, returning `401 Unauthorized` without credentials.
- Protected PIN / Password gate modal.
- Includes personal reflections and promises, with an in-app form to add new private notes.
- "Lock Vault" session termination.

### Page J — Owner Admin Dashboard
- Protected dashboard for the site owner.
- Full guest wish moderation: Approve, Hide/Reject, or Delete submissions.
- Live stats dashboard: Total wishes, approved count, private notes count, target date.
- Real-time letter customization editor (updates salutation, sender name, and text).

### Audio & Sound System
- Built-in Web Audio API synthesizer generating a soothing, celestial pentatonic lullaby/harp progression.
- User-controlled: starts paused to respect browser autoplay policies.
- Play, Pause, Mute, and Volume slider.
- Zero external MP3 hosting dependencies (100% reliable, ₹0 cost).

---

## 🚀 ₹0-Budget Production Deployment Instructions

### Option 1: Render (Recommended — Free Tier Web Service)
1. Push this repository to GitHub.
2. Sign up at [Render](https://render.com).
3. Click **New +** -> **Web Service** and connect your GitHub repository.
4. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   - `PORT`: `3000` (or leave default assigned by Render)
   - `NODE_ENV`: `production`
   - `ADMIN_PASSWORD`: `<Your_Chosen_Private_Password>`
6. Click **Deploy Web Service**. Render provides a free `https://<app-name>.onrender.com` URL with SSL included.

### Option 2: Railway (Free Trial / Starter)
1. Connect your repository on [Railway](https://railway.app).
2. Set build command to `npm run build` and start command to `npm run start`.
3. Set `ADMIN_PASSWORD` in the variables tab.
4. Generate a public domain under Networking.

### Option 3: Fly.io (Free Tier)
1. Run `fly launch` in the terminal.
2. Choose Node.js runtime and accept defaults.
3. Set secrets: `fly secrets set ADMIN_PASSWORD=your_password`.
4. Run `fly deploy`.

---

## 🧪 Automated & Verified Test Results

| Test Category | Test Case | Status | Details |
|---|---|---|---|
| **Unit Test** | Leap year calculations | **PASS** | Correctly identifies 2024, 2028, 2026, 2100 |
| **Unit Test** | Target countdown before birthday | **PASS** | Accurately targets next 23 November in Asia/Kolkata |
| **Unit Test** | Birthday celebration state | **PASS** | Detects 23 November boundary and triggers celebration |
| **Unit Test** | Countdown year rollover | **PASS** | Automatically rolls over to next year without hardcoded year |
| **Unit Test** | HTML & XSS sanitization | **PASS** | Neutralizes script tags, event handlers (`onerror=`), and quotes |
| **Unit Test** | Wish input boundary validation | **PASS** | Rejects empty strings, inputs < min length, inputs > max length |
| **Unit Test** | Constant-time password verification | **PASS** | `crypto.timingSafeEqual` prevents timing-attack vectors |
| **Browser Journey** | Homepage load & typography | **PASS** | Verified in Chromium at 1440x900, zero console errors |
| **Browser Journey** | Interactive Cake candle blowing | **PASS** | Toggling candles, smoke puff animation, confetti burst |
| **Browser Journey** | Surprise Gift Box unwrap | **PASS** | Ribbon unwrap, card pop-up, badges, and wrap-again reset |
| **Browser Journey** | Guest Wish submission | **PASS** | Submitted wish, validated, saved in `data/wishes.json`, live feed updated |
| **Security Test** | Private Vault 401 Gate | **PASS** | Unauthenticated `/api/private/memories` returns 401; unlocks with passcode |
| **Security Test** | Admin Dashboard Moderation | **PASS** | Token verified; approve, reject, delete wishes functioning |
| **Responsive Test** | Mobile layout (390x844) | **PASS** | Navigation dropdown, vertical stacking, audio player spacing confirmed |
