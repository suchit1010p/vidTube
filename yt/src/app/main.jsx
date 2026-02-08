// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import App from "./App";

// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </QueryClientProvider>
//   </React.StrictMode>
// );



import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

// Optimized QueryClient configuration for scalability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Performance optimizations
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 min
      gcTime: 10 * 60 * 1000, // 10 minutes - keep unused data in cache for 10 min
      retry: (failureCount, error) => {
        // Don't retry on auth errors (401, 403)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Don't retry on client errors (400-499)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry server errors (500+) up to 2 times
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // UX optimizations
      refetchOnWindowFocus: false, // Don't refetch on tab focus (too aggressive)
      refetchOnReconnect: true, // Refetch on reconnect
      refetchOnMount: true, // Refetch on component mount if stale
    },
    mutations: {
      retry: false, // Don't retry mutations by default
      // Global error handling for mutations
      onError: (error) => {
        console.error('Mutation error:', error);
        // You can add global error notifications here
      },
    },
  },
});

// Enable development tools
if (import.meta.env.DEV) {
  window.queryClient = queryClient;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);