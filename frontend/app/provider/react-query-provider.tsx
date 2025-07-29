/*
===============================================================================
  Module: React Query Provider

  Description:
  This module provides a context provider for React Query, integrating it with
  the authentication context and adding a toast notification system.

  Dependencies:
  - @tanstack/react-query
  - sonner
  - ./auth-context

  Usage:
  How to use this module

  Author: ClowderDev
  Created: 2025-07-29
  Updated: N/A
===============================================================================
*/

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./auth-context";

export const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
