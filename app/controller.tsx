import { ThemedView } from "@/components/ui/ThemedView";
import { LampCanvas } from "@/components/lamps/LampCanvas";
import { useState } from "react";
import ChannelView from "@/components/channels/channelView";

import { draggableFixture } from "@/types/fixture";
import { Fixture } from "@/types/fixture";
import { Stack } from "expo-router";
import { BluetoothOff } from "lucide-react-native";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { Modal } from "react-native-paper";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const initialFixture: Fixture[] = [
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
        type: "Color",
        subtype: "Red",
        channel: 1,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 2,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 3,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 4,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 5,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound",
            type: "Sound",
            range: { start: 1, end: 5 },
          },
          {
            name: "Strobe",
            type: "Strobe",
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
        type: "Color",
        subtype: "Red",
        channel: 6,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 7,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 8,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 9,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 10,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound",
            type: "Sound",
            range: { start: 1, end: 5 },
          },
          {
            name: "Strobe",
            type: "Strobe",
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
        type: "Color",
        subtype: "Red",
        channel: 11,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 12,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 13,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 14,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 15,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound",
            type: "Sound",
            range: { start: 1, end: 5 },
          },
          {
            name: "Strobe",
            type: "Strobe",
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
        type: "Color",
        subtype: "Red",
        channel: 16,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 17,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 18,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 19,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 20,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound",
            type: "Sound",
            range: { start: 1, end: 5 },
          },
          {
            name: "Strobe",
            type: "Strobe",
            range: { start: 11, end: 255 },
          },
        ],
      },
    ],
  },
];

// Map every fixture to a draggable fixture
// Add 90 to the x position to space them out
const initialLamps = initialFixture.map((fixture, index) => ({
  fixture,
  x: 10,
  y: index * 90 + 10,
}));

export default function Index() {
  const [lamps, setLamps] = useState(initialLamps);
  const [selectedFixtures, setSelectedFixtures] = useState<Fixture[]>([]);

  const handleLampPositionChange = (lampId: number, x: number, y: number) => {
    setLamps((current) =>
      current.map((lamp) =>
        lamp.fixture.id === lampId ? { ...lamp, x, y } : lamp
      )
    );
  };

  const handleLampSelect = (lampIds: number[]) => {
    const fixtures = lamps
      .filter((lamp) => lampIds.includes(lamp.fixture.id))
      .map((lamp) => lamp.fixture);
    setSelectedFixtures(fixtures);
  };

  return (
    <ThemedView style={{ flex: 1, flexDirection: "column" }}>
      <LampCanvas
        lamps={lamps}
        onLampPositionChange={handleLampPositionChange}
        onLampSelect={handleLampSelect}
      />
      <ChannelView fixtures={selectedFixtures} />
    </ThemedView>
  );
}
