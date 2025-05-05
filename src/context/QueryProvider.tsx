// src/context/QueryProvider.tsx
'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // Optional: for dev tools

function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use useState to ensure QueryClient is only created once per component instance
  const [queryClient] = useState(() => new QueryClient({
     defaultOptions: {
        queries: {
          // Configure default options for queries if needed
          // staleTime: 5 * 60 * 1000, // 5 minutes
        },
      },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} /> {/* Optional dev tools */}
    </QueryClientProvider>
  );
}

export default QueryProvider;
