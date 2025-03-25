import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

export default function TrendingNews() {
  const { darkMode } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImage = "https://via.placeholder.com/400x200?text=No+Image";

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const response = await axios.get("https://newsdata.io/api/1/news?apikey=pub_761844bd98fb110b7d3f6ccaa45dffed38fe8&q=india%20news&country=in&language=en,pi");
        setNews(response.data.results);
      } catch (error) {
        console.error('Error fetching trending news:', error);
      }
      setLoading(false);
    };

    fetchTrendingNews();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'} mb-8`}>
          Trending News
        </h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.article_id} className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
                <img
                  src={item.image_url || fallbackImage}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImage;
                  }}
                />
                <div className="p-4">
                  <h2 className={`text-xl font-semibold mb-2 line-clamp-2 hover:line-clamp-none ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {item.title}
                  </h2>
                  <p className={`mb-4 line-clamp-3 hover:line-clamp-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 rounded-md bg-yellow-600 hover:bg-yellow-700 text-black transition-colors"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                    <span className="text-sm text-gray-500">
                      {new Date(item.pubDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
