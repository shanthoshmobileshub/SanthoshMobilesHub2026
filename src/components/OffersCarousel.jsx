import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";

export default function OffersCarousel() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        async function fetchOffers() {
            try {
                const res = await fetch(`${API_URL}?action=getOffers`);
                const json = await res.json();
                if (json.data && Array.isArray(json.data)) {
                    setOffers(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch offers", err);
            } finally {
                setLoading(false);
            }
        }
        fetchOffers();
    }, []);

    useEffect(() => {
        if (offers.length <= 1) return;
        const timer = setInterval(() => {
            setIndex(i => (i + 1) % offers.length);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, [offers.length]);

    if (loading) return null; // Or a skeleton loader
    if (offers.length === 0) return null; // Hide if no offers

    return (
        <div className="w-full bg-black relative overflow-hidden group">
            <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${index * 100}%)` }}
            >
                {offers.map((offer, i) => (
                    <div key={offer.id || i} className="w-full flex-shrink-0 relative">
                        {/* 
               Checking if title implies a link? 
               For now, simple div or link to shop if generic. 
               The user didn't specify linking logic, just "latest offers and deals".
            */}
                        <img
                            src={offer.image?.startsWith('http') ? offer.image : `${import.meta.env.BASE_URL}${offer.image?.startsWith('/') ? offer.image.slice(1) : offer.image}`}
                            alt={offer.title || "Offer"}
                            className="w-full h-auto max-h-[600px] object-contain md:object-cover"
                        />
                        {/* Optional Overlay Text if needed, but "Poster" implies image has text */}
                    </div>
                ))}
            </div>

            {/* Navigation Dots if multiple */}
            {offers.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {offers.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white w-6' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}

            {/* Arrows */}
            {offers.length > 1 && (
                <>
                    <button
                        onClick={() => setIndex((index - 1 + offers.length) % offers.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={() => setIndex((index + 1) % offers.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        &#10095;
                    </button>
                </>
            )}
        </div>
    );
}
