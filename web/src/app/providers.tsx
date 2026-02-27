"use client";
import { Toaster } from "sonner";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import "./globals.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* //{" "} */}
      <ReduxProvider store={store}>
        {children}
        <Toaster />
        {/* //{" "} */}
      </ReduxProvider>
    </>
  );
}
