import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart, FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  if (!product) {
    return (
      <div className="w-64 p-4 border rounded text-center">
        <div className="text-gray-500">Product data missing</div>
      </div>
    );
  }

  const { id, title, brand, price, image } = product;
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { items: wishlistItems, toggle: toggleWishlist } = useWishlist();

  const inWishlist = wishlistItems.find(i => i.id === id);

  return (
    <div className="group w-64 bg-white dark:bg-primary-light/50 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-glow hover:-translate-y-2 transition-all duration-300 relative backdrop-blur-sm">

      {/* GLOW EFFECT BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="cursor-pointer relative z-10" onClick={() => id && navigate(`/product/${id}`)} aria-label={`View ${title}`}>
        {/* IMAGE CONTAINER */}
        <div className="relative w-full h-48 bg-white/5 p-4 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-primary-dark/20 group-hover:bg-transparent transition-colors"></div>
          <img
            src={image?.startsWith('http') ? image : `${import.meta.env.BASE_URL}${image?.startsWith('/') ? image.slice(1) : image}`}
            alt={title}
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="p-4">
          <div className="text-xs text-accent uppercase tracking-wider mb-1 opacity-80">{brand}</div>
          <div className="font-heading font-semibold text-slate-900 dark:text-gray-100 text-lg truncate mb-1 group-hover:text-accent transition-colors">{title}</div>
          <div className="font-bold text-xl text-slate-900 dark:text-white">{price ? `₹${price}` : 'Coming Soon'}</div>
        </div>
      </div>

      <div className="px-4 pb-5 flex items-center justify-between gap-3 relative z-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-accent to-accent-hover text-primary-dark font-bold rounded-lg text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <FiShoppingCart /> Add
        </button>

        <button
          onClick={() => toggleWishlist(product)}
          className={`p-2 rounded-lg border ${inWishlist ? 'bg-red-500/10 border-red-500 text-red-500' : 'border-gray-600 text-gray-400 hover:border-accent hover:text-accent'} transition-colors`}
        >
          <FiHeart className={inWishlist ? "fill-current" : ""} />
        </button>
      </div>
    </div>
  );
};

export default memo(ProductCard);