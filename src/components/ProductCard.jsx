import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { FiHeart, FiShoppingCart } from 'react-icons/fi'

export default function ProductCard({ product }) {
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
    <div className="w-64 border rounded overflow-hidden shadow-sm bg-white">
      <div className="cursor-pointer" onClick={() => id && navigate(`/product/${id}`)} aria-label={`View ${title}`}>
        <img src={image} alt={title} className="w-full h-40 object-contain bg-white" />
        <div className="p-3">
          <div className="font-semibold text-sm truncate">{title}</div>
          <div className="text-xs text-gray-500">{brand}</div>
          <div className="mt-2 font-bold">{price ? `₹${price}` : 'Coming Soon'}</div>
        </div>
      </div>

      <div className="p-3 pt-0 flex items-center justify-between gap-2">
        <button
          onClick={() => addToCart(product)}
          className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded text-sm"
          aria-label={`Add ${title} to cart`}
        >
          <FiShoppingCart /> Add
        </button>

        <button
          onClick={() => toggleWishlist(product)}
          className={`p-2 rounded ${inWishlist ? 'text-red-500' : 'text-gray-500'} hover:bg-gray-50`}
          aria-label={inWishlist ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
        >
          <FiHeart />
        </button>
      </div>
    </div>
  );
}