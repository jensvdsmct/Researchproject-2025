import { PropsWithChildren, useEffect, useState } from "react";
import { View, Text } from "react-native";
import VerticalSlider from "rn-vertical-slider";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Button from "./Button";
import { CenterView } from "./CenterView";

export function ChannelController({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [value, setValue] = useState(0);
  const [oldValue, setoldValue] = useState(0);
  const [flash, setFlash] = useState(false);
  const [borderColor, setBorderColor] = useState("#eee");

  useEffect(() => {
    setBorderColor(flash ? "#2979FF" : "#eee");
  }, [flash]);

  return (
    <ThemedView
      style={{
        gap: 16,
        padding: 16,
        width: 112,
        height: 332,
        borderRadius: 8,
        borderColor: borderColor,
        borderWidth: 2,
      }}
    >
      <ThemedText style={{ textAlign: "center" }} type="defaultSemiBold">
        {title}
      </ThemedText>
      <CenterView>
        <VerticalSlider
          value={value}
          onChange={setValue}
          height={200}
          width={40}
          step={1}
          min={0}
          max={100}
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
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>{value}</Text>
            </View>
          )}
          containerStyle={{ backgroundColor: "#e0e0e0", borderRadius: 8 }}
          sliderStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
        />
      </CenterView>
      <CenterView>
        <Button
          buttonBackgroundColor="#FF2929"
          label="Flash"
          onPressIn={() => {
            if (flash) return;
            setoldValue(value);
            setValue(100);
            setFlash(true);
          }}
          onPressOut={() => {
            setValue(oldValue);
            setFlash(false);
          }}
        />
      </CenterView>
    </ThemedView>
  );
}
