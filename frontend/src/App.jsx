import React, { useState, useRef } from "react";
import axios from "axios";
import Tesseract from 'tesseract.js';
import { Link, Routes, Route } from "react-router-dom";
import TrendingNews from "./components/TrendingNews";
import { useTheme } from './context/ThemeContext';

export default function App() {
  const { darkMode } = useTheme();
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
      console.log(response.data);
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
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                  Factify
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className="px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 flex items-center space-x-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Analyze News</span>
              </Link>
              <Link 
                to="/trending" 
                className="px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200 flex items-center space-x-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Trending News</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            <div className="relative overflow-hidden">
              {/* Hero background */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1170&auto=format&fit=crop"
                  className="w-full h-[450px] object-cover filter brightness-[0.2] scale-105 transform hover:scale-110 transition-transform duration-[20000ms]"
                  alt="News Background"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/70 to-gray-900"></div>
                {/* Animated grain effect */}
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] animate-grain"></div>
              </div>

              {/* Hero content */}
              <div className="relative py-28 px-4 sm:py-32 md:py-36 z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                  {/* Small badge */}
                  <div className="animate-fadeIn">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20">
                      Powered by Advanced AI
                    </span>
                  </div>

                  {/* Main heading */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight animate-slideDown">
                    <span className="inline-block bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text">
                      Detect Fake News with
                    </span>
                    <br />
                    <span className="inline-block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-transparent bg-clip-text mt-2">
                      Artificial Intelligence
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slideUp max-w-2xl mx-auto leading-relaxed">
                    Our AI-powered system analyzes news content using advanced algorithms to help you identify misinformation.
                  </p>

                  {/* Feature badges */}
                  <div className="flex flex-wrap justify-center gap-6 animate-fadeIn">
                    {[
                      { 
                        icon: (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        ),
                        text: "Text Analysis",
                        description: "Instant text verification"
                      },
                      {
                        icon: (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        ),
                        text: "Image Recognition",
                        description: "Extract text from images"
                      },
                      {
                        icon: (
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        ),
                        text: "Voice Input",
                        description: "Speak to analyze"
                      }
                    ].map((feature, index) => (
                      <div 
                        key={index} 
                        className="group flex flex-col items-center w-48 p-6 rounded-xl 
                          bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm 
                          border border-white/10 hover:border-yellow-500/30 
                          transform hover:-translate-y-1 transition-all duration-300
                          hover:shadow-lg hover:shadow-yellow-500/10"
                      >
                        <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500 
                          group-hover:bg-yellow-500/20 transition-colors duration-300">
                          {feature.icon}
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-white">
                          {feature.text}
                        </h3>
                        <p className="mt-2 text-sm text-gray-400 text-center">
                          {feature.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Scroll indicator */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12 px-4 sm:px-6 lg:px-8`}>
              <div className="max-w-3xl mx-auto">
                <div className={`${
                  darkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
                    : 'bg-gradient-to-br from-white to-gray-50'
                } rounded-2xl shadow-2xl p-8 backdrop-blur-sm border ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-center mb-8 gap-3">
                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Fake News Detector
                    </h1>
                  </div>

                  <div className="relative space-y-6">
                    <div className={`relative group ${
                      darkMode ? 'bg-gray-800/50' : 'bg-white'
                    } rounded-xl shadow-sm border-2 ${
                      darkMode ? 'border-gray-700' : 'border-gray-200'
                    } hover:border-yellow-500/50 transition-colors duration-300`}>
                      <textarea
                        className={`w-full p-4 outline-none resize-none rounded-t-xl ${
                          darkMode ? 'bg-transparent text-white placeholder-gray-400' : 'bg-transparent text-gray-900'
                        } min-h-[120px] transition-all duration-300`}
                        rows="4"
                        placeholder="Enter or paste news text here..."
                        value={newsText}
                        onChange={(e) => setNewsText(e.target.value)}
                        disabled={loading}
                      />
                      <div className={`flex justify-end gap-2 p-2 border-t ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          className={`p-2 rounded-lg hover:bg-gray-100/10 transition-colors duration-300 group`}
                          onClick={() => fileInputRef.current.click()}
                          title="Upload Image"
                        >
                          <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'} group-hover:text-yellow-500 transition-colors`} 
                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <div className="relative">
                          <button
                            className={`p-2 rounded-lg transition-all relative ${
                              isListening 
                                ? 'bg-red-500/10 text-red-500' 
                                : `hover:opacity-80 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`
                            }`}
                            onClick={handleVoiceInput}
                            title={isListening ? 'Listening...' : 'Voice Input'}
                          >
                            {isListening && (
                              <span className="absolute inset-0 rounded-lg animate-ping bg-red-400 opacity-20"></span>
                            )}
                            <svg className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </button>
                          {isListening && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap animate-fadeIn">
                              Listening...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                          loading 
                            ? 'bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-yellow-500/25'
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
                      <div className={`mt-8 p-6 rounded-xl transform transition-all duration-300 ${
                        darkMode ? 'bg-gray-800/50' : 'bg-white'
                      } border-2 ${
                        result.toLowerCase().includes('fake')
                          ? 'border-red-500/20 shadow-red-500/10'
                          : 'border-green-500/20 shadow-green-500/10'
                      }`}>
                        <div className="flex items-center gap-3 mb-4">
                          <svg className={`w-6 h-6 ${
                            result.toLowerCase().includes('fake') ? 'text-red-500' : 'text-green-500'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {result.toLowerCase().includes('fake') ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            Analysis Result
                          </h2>
                        </div>
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
            </div>
          </>
        } />
        <Route path="/trending" element={<TrendingNews />} />
      </Routes>
    </div>
  );
}
