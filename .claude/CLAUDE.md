# Ironwolf Roofing Website

Business website for Ironwolf Roofing.

Customer-facing homepage funnels leads via a "Request a Free Inspection" form. The satellite roof estimator (Google Solar API) lives on a separate internal-only page used by the team; it is not linked from the public nav.

## Branding
- Logo: `images/ironwolf-logo.svg` (primary), `images/ironwolf-logo.png` (fallback). Source files in `Ironwolf-Roofing/Logo/`.
- Palette (white, black, light blue, dark blue, grey, silver only):
  - Dark blue `#0f2847` — primary
  - Black `#000000` — primary-dark
  - Light blue `#2563eb` — secondary/CTAs
  - Silver `#c0c0c0` — accents/borders
  - Grey `#6b7280` — body text
  - White `#ffffff`, light gray `#f5f5f5` — backgrounds
- Defined in `styles.css` `:root` and mirrored in `admin.html` inline styles.

## Commands

```bash
# Frontend (static files - use any local server)
npx serve .                    # Serve frontend on port 3000
python -m http.server 5500     # Alternative: serve on port 5500

# Backend
cd backend
npm install                    # Install dependencies
npm run dev                    # Start dev server with auto-reload (port 3000)
npm start                      # Start production server
```

## Tech Stack

- **Frontend**: Static HTML, CSS, JavaScript (no framework)
- **Backend**: Node.js, Express
- **Database**: SQLite (better-sqlite3)
- **APIs**: Google Maps, Google Places Autocomplete, Google Solar API

## File Structure

```
roofing-website/
├── index.html          # Homepage with instant estimate tool
├── about.html          # About page
├── services.html       # Services page
├── gallery.html        # Project gallery
├── contact.html        # Contact form
├── admin.html          # Admin dashboard (lead management)
├── internal-estimator.html  # Team-only: Google Solar satellite estimator
├── styles.css          # All styles
├── script.js           # Frontend JS (Google APIs, forms, estimate logic)
├── images/             # Static images
└── backend/
    ├── server.js       # Express API server
    ├── roofing.db      # SQLite database
    ├── package.json
    └── .env.example
```

## Database Schema

### leads
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| first_name | TEXT | Customer first name |
| last_name | TEXT | Customer last name |
| email | TEXT | Customer email |
| phone | TEXT | Customer phone |
| address | TEXT | Property address |
| service | TEXT | Service interested in |
| message | TEXT | Additional message |
| status | TEXT | Lead status (new, contacted, quoted, scheduled, completed, lost) |
| created_at | DATETIME | Submission timestamp |
| updated_at | DATETIME | Last update timestamp |

### estimates
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| address | TEXT | Property address |
| latitude | REAL | GPS latitude |
| longitude | REAL | GPS longitude |
| roof_area_sqft | INTEGER | Total roof area in sq ft |
| roof_squares | REAL | Roof squares (area / 100) |
| num_facets | INTEGER | Number of roof facets |
| predominant_pitch | TEXT | Main roof pitch |
| complexity | TEXT | Complexity rating |
| waste_factor | INTEGER | Material waste percentage |
| price_low | INTEGER | Low estimate (3-tab shingles) |
| price_mid | INTEGER | Mid estimate (architectural) |
| price_high | INTEGER | High estimate (premium) |
| created_at | DATETIME | Estimate timestamp |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/stats | Dashboard statistics |
| POST | /api/leads | Submit new lead |
| GET | /api/leads | Get all leads |
| GET | /api/leads/:id | Get single lead |
| PUT | /api/leads/:id | Update lead status |
| DELETE | /api/leads/:id | Delete lead |
| POST | /api/estimates | Save estimate |
| GET | /api/estimates | Get all estimates |

## Environment Variables

Required in `backend/.env`:
```
PORT=3000
FRONTEND_URL=http://localhost:5500

# Twilio SMS — alerts on every new lead
TWILIO_ACCOUNT_SID=<from Twilio Console>
TWILIO_AUTH_TOKEN=<from Twilio Console>
TWILIO_FROM_NUMBER=+1XXXXXXXXXX
NOTIFY_PHONE=+13147741700
```

If Twilio vars are missing, the backend still runs and logs "SMS notifications disabled" on startup. Lead creation succeeds either way — SMS is fire-and-forget.

## Key Features

### Request a Free Inspection (homepage)
- Public lead-capture form on `index.html`, section `#request-inspection`
- Fields (all required): First Name, Last Name, Phone (auto-formats to `(XXX) XXX-XXXX`), Email, Address (Google Places autocomplete), Reason for Inspection
- Client-side validation: 10-digit US phone, email regex, non-empty required fields
- Submits to `POST /api/leads` with `service="inspection"` and `message=reason`
- JS entry: `initInspectionAutocomplete()` in `script.js` — registered as the Google Maps callback

### Internal Satellite Estimator (`internal-estimator.html`)
- Team-only page. Not linked from public nav. Accessed from `admin.html` via the "Roof Estimator" button
- Uses the same Google Solar API logic that used to be on the homepage
- Address entered via Google Places Autocomplete → calls Solar API → renders roof area, facets, pitch, complexity, waste factor, material quantities, and 3 pricing tiers (3-tab / architectural / premium)
- JS entry: `initAutocomplete()` in `script.js` — registered as the Google Maps callback on this page

### Pricing Configuration (script.js)
```javascript
PRICE_PER_SQUARE_LOW = 465   // 3-Tab shingles
PRICE_PER_SQUARE_MID = 550   // Architectural shingles
PRICE_PER_SQUARE_HIGH = 750  // Designer/Premium shingles
```

### Lead Management
- Contact form submissions stored in SQLite
- Admin dashboard for viewing/managing leads
- Status workflow: new → contacted → quoted → scheduled → completed/lost

## Development Notes

- Frontend expects backend on port 3000, frontend on port 5500 (configurable)
- Google API key is in script.js (line 6) - replace for production
- CORS configured to allow frontend URL specified in .env

## Known Issues / Learnings

(Add issues and solutions here as they arise)
