const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzkrLj5kD6dX5on-oQ_2aMPJYfx3rnRZktGhdzLnwRbkYLAr6JzbBm9JQZ2sTB9uU0_Mw/exec";

export async function fetchOrders() {
  const res = await fetch(WEB_APP_URL);
  const json = await res.json();

  // ✅ ALWAYS return array
  return Array.isArray(json.data) ? json.data : [];
}

export async function updateOrderStatus(rowIndex, status) {
  const form = new URLSearchParams();
  form.append("action", "update");
  form.append("rowIndex", rowIndex);
  form.append("status", status);

  const res = await fetch(WEB_APP_URL, {
    method: "POST",
    body: form,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res.json();
}
