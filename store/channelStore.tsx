import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { channelData } from "@/types/fixture";
import { useBLEContext } from "@/store/bleContext";
import { Platform } from "react-native";

type ChannelContextType = {
  channelValues: channelData[];
  setChannelValue: (channel: number, value: number) => void;
  getChannelDataAsBytes: (channelValues: channelData[]) => Uint8Array;
};

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [channelValues, setChannelValues] = useState<channelData[]>([]);
  const { sendChannelData, connectedDevice } = useBLEContext();
  const pendingChanges = useRef<channelData[]>([]);
  const isUpdating = useRef(false);

  // Effect to send batched changes
  useEffect(() => {
    if (pendingChanges.current.length > 0 && !isUpdating.current) {
      if (Platform.OS !== "web" && connectedDevice) {
        sendChannelData(pendingChanges.current);
      }
      pendingChanges.current = [];
    }
  });

  const setChannelValue = (channel: number, value: number) => {
    isUpdating.current = true;
    setChannelValues((prev) => {
      const newValues = [...prev];
      const existingIndex = newValues.findIndex((cd) => cd.channel === channel);
      const currentValue = existingIndex >= 0 ? newValues[existingIndex].value : 0;

      // Only proceed if the value has actually changed
      if (currentValue !== value) {
        if (existingIndex >= 0) {
          newValues[existingIndex] = { channel, value };
        } else {
          newValues.push({ channel, value });
        }

        // Add to pending changes instead of sending immediately
        const existingChange = pendingChanges.current.findIndex(c => c.channel === channel);
        if (existingChange >= 0) {
          pendingChanges.current[existingChange].value = value;
        } else {
          pendingChanges.current.push({ channel, value });
        }

        return newValues;
      }
      
      return prev;
    });
    isUpdating.current = false;
  };

  const getChannelDataAsBytes = (channelValues: channelData[]): Uint8Array => {
    const maxChannel = Math.max(...channelValues.map((cd) => cd.channel));
    const byteArray = new Uint8Array(maxChannel);
    channelValues.forEach((cd) => {
      byteArray[cd.channel - 1] = cd.value;
    });
    return byteArray;
  };

  return (
    <ChannelContext.Provider
      value={{ channelValues, setChannelValue, getChannelDataAsBytes }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannelStore = () => {
  const context = useContext(ChannelContext);
  if (!context) {
    throw new Error("useChannelStore must be used within ChannelProvider");
  }
  return context;
};
