require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey";

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

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

// **REGISTRAZIONE**
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
        return res.status(500).json({ error: "Errore nella registrazione" });
      }
      res.json({ message: "Registrazione completata con successo!" });
    });
  } catch (error) {
    res.status(500).json({ error: "Errore interno del server" });
  }
});

// **LOGIN**
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e password sono obbligatorie" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error("Errore nel login:", err);
      return res.status(500).json({ error: "Errore nel server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const token = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login riuscito", token });
  });
});

// **Middleware per proteggere le rotte**
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Accesso negato, token mancante" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token non valido" });
    }
    req.user = user;
    next();
  });
};

// **Endpoint protetto**
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "Accesso autorizzato", user: req.user });
});

// **Invio Email**
app.post("/api/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    console.log("📩 Dati email ricevuti:", req.body);

    let transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST || "smtp.mailtrap.io",
      port: process.env.MAILTRAP_PORT || 587,
      auth: {
        user: process.env.MAILTRAP_USER || "ce8a953f294a9a",
        pass: process.env.MAILTRAP_PASS || "6e4b99635f3439",
      },
    });

    let info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "ce8a953f294a9a@inbox.mailtrap.io", // cheange with the real one email of destination
      subject: "Nuovo Messaggio dal Form Contatti",
      text: message,
    });

    console.log("Dati dell'email inviati:", info);

    return res.json({ message: "Email inviata con successo", info });
  } catch (error) {
    console.error("❌ Errore nell'invio email:", error);
    return res.status(500).json({ error: "Errore nell'invio dell'email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
});
