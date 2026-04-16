CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  service TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL,
  latitude REAL,
  longitude REAL,
  roof_area_sqft INTEGER,
  roof_squares REAL,
  num_facets INTEGER,
  predominant_pitch TEXT,
  complexity TEXT,
  waste_factor INTEGER,
  price_low INTEGER,
  price_mid INTEGER,
  price_high INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
