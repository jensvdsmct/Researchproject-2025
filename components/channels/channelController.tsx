import { PropsWithChildren, useEffect, useState } from "react";
import { View, Text } from "react-native";
import VerticalSlider from "rn-vertical-slider";

import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import Button from "../ui/Button";

import { channel } from "@/types/fixture";

export function ChannelController({
  channel,
}: PropsWithChildren & { channel: channel }) {
  const [value, setValue] = useState(0);
  const [oldValue, setOldValue] = useState(0);
  const [flash, setFlash] = useState(false);
  const [borderColor, setBorderColor] = useState("#eee");

  useEffect(() => {
    setBorderColor(flash ? "#2979FF" : "#eee");
  }, [flash]);

  return (
    <ThemedView
      style={{
        padding: 8,
        width: 112,
        height: 332,
        borderRadius: 8,
        borderColor: borderColor,
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        borderWidth: 2,
      }}
    >
      <ThemedView centered style={{ gap: 0, paddingVertical: 0 }}>
        <ThemedText
          selectable={false}
          style={{
            fontWeight: "bold",
            fontSize: 12,
            paddingVertical: 0,
          }}
        >
          {channel.channel}
        </ThemedText>
        <ThemedText
          selectable={false}
          style={{ textAlign: "center", fontSize: 16 }}
          type="defaultSemiBold"
        >
          {channel.name}
        </ThemedText>
      </ThemedView>
      <ThemedView centered>
        <VerticalSlider
          value={value}
          onChange={setValue}
          height={200}
          width={40}
          step={1}
          min={0}
          max={255}
          borderRadius={8}
          minimumTrackTintColor="#2979FF"
          maximumTrackTintColor={flash ? "#2979FF" : "#fff"}
          showIndicator
          renderIndicatorHeight={200}
          renderIndicator={() => (
            <View
              style={{
                paddingVertical: 16,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {Math.round((value / 255) * 100)}
              </Text>
            </View>
          )}
          containerStyle={{ backgroundColor: "#e0e0e0", borderRadius: 8 }}
          sliderStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
        />
      </ThemedView>
      <ThemedView centered>
        <Button
          buttonBackgroundColor="#FF2929"
          label="Flash"
          onPressIn={() => {
            if (flash) return;
            setOldValue(value);
            setValue(255);
            setFlash(true);
          }}
          onPressOut={() => {
            setValue(oldValue);
            setFlash(false);
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}
