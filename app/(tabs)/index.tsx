import HomeScreen from "../../src/screens/HomeScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "../../src/context/CartContext";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <HomeScreen />
      </CartProvider>
    </QueryClientProvider>
  );
}
