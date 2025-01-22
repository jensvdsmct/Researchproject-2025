import React, { createContext, useContext } from "react";
import useBLE from "@/hooks/useBLE";

const BLEContext = createContext<any>(null);

export const BLEProvider = ({ children }: { children: React.ReactNode }) => {
  const ble = useBLE(); // Single instance of useBLE
  return <BLEContext.Provider value={ble}>{children}</BLEContext.Provider>;
};

export const useBLEContext = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLEContext must be used within BLEProvider");
  }
  return context;
};
