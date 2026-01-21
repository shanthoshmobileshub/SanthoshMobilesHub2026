import React, { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyignjYeqRXL-eont5SZ2Nao4e02PMQUuOvUD5s0LzTB932U60p4QRWfXvCa0cIV_ZcQw/exec";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("posts");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    brand: "Apple",
    category: "Mobiles",
    price: "",
    description: "",
    image: "",
    imageBase64: "",
    mimeType: ""
  });

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "products" || activeTab === "posts") fetchProducts();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getOrders`);
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setOrders(json.data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  /* Update fetchProducts to include categories */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let action = "getProducts";
      if (activeTab === "posts") action = "getOffers";
      if (activeTab === "categories") action = "getCategories";

      const res = await fetch(`${API_URL}?action=${action}`);
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        setProducts(json.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  /* Add Category Handler */
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newProduct.title) return alert("Category Name is required");

    setActionLoading(true);
    try {
      const catData = {
        name: newProduct.title,
        link: newProduct.description, // Reusing description field for Link
        image: newProduct.image,
        imageBase64: newProduct.imageBase64,
        mimeType: newProduct.mimeType
      };

      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "addCategory", ...catData })
      });
      alert("Category Added!");
      setNewProduct({ title: "", brand: "Apple", category: "Mobiles", price: "", image: "", description: "", imageBase64: "", mimeType: "" });
      fetchProducts();
    } catch (err) {
      alert("Failed to add category");
    }
    setActionLoading(false);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    setActionLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "deleteCategory", id })
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete");
    }
    setActionLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          imageBase64: reader.result.split(',')[1],
          mimeType: file.type
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "addProduct", ...newProduct })
      });
      alert("Product Added!");
      setNewProduct({ title: "", brand: "Apple", category: "Mobiles", price: "", image: "", description: "", imageBase64: "", mimeType: "" });
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    }
    setActionLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setActionLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "deleteProduct", id })
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to delete");
    }
    setActionLoading(false);
  };

  const updateStatus = async (index, status, orderId) => {
    setActionLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "updateOrder", orderId, status })
      });
      fetchOrders();
    } catch (err) {
      alert("Failed to update");
    }
    setActionLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-primary-dark p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'orders' ? 'bg-accent text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'products' ? 'bg-accent text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'posts' ? 'bg-accent text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            Post Offers
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-6 py-2 rounded-md font-medium transition-all ${activeTab === 'categories' ? 'bg-accent text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            Categories
          </button>
        </div>

        {/* -------------------- ORDERS TAB -------------------- */}
        {activeTab === "orders" && (
          <div className="bg-white dark:bg-primary-light rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading Orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No Orders Found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {orders.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 whitespace-nowrap">{new Date(row[0]).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 dark:text-white">{row[1]}</div>
                          <div className="text-xs text-gray-500">{row[2]}</div>
                        </td>
                        <td className="p-4 text-slate-700 dark:text-gray-300">{row[5]}</td>
                        <td className="p-4 font-bold text-green-600">₹{row[6]}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold 
                               ${row[11] === 'Approved' ? 'bg-green-100 text-green-700' :
                              row[11] === 'Denied' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {row[11] || 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            defaultValue={row[11]}
                            onChange={(e) => updateStatus(i, e.target.value, row[2])}
                            className="bg-gray-50 dark:bg-primary-dark border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs"
                            disabled={actionLoading}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approve</option>
                            <option value="Denied">Deny</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* -------------------- PRODUCTS TAB -------------------- */}
        {activeTab === "products" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ADD PRODUCT FORM */}
            <div className="bg-white dark:bg-primary-light rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-fit sticky top-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add New Product</h3>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="e.g. iPhone 16 Pro"
                    value={newProduct.title}
                    onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand</label>
                    <select
                      className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                      value={newProduct.brand}
                      onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                    >
                      {["Apple", "Samsung", "OnePlus", "Google", "Xiaomi", "Nothing"].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      {["Mobiles", "Laptops", "Tablets", "Accessories", "Smart Watches", "AirPods"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="e.g. 129000"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Description</label>
                    <textarea
                      className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                      placeholder="Enter product features, condition, warranty..."
                      rows="3"
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image (Upload OR URL)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-2"
                    />
                    <div className="text-center text-xs text-gray-400 my-1">- OR -</div>
                    <input
                      className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                      placeholder="https://..."
                      value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  disabled={actionLoading}
                  className="w-full btn-primary py-3 rounded-xl shadow-lg mt-4 disabled:opacity-50"
                >
                  {actionLoading ? "Adding..." : "Add Product"}
                </button>
              </form>
            </div>

            {/* PRODUCT LIST */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="bg-white dark:bg-primary-light rounded-2xl p-8 text-center">Loading Products...</div>
              ) : products.length === 0 ? (
                <div className="bg-white dark:bg-primary-light rounded-2xl p-8 text-center">
                  <p className="text-gray-500 mb-2">No products found.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white dark:bg-primary-light rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex gap-4 items-center">
                      <img src={p.image || "https://via.placeholder.com/150"} alt={p.title} className="w-16 h-16 object-contain bg-gray-50 rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">{p.title}</h4>
                        <div className="text-sm text-gray-500">{p.category}</div>
                        <div className="font-bold text-accent">₹{Number(p.price).toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        disabled={actionLoading}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- POSTS (OFFERS) TAB -------------------- */}
        {activeTab === "posts" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ADD POST FORM */}
            <div className="bg-white dark:bg-primary-light rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-fit sticky top-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add New Offer Banner</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!newProduct.image && !newProduct.imageBase64) return alert("Image URL or Upload required");

                const offerData = {
                  title: newProduct.title || "Offer Banner",
                  image: newProduct.image,
                  imageBase64: newProduct.imageBase64,
                  mimeType: newProduct.mimeType
                };

                setActionLoading(true);
                try {
                  await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain" },
                    body: JSON.stringify({ action: "addOffer", ...offerData })
                  });
                  alert("Offer Posted Successfully!");
                  setNewProduct({ title: "", brand: "Apple", category: "Mobiles", price: "", image: "", description: "", imageBase64: "", mimeType: "" });
                  fetchProducts();
                } catch (err) {
                  console.error(err);
                  alert("Failed to post offer.");
                }
                setActionLoading(false);
              }} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Offer Title (Optional)</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="e.g. Diwali Sale"
                    value={newProduct.title}
                    onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-2"
                  />
                  <div className="text-center text-xs text-gray-400 my-1">- OR -</div>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-600 dark:text-blue-300">
                  Tip: Use landscape images (16:9) for best results.
                </div>

                <button
                  disabled={actionLoading}
                  className="w-full btn-primary py-3 rounded-xl shadow-lg mt-4 disabled:opacity-50"
                >
                  {actionLoading ? "Posting..." : "Post Offer"}
                </button>
              </form>
            </div>

            {/* POSTS LIST */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active Offers</h3>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div className="grid gap-4">
                  {products.map(p => (
                    <div key={p.id} className="relative group bg-white dark:bg-primary-light rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={p.image?.startsWith('http') ? p.image : `${import.meta.env.BASE_URL}${p.image?.startsWith('/') ? p.image.slice(1) : p.image}`}
                        alt={p.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                          onClick={async () => {
                            if (!window.confirm("Delete this offer?")) return;
                            setActionLoading(true);
                            try {
                              await fetch(API_URL, {
                                method: "POST",
                                headers: { "Content-Type": "text/plain" },
                                body: JSON.stringify({ action: "deleteOffer", id: p.id })
                              });
                              fetchProducts(); // Refresh list
                            } catch (e) { alert("Failed to delete"); }
                            setActionLoading(false);
                          }}
                          disabled={actionLoading}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors"
                        >
                          Delete Post
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{p.title}</div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="text-gray-500 text-center py-10">No active offers. Post one to see it on the Homepage!</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- CATEGORIES TAB -------------------- */}
        {activeTab === "categories" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ADD CATEGORY FORM */}
            <div className="bg-white dark:bg-primary-light rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 h-fit sticky top-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Name</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="e.g. Headphones"
                    value={newProduct.title}
                    onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Navigation Link (Optional)</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="e.g. /shop?category=Headphones"
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                  <div className="text-xs text-gray-400 mt-1">Leave empty to auto-generate based on name</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mb-2"
                  />
                  <div className="text-center text-xs text-gray-400 my-1">- OR -</div>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="Image URL"
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-600 dark:text-blue-300">
                  Tip: Use circular or square images (1:1) for best results.
                </div>

                <button
                  disabled={actionLoading}
                  className="w-full btn-primary py-3 rounded-xl shadow-lg mt-4 disabled:opacity-50"
                >
                  {actionLoading ? "Adding..." : "Add Category"}
                </button>
              </form>
            </div>

            {/* CATEGORY LIST */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active Categories</h3>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {products.map(c => (
                    <div key={c.id} className="relative group bg-white dark:bg-primary-light rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-100 dark:border-gray-600">
                        <img
                          src={c.image?.startsWith('http') ? c.image : `${import.meta.env.BASE_URL}${c.image?.startsWith('/') ? c.image.slice(1) : c.image}`}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white mb-1">{c.name}</div>
                      <div className="text-xs text-gray-400 truncate w-full px-2">{c.link}</div>

                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        disabled={actionLoading}
                        className="mt-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-full text-gray-500 text-center py-10">No categories found. Add one to customize the homepage!</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
