import React, { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzkrLj5kD6dX5on-oQ_2aMPJYfx3rnRZktGhdzLnwRbkYLAr6JzbBm9JQZ2sTB9uU0_Mw/exec";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  async function fetchOrders() {
    setLoading(true);
    const res = await fetch(`${API_URL}?action=getOrders`);
    const json = await res.json();

    // Expecting: { success: true, data: [...] }
    setOrders(Array.isArray(json.data) ? json.data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status + trigger WhatsApp/SMS
  async function updateStatus(index, status, phone, name, product) {
    // 1️⃣ Update status in Google Sheet
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "updateStatus",
        rowIndex: index,
        status
      })
    });

    // 2️⃣ If status is Approved → send WhatsApp/SMS
    if (status === "Approved") {
      await sendWhatsapp(phone, name, product);
      await sendSMS(phone, name, product);
    }

    fetchOrders();
  }

  // WhatsApp message sender
  async function sendWhatsapp(phone, name, product) {
    const message = `Hello ${name}, your order for ${product} has been Approved. - Santhosh Mobiles`;

    // 👇 Replace with actual WhatsApp API endpoint
    await fetch("https://your-whatsapp-provider.com/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "712899145",
        to: phone,
        message: message
      })
    });
  }

  // SMS message sender
  async function sendSMS(phone, name, product) {
    const message = `Order Approved: ${product}. Thank you - Santhosh Mobiles`;

    // 👇 Replace with actual SMS API endpoint
    await fetch("https://your-sms-provider.com/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: "712899145",
        phone: phone,
        message: message
      })
    });
  }

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Santhosh Mobiles – Admin Order Dashboard</h2>

      {orders.length === 0 && <p>No Orders Found</p>}

      {orders.length > 0 && (
        <table border="1" cellPadding="6" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Product</th>
              <th>Amount</th>
              <th>UPI ID</th>
              <th>Transaction ID</th>
              <th>Screenshot</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((row, i) => (
              <tr key={i}>
                <td>{new Date(row[0]).toLocaleString()}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[5]}</td>
                <td>₹{row[6]}</td>
                <td>{row[7]}</td>
                <td>{row[8]}</td>

                <td>
                  {row[9] ? (
                    <a href={row[9]} target="_blank" rel="noreferrer">
                      <img src={row[9]} width="60" alt="Screenshot" />
                    </a>
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{row[10]}</td>

                <td>
                  <select
                    defaultValue={row[11]}
                    onChange={(e) =>
                      updateStatus(i, e.target.value, row[2], row[1], row[5])
                    }
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Denied">Denied</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() =>
                      updateStatus(i, "Approved", row[2], row[1], row[5])
                    }
                  >
                    Approve
                  </button>
                  <br />
                  <button
                    onClick={() =>
                      updateStatus(i, "Denied", row[2], row[1], row[5])
                    }
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
