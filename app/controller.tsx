import { ThemedView } from "@/components/ui/ThemedView";
import { LampCanvas } from "@/components/lamps/LampCanvas";
import { useState } from "react";
import ChannelView from "@/components/channels/channelView";

import { draggableFixture } from "@/types/fixture";
import { Fixture, channelType } from "@/types/fixture";
import { Stack } from "expo-router";
import { BluetoothOff } from "lucide-react-native";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { ThemedText } from "@/components/ui/ThemedText";
import { Modal } from "react-native-paper";
import { Platform, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useChannelStore } from "@/store/channelStore";

export default function Index() {
  const [selectedFixtures, setSelectedFixtures] = useState<Fixture[]>([]);

  const { initialFixtures } = useChannelStore();

  // Map every fixture to a draggable fixture
  // Add 90 to the x position to space them out
  const initialLamps = initialFixtures.map((fixture, index) => ({
    fixture,
    x: 10,
    y: index * 90 + 10,
  }));

  const [lamps, setLamps] = useState(initialLamps);

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
