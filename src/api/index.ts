// api/index.ts

// -----------------------
// Types
// -----------------------
export interface TableScanResponse {
  restaurant_slug: string;
  session_id: string;
  table_id: string;
}

export interface PayResponse {
  data: {
    success: boolean;
    order_number: string;
    payment_status: "paid" | "pending" | "failed";
    message?: string;
  };
}

// -----------------------
// MOCK IMPLEMENTATIONS
// -----------------------
export async function tablesScanCreate({
  qr_code,
}: {
  qr_code: string;
}): Promise<{ data: TableScanResponse }> {
  // Simulate a successful API response
  return {
    data: {
      restaurant_slug: "mock-restaurant",
      session_id: "mock-session-id",
      table_id: "mock-table-id",
    },
  };
}

export async function payWithCard({
  order_number,
  payment_method_id,
  token,
}: {
  order_number: string;
  payment_method_id: number;
  token: string;
}): Promise<PayResponse> {
  const res = await fetch("https://admin.aimenu.ge/api/v1/payments/pay/card/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order_number, payment_method_id }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data?.error?.message || data?.detail || data?.message || "Payment failed";
    throw new Error(msg);
  }
  return { data };
}

export async function payWithCash({
  order_number,
  token,
}: {
  order_number: string;
  token: string;
}): Promise<PayResponse> {
  const res = await fetch("https://admin.aimenu.ge/api/v1/payments/pay/cash/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ order_number }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg =
      data?.error?.message || data?.detail || data?.message || "Payment failed";
    throw new Error(msg);
  }
  return { data };
}

// -----------------------
// REAL API SKELETON (replace mocks later)
// -----------------------
/*
export async function tablesScanCreate({ qr_code }: { qr_code: string }) {
  const res = await fetch("https://your-api.com/tables/scan/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qr_code }),
  });
  if (!res.ok) throw new Error("Failed to scan table");
  return res.json();
}

export async function payWithCard({ order_number, payment_method_id }: { order_number: string; payment_method_id: number }) {
  const res = await fetch("https://your-api.com/payments/card/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_number, payment_method_id }),
  });
  if (!res.ok) throw new Error("Payment failed");
  return res.json();
}

export async function payWithCash({ order_number }: { order_number: string }) {
  const res = await fetch("https://your-api.com/payments/cash/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_number }),
  });
  if (!res.ok) throw new Error("Payment failed");
  return res.json();
}
*/
