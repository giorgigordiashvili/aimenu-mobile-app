// Mock implementation for QR scanner API
export async function tablesScanCreate({ qr_code }) {
  // Simulate a successful API response
  return {
    data: {
      restaurant_slug: "mock-restaurant",
      session_id: "mock-session-id",
      table_id: "mock-table-id",
    },
  };
}
