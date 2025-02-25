require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// **Configurazione Multer per il caricamento dei file**
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// **Connessione al Database**
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "users_db",
});

db.connect((err) => {
  if (err) {
    console.error("Errore di connessione al database:", err);
    process.exit(1);
  }
  console.log("✅ Connesso al database MySQL");
});

// **Autenticazione e gestione utenti**
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e password sono obbligatorie" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

    db.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Errore durante la registrazione:", err);
        return res.status(500).json({ error: "Errore nel server" });
      }

      const user = { id: result.insertId, email };

      // Genera il token JWT
      const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });

      res.json({ message: "Registrazione completata!", token, user });
    });
  } catch (error) {
    console.error("Errore hashing password:", error);
    res.status(500).json({ error: "Errore nel server" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Inserisci email e password" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Errore nel database:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Email non registrata" });
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Errore nella verifica della password:", err);
        return res.status(500).json({ error: "Errore nel server" });
      }
      if (!isMatch) {
        return res.status(401).json({ error: "Password errata" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.json({ message: "Login riuscito!", token, user });
    });
  });
});

// **Gestione immagini**
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nessun file caricato" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.json({ imageUrl });
});

// **Gestione album fotografici**
app.get("/api/albums", (req, res) => {
  db.query("SELECT * FROM albums", (err, results) => {
    if (err) {
      console.error("Errore nel recupero degli album:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }
    res.json(results);
  });
});

app.post("/api/albums", (req, res) => {
  const { title, date, image_url, download_code, download_link } = req.body;
  if (!title || !date || !image_url || !download_code || !download_link) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  const sql =
    "INSERT INTO albums (title, date, image_url, download_code, download_link) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [title, date, image_url, download_code, download_link],
    (err, result) => {
      if (err) {
        console.error("Errore durante la creazione dell'album:", err);
        return res.status(500).json({ error: "Errore nel server" });
      }
      res.json({ message: "Album creato con successo!", id: result.insertId });
    }
  );
});

app.post("/api/albums/download", (req, res) => {
  const { download_code } = req.body;
  if (!download_code) {
    return res.status(400).json({ error: "Codice download mancante" });
  }
  const sql = "SELECT download_link FROM albums WHERE download_code = ?";
  db.query(sql, [download_code], (err, results) => {
    if (err) {
      console.error("Errore nella ricerca dell'album:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Codice non valido" });
    }
    let downloadLink = results[0].download_link.replace("?dl=0", "?dl=1");
    res.json({ download_link: downloadLink });
  });
});

// **Avvio del server**
app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
});
