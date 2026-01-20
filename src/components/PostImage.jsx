import React, { useState, useEffect } from 'react';

const API_URL = "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";

const PostImage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${API_URL}?action=getOffers`);
        const json = await res.json();
        setOffers(Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        setError("Failed to fetch offers.");
        console.error("Fetch offers failed", e);
      }
      setLoading(false);
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden">
      <h2 className="text-2xl font-bold text-center my-4">LATEST COLLECTIONS</h2>
      <div className="flex animate-scroll">
        {offers.map((offer) => (
          <div key={offer.id} className="flex-shrink-0 w-full p-4">
            <img src={offer.image} alt={offer.title} className="w-full h-auto rounded-lg shadow-lg border-4 border-white" />
            <div className="text-center">
              <h3 className="text-xl font-bold mt-2">{offer.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostImage;
