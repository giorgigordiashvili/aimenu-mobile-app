import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../src/i18n";
import { CartProvider } from "../src/context/CartContext";
import { AuthProvider } from "../src/context/AuthContext";

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
