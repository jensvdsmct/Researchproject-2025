import { PropsWithChildren, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import VerticalSlider from "rn-vertical-slider";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import Button from "../ui/Button";

import { channel } from "@/types/fixture";
import { useChannelStore } from "@/store/channelStore";

interface ChannelControllerProps {
  channel: channel & { channelIds?: number[] };
  combinedChannels?: boolean;
}

export function ChannelController({
  channel,
  combinedChannels,
}: ChannelControllerProps) {
  const { channelValues, setChannelValue } = useChannelStore();
  const [flash, setFlash] = useState(false);
  const [oldValues, setOldValues] = useState<number[]>([]);
  const [borderColor, setBorderColor] = useState("#eee");
  const [currentSubChannelIndex, setCurrentSubChannelIndex] = useState(0);

  // Use stored values
  const channelIds =
    combinedChannels && channel.channelIds
      ? channel.channelIds
      : [channel.channel];

  // Calculate the average value from channelValues
  const storedValues = channelIds.map((id) =>
    channelValues.find((cv) => cv.channel === id)?.value ?? 0
  );
  const averageVal =
    storedValues.reduce((sum, v) => sum + v, 0) / channelIds.length;
  const sliderValue = Math.round((averageVal / 255) * 100);

  // Get current subchannel if multipurpose
  const currentSubChannel =
    channel.multipurpose && channel.subChannels
      ? channel.subChannels[currentSubChannelIndex]
      : null;

  const handlePrevSubChannel = () => {
    if (!channel.multipurpose || !channel.subChannels) return;
    setCurrentSubChannelIndex((prev) =>
      prev > 0 ? prev - 1 : channel.subChannels.length - 1
    );
  };

  const handleNextSubChannel = () => {
    if (!channel.multipurpose || !channel.subChannels) return;
    setCurrentSubChannelIndex((prev) =>
      prev < channel.subChannels.length - 1 ? prev + 1 : 0
    );
  };

  useEffect(() => {
    setBorderColor(flash ? "#2979FF" : "#eee");
  }, [flash]);

  const handleValueChange = (val: number) => {
    channelIds.forEach((id) => setChannelValue(id, val));
  };

  const channelDisplay =
    combinedChannels && channel.channelIds
      ? `${channel.channelIds.join(", ")}`
      : channel.channel.toString();

  return (
    <ThemedView style={[styles.container, { borderColor: borderColor }]}>
      <ThemedView centered style={styles.header}>
        <ThemedText selectable={false} style={styles.channelNumber}>
          {channelDisplay}
        </ThemedText>
        <View style={styles.nameContainer}>
          {channel.multipurpose && (
            <Pressable onPress={handlePrevSubChannel}>
              <ChevronLeft size={20} color="#fff" />
            </Pressable>
          )}
          <ThemedText selectable={false} style={styles.channelName}>
            {channel.multipurpose && currentSubChannel
              ? currentSubChannel.name
              : channel.name}
          </ThemedText>
          {channel.multipurpose && (
            <Pressable onPress={handleNextSubChannel}>
              <ChevronRight size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      </ThemedView>
      <ThemedView centered>
        <VerticalSlider
          value={sliderValue}
          onChange={(percent: number) => {
            // const scaledValue = Math.round((percent / 100) * 255);
            // handleValueChange(scaledValue);
          }}
          onComplete={(percent: number) => {
            const scaledValue = Math.round((percent / 100) * 255);
            handleValueChange(scaledValue);
          }}
          height={200}
          width={40}
          step={1}
          min={0}
          max={100}
          borderRadius={8}
          sliderStyle={{ backgroundColor: flash ? "#2979FF" : "#eee" }}
          minimumTrackTintColor="#2979FF"
          maximumTrackTintColor={flash ? "#2979FF" : "#eee"}
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
                {sliderValue}
              </Text>
            </View>
          )}
        />
      </ThemedView>
      <ThemedView centered>
        <Button
          buttonBackgroundColor="#FF2929"
          label="Flash"
          onPressIn={() => {
            if (flash) return;
            setOldValues(storedValues);
            handleValueChange(255);
            setFlash(true);
          }}
          onPressOut={() => {
            oldValues.forEach((prev, i) => {
              setChannelValue(channelIds[i], prev);
            });
            setFlash(false);
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    width: 112,
    height: 332,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "space-between",
  },
  header: {
    gap: 0,
    paddingVertical: 0,
  },
  channelNumber: {
    fontWeight: "bold",
    fontSize: 12,
    paddingVertical: 0,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  channelName: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
