import { ThemedView } from "@/components/ui/ThemedView";
import { LampCanvas } from "@/components/lamps/LampCanvas";
import { useState } from "react";
import ChannelView from "@/components/channels/channelView";

import { draggableFixture } from "@/types/fixture";
import { Fixture } from "@/types/fixture";

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
            name: "Sound Control",
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
        channel: 10,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 11,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 12,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 13,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 14,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound Control",
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
        channel: 15,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 16,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 17,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 18,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 19,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound Control",
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
        channel: 20,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Green",
        type: "Color",
        subtype: "Green",
        channel: 21,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Blue",
        type: "Color",
        subtype: "Blue",
        channel: 22,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Dimmer",
        type: "Intensity",
        channel: 23,
        multipurpose: false,
        value: 0,
      },
      {
        name: "Effects",
        type: "Effects",
        channel: 24,
        multipurpose: true,
        subChannels: [
          {
            name: "Sound Control",
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

let selectedFixture = null;

// Map every fixture to a draggable fixture
// Add 70 to the x position to space them out
const initialLamps = initialFixture.map((fixture, index) => ({
  fixture,
  x: index * 70 + 10,
  y: 10,
}));

export default function Index() {
  const [lamps, setLamps] = useState(initialLamps);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const handleLampPositionChange = (lampId: number, x: number, y: number) => {
    setLamps((current) =>
      current.map((lamp) =>
        lamp.fixture.id === lampId ? { ...lamp, x, y } : lamp
      )
    );
  };

  const handleLampSelect = (lampId: number) => {
    const fixture = lamps.find((lamp) => lamp.fixture.id === lampId)?.fixture;
    setSelectedFixture(fixture || null);
  };

  return (
    <ThemedView style={{ flex: 1, flexDirection: "column" }}>
      <LampCanvas
        lamps={lamps}
        onLampPositionChange={handleLampPositionChange}
        onLampSelect={handleLampSelect}
      />
      <ChannelView fixture={selectedFixture || null} />
    </ThemedView>
  );
}
