import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("wafa.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'admin', 'doctor', 'pharmacist'
    full_name TEXT
  );

  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    contact TEXT,
    medical_history TEXT,
    allergies TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prescription_number TEXT UNIQUE,
    patient_id INTEGER,
    prescriber_id INTEGER,
    date TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(prescriber_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prescription_id INTEGER,
    name TEXT,
    generic_name TEXT,
    dosage TEXT,
    frequency TEXT,
    duration TEXT,
    notes TEXT,
    FOREIGN KEY(prescription_id) REFERENCES prescriptions(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed Default Settings
const defaultSettings = [
  { key: 'language', value: 'en' },
  { key: 'theme', value: 'emerald' },
  { key: 'rx_bg_image', value: '' },
  { key: 'rx_padding', value: '20' },
  { key: 'rx_line_spacing', value: '7' },
  { key: 'rx_font_size', value: '10' },
  { key: 'rx_header_title', value: 'WAFA Technology' },
  { key: 'rx_header_subtitle', value: 'Digital Prescription System' },
  { key: 'rx_footer_text', value: 'This is a digitally generated prescription.' }
];

for (const setting of defaultSettings) {
  const exists = db.prepare("SELECT * FROM settings WHERE key = ?").get(setting.key);
  if (!exists) {
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(setting.key, setting.value);
  }
}

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)").run(
    "admin",
    "admin123",
    "admin",
    "System Administrator"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Auth
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  app.post("/api/register", (req, res) => {
    const { username, password, fullName, role } = req.body;
    try {
      const result = db.prepare("INSERT INTO users (username, password, role, full_name) VALUES (?, ?, ?, ?)").run(
        username,
        password,
        role || 'doctor',
        fullName
      );
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      res.json({ 
        success: true, 
        user: { id: user.id, username: user.username, role: user.role, fullName: user.full_name } 
      });
    } catch (err: any) {
      if (err.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ success: false, message: "Username already exists" });
      } else {
        res.status(500).json({ success: false, message: "Server error" });
      }
    }
  });

  // Patients
  app.get("/api/patients", (req, res) => {
    const patients = db.prepare("SELECT * FROM patients ORDER BY name ASC").all();
    res.json(patients);
  });

  app.post("/api/patients", (req, res) => {
    const { name, age, gender, contact, medical_history, allergies } = req.body;
    const result = db.prepare("INSERT INTO patients (name, age, gender, contact, medical_history, allergies) VALUES (?, ?, ?, ?, ?, ?)").run(
      name, age, gender, contact, medical_history, allergies
    );
    res.json({ id: result.lastInsertRowid });
  });

  // Prescriptions
  app.get("/api/prescriptions", (req, res) => {
    const prescriptions = db.prepare(`
      SELECT p.*, pt.name as patient_name, u.full_name as prescriber_name 
      FROM prescriptions p
      JOIN patients pt ON p.patient_id = pt.id
      JOIN users u ON p.prescriber_id = u.id
      ORDER BY p.created_at DESC
    `).all();
    res.json(prescriptions);
  });

  app.get("/api/prescriptions/:id", (req, res) => {
    const prescription = db.prepare(`
      SELECT p.*, pt.name as patient_name, pt.age, pt.gender, pt.contact, pt.allergies, pt.medical_history, u.full_name as prescriber_name 
      FROM prescriptions p
      JOIN patients pt ON p.patient_id = pt.id
      JOIN users u ON p.prescriber_id = u.id
      WHERE p.id = ?
    `).get(req.params.id);
    
    if (prescription) {
      const medicines = db.prepare("SELECT * FROM medicines WHERE prescription_id = ?").all(req.params.id);
      res.json({ ...prescription, medicines });
    } else {
      res.status(404).json({ message: "Prescription not found" });
    }
  });

  app.post("/api/prescriptions", (req, res) => {
    const { patient_id, prescriber_id, date, notes, medicines } = req.body;
    const prescription_number = "RX-" + Date.now().toString().slice(-8);
    
    const insertPrescription = db.transaction((data) => {
      const result = db.prepare("INSERT INTO prescriptions (prescription_number, patient_id, prescriber_id, date, notes) VALUES (?, ?, ?, ?, ?)").run(
        prescription_number, data.patient_id, data.prescriber_id, data.date, data.notes
      );
      const prescriptionId = result.lastInsertRowid;
      
      const medicineStmt = db.prepare("INSERT INTO medicines (prescription_id, name, generic_name, dosage, frequency, duration, notes) VALUES (?, ?, ?, ?, ?, ?, ?)");
      for (const med of data.medicines) {
        medicineStmt.run(prescriptionId, med.name, med.generic_name, med.dosage, med.frequency, med.duration, med.notes);
      }
      return prescriptionId;
    });

    const id = insertPrescription({ patient_id, prescriber_id, date, notes, medicines });
    res.json({ id, prescription_number });
  });

  // Reports
  app.get("/api/reports/most-prescribed", (req, res) => {
    const data = db.prepare(`
      SELECT name, COUNT(*) as count 
      FROM medicines 
      GROUP BY name 
      ORDER BY count DESC 
      LIMIT 10
    `).all();
    res.json(data);
  });

  app.get("/api/reports/by-date", (req, res) => {
    const data = db.prepare(`
      SELECT date, COUNT(*) as count 
      FROM prescriptions 
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 30
    `).all();
    res.json(data);
  });

  app.delete("/api/prescriptions/:id", (req, res) => {
    const id = req.params.id;
    db.transaction(() => {
      db.prepare("DELETE FROM medicines WHERE prescription_id = ?").run(id);
      db.prepare("DELETE FROM prescriptions WHERE id = ?").run(id);
    })();
    res.json({ success: true });
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const settings = req.body;
    const updateStmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        updateStmt.run(key, String(value));
      }
    })();
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
