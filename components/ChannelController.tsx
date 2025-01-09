import { PropsWithChildren, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import VerticalSlider from "rn-vertical-slider";
import Slider from "@react-native-community/slider";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export function ChannelController({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [value, setValue] = useState(0);
  return (
    <ThemedView>
      <ThemedText type="defaultSemiBold">{title}</ThemedText>
      <VerticalSlider
        value={value}
        onChange={(value) => setValue(value)}
        height={200}
        width={40}
        step={1}
        min={0}
        max={100}
        borderRadius={5}
        minimumTrackTintColor="#2979FF"
        maximumTrackTintColor="#D1D1D6"
        showIndicator
        renderIndicator={() => (
          <View
            style={{
              height: 40,
              width: 40,
              backgroundColor: "#2979FF",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>{value}</Text>
          </View>
        )}
        containerStyle={{ backgroundColor: "#e0e0e0", borderRadius: 10 }}
        sliderStyle={{ backgroundColor: "#fff", borderRadius: 5 }}
      />
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        step={1}
        maximumValue={100}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        value={value}
        onValueChange={(value) => setValue(value)}
        vertical
      />
    </ThemedView>
  );
}
