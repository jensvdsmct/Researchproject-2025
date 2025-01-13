import React from "react";
import { ScrollView, View } from "react-native";
import { ChannelController } from "@/components/ChannelController";
import { ChannelFilter } from "@/components/ChannelFilter";

const Channels = ({ channels }) => {
  return (
    <ScrollView
      horizontal
      style={{
        padding: 16,
        height: 332,
        width: "100%", // Ensure it takes the full width of the screen
      }}
      contentContainerStyle={{
        height: 332,
        alignItems: "center", // Align content in the center
      }}
      showsHorizontalScrollIndicator
    >
      <View style={{ flexDirection: "row", gap: 16 }}>
        <ChannelFilter title="Master" />
        {channels.map((light, index) => (
          <ChannelController key={index} title={light.name} />
        ))}
      </View>
    </ScrollView>
  );
};

export default Channels;
