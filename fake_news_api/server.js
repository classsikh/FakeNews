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
      question: `{
  "query": "Analyze the following news and determine if it is true or false. Provide the response in JSON format with two keys: 'confidence' (a percentage from 0 to 100) and 'message' (a statement declaring if the news is true or false, with supporting details if true). News: 
${text}`,
    });
    const data = await response.json();
    console.log(data);
    const confidence =data.result.reply.data.devkiResponse.confidence; // Confidence percentage
    const message = data.result.reply.data.devkiResponse.message; // True/False statement with details if true

    console.log("Confidence:", confidence + "%");
    console.log("Message:", message);
    res.json({ result: response.data });
  } catch (error) {
    res.status(500).json({ error: "Error checking news" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
