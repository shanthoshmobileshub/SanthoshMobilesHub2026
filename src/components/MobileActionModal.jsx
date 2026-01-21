import React, { useState } from 'react';

const WHATSAPP_NUMBER = "919790225832";

export default function MobileActionModal({ isOpen, onClose, type }) {
    if (!isOpen) return null;

    const isSell = type === 'sell';
    const title = isSell ? "Sell Your Mobile" : "Exchange Your Mobile";
    const btnText = isSell ? "Send Quote via WhatsApp" : "Request Exchange via WhatsApp";

    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        ram: '',
        storage: '',
        usedYears: '',
        usedMonths: '',
        usedDays: '',
        warranty: 'No',
        expectedPrice: '', // For Sell
        exchangeTarget: '' // For Exchange
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct the "Used Duration" string
        const years = formData.usedYears ? `${formData.usedYears} Years` : '';
        const months = formData.usedMonths ? `${formData.usedMonths} Months` : '';
        const days = formData.usedDays ? `${formData.usedDays} Days` : '';

        // Filter out empty parts and join with commas
        const usedDuration = [years, months, days].filter(Boolean).join(', ') || 'glancing new';

        let message = "";
        if (isSell) {
            message = `*Hello Santhosh Mobiles, I want to SELL my mobile.*\n\n` +
                `*Device Details:*\n` +
                `Brand: ${formData.brand}\n` +
                `Model: ${formData.model}\n` +
                `RAM: ${formData.ram}\n` +
                `Storage: ${formData.storage}\n` +
                `Used: ${usedDuration}\n` +
                `Warranty: ${formData.warranty}\n` +
                `Expected Price: ₹${formData.expectedPrice}\n`;
        } else {
            message = `*Hello Santhosh Mobiles, I want to EXCHANGE my mobile.*\n\n` +
                `*My Device Details:*\n` +
                `Brand: ${formData.brand}\n` +
                `Model: ${formData.model}\n` +
                `RAM: ${formData.ram}\n` +
                `Storage: ${formData.storage}\n` +
                `Used: ${usedDuration}\n` +
                `Warranty: ${formData.warranty}\n\n` +
                `*I want to Exchange with:*\n` +
                `${formData.exchangeTarget}\n`;
        }

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className={`p-6 bg-gradient-to-r ${isSell ? 'from-red-500 to-orange-500' : 'from-blue-500 to-indigo-500'} text-white flex justify-between items-center`}>
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                            <select name="brand" required onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm">
                                <option value="">Select Brand</option>
                                <option value="Apple">Apple</option>
                                <option value="Samsung">Samsung</option>
                                <option value="OnePlus">OnePlus</option>
                                <option value="Xiaomi">Xiaomi</option>
                                <option value="Vivo">Vivo</option>
                                <option value="Oppo">Oppo</option>
                                <option value="Realme">Realme</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                            <input type="text" name="model" required placeholder="e.g. iPhone 13" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RAM</label>
                            <select name="ram" required onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm">
                                <option value="">Select RAM</option>
                                <option value="4GB">4GB</option>
                                <option value="6GB">6GB</option>
                                <option value="8GB">8GB</option>
                                <option value="12GB">12GB</option>
                                <option value="16GB">16GB</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Storage</label>
                            <select name="storage" required onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm">
                                <option value="">Select Storage</option>
                                <option value="64GB">64GB</option>
                                <option value="128GB">128GB</option>
                                <option value="256GB">256GB</option>
                                <option value="512GB">512GB</option>
                                <option value="1TB">1TB</option>
                            </select>
                        </div>
                    </div>

                    {/* NEW: Split Used Duration Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration Used</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="relative">
                                <input type="number" name="usedYears" placeholder="0" min="0" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm" />
                                <span className="absolute right-2 top-2 text-xs text-gray-400">Yrs</span>
                            </div>
                            <div className="relative">
                                <input type="number" name="usedMonths" placeholder="0" min="0" max="11" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm" />
                                <span className="absolute right-2 top-2 text-xs text-gray-400">Mos</span>
                            </div>
                            <div className="relative">
                                <input type="number" name="usedDays" placeholder="0" min="0" max="31" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm" />
                                <span className="absolute right-2 top-2 text-xs text-gray-400">Days</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Warranty Available?</label>
                        <select name="warranty" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    {isSell && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Selling Price (₹)</label>
                            <input type="number" name="expectedPrice" required placeholder="e.g. 25000" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm" />
                        </div>
                    )}

                    {!isSell && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Looking to Exchange With?</label>
                            <input type="text" name="exchangeTarget" required placeholder="e.g. iPhone 15 Pro, Same Brand, or Any" onChange={handleChange} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-800 focus:ring-2 focus:ring-accent p-2 text-sm" />
                        </div>
                    )}

                    <button type="submit" className={`w-full py-3 rounded-xl text-white font-bold shadow-lg transition-all transform hover:scale-[1.02] ${isSell ? 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'}`}>
                        {btnText}
                    </button>

                    <p className="text-xs text-center text-gray-500 mt-2">
                        This will open WhatsApp to send these details directly to our team.
                    </p>
                </form>
            </div>
        </div>
    );
}
