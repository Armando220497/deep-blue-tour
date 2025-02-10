const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;
const SECRET_KEY = "supersecretkey"; // Cambialo in una variabile di ambiente

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Connection to DB
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "users_db",
});

db.connect((err) => {
  if (err) {
    console.error("Errore di connessione al database:", err);
    return;
  }
  console.log("Connesso al database MySQL");
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
    res.status(500).json({ error: "Errore nella registrazione" });
  }
});

// **LOGIN**
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Email ricevuta:", email);
  console.log("Password ricevuta:", password);

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
      console.log("Utente non trovato nel database.");
      return res.status(401).json({ error: "Credenziali non valide" });
    }

    const user = results[0];
    console.log("Utente trovato:", user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Password errata");
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
  const token = req.headers["authorization"];
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

app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
