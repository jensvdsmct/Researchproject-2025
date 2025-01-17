import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { ChannelController } from "@/components/channels/channelController";
import { ChannelFilter } from "@/components/channels/channelFilter";
import { Fixture } from "@/types/fixture";
import { ThemedText } from "../ui/ThemedText";
import { ThemedView } from "../ui/ThemedView";
import { FilterState } from "@/components/channels/channelFilter";

const ChannelView = ({ fixture }: { fixture?: Fixture | null }) => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    intensity: true,
    color: true,
    position: true,
    effects: true,
  });

  if (!fixture) {
    return (
      <ThemedView centered style={{ height: 332, padding: 16 }}>
        <ThemedText>No fixture available</ThemedText>
      </ThemedView>
    );
  }

  const availableTypes = new Set(fixture.channels.map((c) => c.type.toLowerCase()));

  const getFilteredChannels = () => {
    if (!fixture) return [];
    return fixture.channels.filter((channel) => {
      switch (channel.type.toLowerCase()) {
        case "intensity":
          return activeFilters.intensity;
        case "color":
          return activeFilters.color;
        case "position":
          return activeFilters.position;
        case "effects":
          return activeFilters.effects;
        default:
          return true;
      }
    });
  };

  return (
    <ScrollView
      horizontal
      style={{
        borderColor: "white",
        borderWidth: 0,
        borderTopWidth: 1,
        padding: 16,
        maxHeight: 380, // Ensure it doesn't grow beyond 332
        width: "100%", // Ensure it takes the full width of the screen
      }}
      contentContainerStyle={{
        height: 332,
      }}
      showsHorizontalScrollIndicator
    >
      <View style={{ flexDirection: "row", gap: 16 }}>
        <ChannelFilter
          onFiltersChange={setActiveFilters}
          availableTypes={[...availableTypes]}
        />
        {getFilteredChannels().map((channel, index) => (
          <ChannelController key={index} channel={channel} />
        ))}
      </View>
    </ScrollView>
  );
};

export default ChannelView;
