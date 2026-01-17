import React, { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzkrLj5kD6dX5on-oQ_2aMPJYfx3rnRZktGhdzLnwRbkYLAr6JzbBm9JQZ2sTB9uU0_Mw/exec";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    title: "",
    brand: "Apple",
    category: "Mobiles",
    price: "",
    image: ""
  });

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "products") fetchProducts();
  }, [activeTab]);

  // -------------------------
  // FETCHERS
  // -------------------------
  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getOrders`);
      const json = await res.json();
      setOrders(Array.isArray(json.data) ? json.data : []);
    } catch (e) { console.error("Fetch orders failed", e); }
    setLoading(false);
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=getProducts`);
      const json = await res.json();
      setProducts(Array.isArray(json.data) ? json.data : []);
    } catch (e) { console.error("Fetch products failed", e); }
    setLoading(false);
  }

  // -------------------------
  // ORDER ACTIONS
  // -------------------------
  async function updateStatus(index, status, phone, name, product) {
    if (!window.confirm(`Update status to ${status}?`)) return;

    // Optimistic update
    const newOrders = [...orders];
    newOrders[index][11] = status; // Assuming index 11 is Status
    setOrders(newOrders);

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // CORS fix for GAS
      body: JSON.stringify({ action: "updateStatus", rowIndex: index, status })
    });

    if (status === "Approved") {
      // WhatsApp logic here (omitted for brevity, can be re-added if needed)
    }
  }

  // -------------------------
  // PRODUCT ACTIONS
  // -------------------------
  async function handleAddProduct(e) {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return alert("Title and Price required");

    setActionLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "addProduct",
          ...newProduct
        })
      });
      alert("Product Added Successfully!");
      setNewProduct({ title: "", brand: "Apple", category: "Mobiles", price: "", image: "" }); // Reset
      fetchProducts(); // Refresh list
    } catch (err) {
      alert("Failed to add product");
    }
    setActionLoading(false);
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    setActionLoading(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "deleteProduct", id })
      });
      // Optimistic remove
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
    setActionLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-primary-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-heading font-bold text-slate-800 dark:text-white">Admin Dashboard</h2>
          <div className="flex bg-white dark:bg-primary-light rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
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
              Manage Products
            </button>
          </div>
        </header>

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
                            onChange={(e) => updateStatus(i, e.target.value, row[2], row[1], row[5])}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    className="w-full bg-gray-50 dark:bg-primary-dark border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-accent"
                    placeholder="https://..."
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                  <p className="text-xs text-gray-400 mt-1">Upload image to Imgur/Drive and paste direct link here.</p>
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
                  <p className="text-gray-500 mb-2">No products found in database.</p>
                  <p className="text-sm text-yellow-600">Ensure you have updated the Google Apps Script!</p>
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

      </div>
    </div>
  );
}
