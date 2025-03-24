import React, { useState } from "react";
import axios from "axios";
import InputI from "./components/input";

export default function FakeNewsChecker() {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const checkNews = async () => {
    if (!newsText) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/check-news", { text: newsText });
      console.log(response.data.result.reply.data.devkiResponse);
      setResult(response.data.result.reply.data.devkiResponse);
    } catch (error) {
      setResult("Error checking news");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Fake News Detector</h1>
      <textarea
        className="border p-2 w-full max-w-md"
        rows="4"
        placeholder="Enter news text here..."
        value={newsText}
        onChange={(e) => setNewsText(e.target.value)}
      />
     <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        onClick={checkNews}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check News"}
      </button> 
      {result && <p className="mt-4 text-lg font-semibold">Result: {result}</p>}
    </div>
  );
}
 