"use client";

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // cache data for 5 minutes
      cacheTime: 1000 * 60 * 30, // data stays in memory for 30 minutes
      refetchOnWindowFocus: false, // optional
    },
  },
});
