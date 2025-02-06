const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios"); // HTTP requests library
require("dotenv").config(); // Loads environment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json()); // Middleware to parse JSON request body

// Endpoint to send email using Mailtrap API
app.post("/api/send", (req, res) => {
  const emailData = req.body;

  // Prepare email payload
  const emailPayload = {
    from: { email: emailData.from },
    to: [{ email: "live.smtp.mailtrap.io" }],
    subject: emailData.subject,
    text: emailData.content[0].value,
    category: "Integration Test",
  };

  // Send email via Mailtrap API
  axios
    .post("https://send.api.mailtrap.io/api/send", emailPayload, {
      headers: {
        Authorization: `Bearer ${process.env.MAILTRAP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      res.status(200).json({ message: "Email sent successfully", response });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error sending email", error });
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`); // Server starts
});
