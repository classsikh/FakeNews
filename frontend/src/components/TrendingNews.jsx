import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TrendingNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const response = await axios.get('/api/trending-news');
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching trending news:', error);
      }
      setLoading(false);
    };

    fetchTrendingNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Trending News Analysis
        </h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {news.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 mb-4">{item.text}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.result === 'fake' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {item.result.toUpperCase()}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
