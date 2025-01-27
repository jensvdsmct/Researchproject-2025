import React, { useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { ChannelController } from "@/components/channels/channelController";
import { ChannelFilter } from "@/components/channels/channelFilter";
import { Fixture } from "@/types/fixture";
import { ThemedText } from "../ui/ThemedText";
import { ThemedView } from "../ui/ThemedView";
import { FilterState } from "@/components/channels/channelFilter";
import { ChannelSettings } from "./channelSettings";

const ChannelView = ({ fixtures }: { fixtures: Fixture[] }) => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    intensity: true,
    color: true,
    position: true,
    effects: true,
  });
  const [combineChannels, setCombineChannels] = useState(false);

  if (!fixtures || fixtures.length === 0) {
    return (
      <ThemedView centered style={{ height: 380, padding: 16 }}>
        <ThemedText>No fixtures selected</ThemedText>
      </ThemedView>
    );
  }

  const availableTypes = new Set(
    fixtures.flatMap((fixture) =>
      fixture.channels.map((c) => c.type.toLowerCase())
    )
  );

  const getFilteredChannels = () => {
    if (!fixtures) return [];

    const channels = fixtures.flatMap((fixture) =>
      fixture.channels.filter((channel) => {
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
      })
    );

    if (combineChannels) {
      // Combine channels with same type and subtype
      const combinedChannels = new Map();

      channels.forEach((channel) => {
        const key = `${channel.type}-${channel.subtype || ""}-${channel.name}`;
        if (!combinedChannels.has(key)) {
          combinedChannels.set(key, {
            ...channel,
            channelIds: [channel.channel],
            originalChannel: channel.channel,
          });
        } else {
          const existing = combinedChannels.get(key);
          existing.channelIds.push(channel.channel);
        }
      });

      return Array.from(combinedChannels.values());
    }

    return channels;
  };

  return (
    <ScrollView
      horizontal
      style={{
        borderColor: "white",
        borderWidth: 0,
        borderTopWidth: 1,
        // padding: 16,
        maxHeight: 380, // Ensure it doesn't grow beyond 332
        width: "100%", // Ensure it takes the full width of the screen
      }}
      contentContainerStyle={{
        height: 332,
      }}
      showsHorizontalScrollIndicator
    >
      <View
        style={{
          zIndex: 2,
          flexDirection: "row",
          gap: 16,
          width: "100%",
          padding: 16,
        }}
      >
        <ThemedView
          style={{
            width: 164,
            height: 332,
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <ChannelFilter
            onFiltersChange={setActiveFilters}
            availableTypes={[...availableTypes]}
          />
          <ChannelSettings
            combineChannels={combineChannels}
            onCombineChannelsChange={setCombineChannels}
          />
        </ThemedView>
        {getFilteredChannels().map((channel, index) => (
          <ChannelController
            key={channel.originalChannel || channel.channel}
            channel={channel}
            combinedChannels={combineChannels}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ChannelView;
