import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { getAllProjects } from "./services/projects";
import { getAllTrailers } from "./services/trailers";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — avoids redundant refetches on public pages
      retry: 1,
    },
  },
});

// Prefetch critical data in parallel with React rendering — breaks the serial
// chain HTML → JS → Component Mount → useQuery → Supabase API
queryClient.prefetchQuery({ queryKey: ["projects"], queryFn: getAllProjects });
queryClient.prefetchQuery({ queryKey: ["trailers"], queryFn: getAllTrailers });

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);
