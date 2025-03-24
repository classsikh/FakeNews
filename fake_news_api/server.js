const express = require("express");
const axios = require("axios");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

app.post("/check-news", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "News text is required" });

  try {
    const response = await axios.post("https://ark.brighthustle.in/public-utils/devki/ask", {
      jwt: process.env.JWT,
      question: `Analyze the following news and determine if it is true or false. If true, provide supporting information; if false, simply state 'This news is false.' News: : ${text}`,
    });
    res.json({ result: response.data });
  } catch (error) {
    res.status(500).json({ error: "Error checking news" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
