import React, { useState, useRef } from "react";
import axios from "axios";
import Tesseract from 'tesseract.js';
import { Link, Routes, Route } from "react-router-dom";
import TrendingNews from "./components/TrendingNews";
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { darkMode, setDarkMode } = useTheme();
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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className={`flex items-center px-3 py-2 ${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                Analyze News
              </Link>
              <Link to="/trending" className={`flex items-center px-3 py-2 ${darkMode ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}>
                Trending News
              </Link>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-3xl mx-auto">
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <h1 className={`text-3xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'} mb-8`}>
                  Fake News Detector
                </h1>

                <div className="relative">
                  <div className={`flex items-center border-2 ${darkMode ? 'border-gray-700' : 'border-gray-300'} rounded-lg overflow-hidden`}>
                    <textarea
                      className={`flex-1 p-4 outline-none resize-none ${
                        darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900'
                      }`}
                      rows="4"
                      placeholder="Enter or paste news text here..."
                      value={newsText}
                      onChange={(e) => setNewsText(e.target.value)}
                      disabled={loading}
                    />
                    <div className={`flex flex-col gap-2 p-2 border-l ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                      <button
                        className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg transition-colors`}
                        onClick={() => fileInputRef.current.click()}
                        title="Upload Image"
                      >
                        <svg className={`w-6 h-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${isListening ? 'bg-red-100' : ''}`}
                        onClick={handleVoiceInput}
                        title="Voice Input"
                      >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="mt-6 text-center">
                  <button
                    className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    onClick={checkNews}
                    disabled={loading || !newsText.trim()}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Analyze News'
                    )}
                  </button>
                </div>

                {result && (
                  <div className={`mt-8 p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Analysis Result:
                    </h2>
                    <p className={`text-lg ${
                      result.toLowerCase().includes('fake') 
                        ? 'text-red-500' 
                        : 'text-green-500'
                    }`}>
                      {result}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        } />
        <Route path="/trending" element={<TrendingNews />} />
      </Routes>
    </div>
  );
}
