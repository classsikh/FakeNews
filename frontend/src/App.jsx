import React, { useState, useRef } from "react";
import axios from "axios";
import Tesseract from 'tesseract.js';

export default function FakeNewsChecker() {
  const [newsText, setNewsText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef(null);
  
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      setNewsText(text);
    } catch (error) {
      console.error('Error extracting text:', error);
    }
    setLoading(false);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setNewsText(transcript);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser');
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Fake News Detector</h1>
      
      <div className="flex gap-4 mb-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => fileInputRef.current.click()}
        >
          Upload Image
        </button>
        <button
          className={`bg-${isListening ? 'red' : 'purple'}-500 text-white px-4 py-2 rounded`}
          onClick={handleVoiceInput}
        >
          {isListening ? 'Listening...' : 'Voice Input'}
        </button>
      </div>

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
        {loading ? "Processing..." : "Check News"}
      </button>
      {result && <p className="mt-4 text-lg font-semibold">Result: {result}</p>}
    </div>
  );
}
