const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" })); // Enable CORS for all origins
app.use(bodyParser.json()); // Middleware to parse JSON request body

// MySQL database configuration
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "users_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// User registration endpoint
app.post("/api/register", (req, res) => {
  console.log(req.body); // Log incoming request body for debugging

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.error("Error during registration:", err);
      return res.status(500).json({ error: "Error during registration" });
    }
    res.json({ message: "Registration successful!" });
  });
});

// Email sending endpoint
app.post("/api/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log("Received data for email:", req.body);

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "ce8a953f294a9a",
      pass: "6e4b99635f3439",
    },
  });

  const mailOptions = {
    from: email,
    to: "recipient@example.com", // Replace with actual recipient email
    subject: `Message from ${name}`,
    text: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({ message: "Email sent successfully!", info: info.response });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Error sending email",
      details: error.toString(),
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
