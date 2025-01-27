import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { channelData, channelType, Fixture } from "@/types/fixture";
import { useBLEContext } from "@/store/bleContext";
import { Platform } from "react-native";

type ChannelContextType = {
  initialFixtures: Fixture[];
  channelValues: channelData[];
  setChannelValue: (channeldata: channelData) => void;
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

  const initialFixtures: Fixture[] = [
    {
      id: 1,
      name: "LED PARty TCL Spot",
      manufacturer: "Eurolite",
      numberOfChannels: 5,
      startAddress: 1,
      endAddress: 5,
      channels: [
        {
          name: "Red",
          type: channelType.Color,
          subtype: channelType.Red,
          channel: 1,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Green",
          type: channelType.Color,
          subtype: channelType.Green,
          channel: 2,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Blue",
          type: channelType.Color,
          subtype: channelType.Blue,
          channel: 3,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Dimmer",
          type: channelType.Intensity,
          channel: 4,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Effects",
          type: channelType.Effects,
          channel: 5,
          multipurpose: true,
          subChannels: [
            {
              name: "Sound",
              type: channelType.Sound,
              range: { start: 0, end: 5 },
            },
            {
              name: "Strobe",
              type: channelType.Strobe,
              range: { start: 11, end: 255 },
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "LED PARty TCL Spot",
      manufacturer: "Eurolite",
      numberOfChannels: 5,
      startAddress: 6,
      endAddress: 10,
      channels: [
        {
          name: "Red",
          type: channelType.Color,
          subtype: channelType.Red,
          channel: 6,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Green",
          type: channelType.Color,
          subtype: channelType.Green,
          channel: 7,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Blue",
          type: channelType.Color,
          subtype: channelType.Blue,
          channel: 8,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Dimmer",
          type: channelType.Intensity,
          channel: 9,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Effects",
          type: channelType.Effects,
          channel: 10,
          multipurpose: true,
          subChannels: [
            {
              name: "Sound",
              type: channelType.Sound,
              range: { start: 1, end: 5 },
            },
            {
              name: "Strobe",
              type: channelType.Strobe,
              range: { start: 11, end: 255 },
            },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "LED PARty TCL Spot",
      manufacturer: "Eurolite",
      numberOfChannels: 5,
      startAddress: 11,
      endAddress: 15,
      channels: [
        {
          name: "Red",
          type: channelType.Color,
          subtype: channelType.Red,
          channel: 11,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Green",
          type: channelType.Color,
          subtype: channelType.Green,
          channel: 12,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Blue",
          type: channelType.Color,
          subtype: channelType.Blue,
          channel: 13,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Dimmer",
          type: channelType.Intensity,
          channel: 14,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Effects",
          type: channelType.Effects,
          channel: 15,
          multipurpose: true,
          subChannels: [
            {
              name: "Sound",
              type: channelType.Sound,
              range: { start: 1, end: 5 },
            },
            {
              name: "Strobe",
              type: channelType.Strobe,
              range: { start: 11, end: 255 },
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "LED PARty TCL Spot",
      manufacturer: "Eurolite",
      numberOfChannels: 5,
      startAddress: 16,
      endAddress: 20,
      channels: [
        {
          name: "Red",
          type: channelType.Color,
          subtype: channelType.Red,
          channel: 16,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Green",
          type: channelType.Color,
          subtype: channelType.Green,
          channel: 17,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Blue",
          type: channelType.Color,
          subtype: channelType.Blue,
          channel: 18,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Dimmer",
          type: channelType.Intensity,
          channel: 19,
          multipurpose: false,
          value: 0,
        },
        {
          name: "Effects",
          type: channelType.Effects,
          channel: 20,
          multipurpose: true,
          subChannels: [
            {
              name: "Sound",
              type: channelType.Sound,
              range: { start: 1, end: 5 },
            },
            {
              name: "Strobe",
              type: channelType.Strobe,
              range: { start: 11, end: 255 },
            },
          ],
        },
      ],
    },
  ];

  const setChannelValue = (channeldata: channelData) => {
    isUpdating.current = true;
    setChannelValues((prev) => {
      const newValues = [...prev];
      const existingIndex = newValues.findIndex(
        (cd) => cd.channel === channeldata.channel
      );
      const currentValue =
        existingIndex >= 0 ? newValues[existingIndex].value : 0;

      // Only proceed if the value has actually changed
      if (currentValue !== channeldata.value) {
        if (existingIndex >= 0) {
          newValues[existingIndex] = { ...channeldata };
        } else {
          newValues.push({ ...channeldata });
        }

        // Add to pending changes instead of sending immediately
        const existingChange = pendingChanges.current.findIndex(
          (c) => c.channel === channeldata.channel
        );
        if (existingChange >= 0) {
          pendingChanges.current[existingChange].value = channeldata.value;
        } else {
          pendingChanges.current.push({ ...channeldata });
        }

        return newValues;
      }

      return prev;
    });
    isUpdating.current = false;
  };

  return (
    <ChannelContext.Provider
      value={{
        channelValues,
        setChannelValue,
        initialFixtures,
      }}
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
