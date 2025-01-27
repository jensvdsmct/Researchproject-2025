import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import Pad from "@/components/pads/Pad";
import {
  Pressable,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Pencil, PencilOff, Plus } from "lucide-react-native";
import { useState, useRef, useEffect, useMemo } from "react";
import { Effect, padPreset } from "@/types/padeffects";
import { useChannelStore } from "@/store/channelStore";
import { channelData, channelType } from "@/types/fixture";
import { useBLEContext } from "@/store/bleContext";

const isColorChannel = (type: channelType) =>
  [
    channelType.Red,
    channelType.Green,
    channelType.Blue,
    channelType.Color,
  ].includes(type);

const isIntensityChannel = (type: channelType) =>
  type === channelType.Intensity;

const findMatchingChannels = (
  channelMap: Map<channelType, any[]>,
  effectType: channelType
) => {
  const directMatches = channelMap.get(effectType) || [];
  const subChannelMatches = Array.from(channelMap.entries())
    .filter(([_, channels]) =>
      channels.some((ch) =>
        ch.subChannels?.some((sub) => sub.type === effectType)
      )
    )
    .flatMap(([_, channels]) => channels);

  return [...directMatches, ...subChannelMatches];
};

export default function Pads() {
  const [editing, setEditing] = useState(false);
  const { initialFixtures } = useChannelStore();
  const { sendChannelDataDirect } = useBLEContext();

  // Pre-calculate channel mappings and store them in presets
  const effectPresets = useMemo<padPreset[]>(() => {
    // Create a channel lookup map for faster access
    const channelMap = new Map();
    initialFixtures.forEach((fixture) => {
      fixture.channels.forEach((channel) => {
        const types = [channel.type, channel.subtype];
        types.forEach((type) => {
          if (!type) return;
          if (!channelMap.has(type)) {
            channelMap.set(type, []);
          }
          channelMap.get(type).push(channel);
        });

        // Add channel to map for each subchannel type
        channel.subChannels?.forEach((sub) => {
          if (!channelMap.has(sub.type)) {
            channelMap.set(sub.type, []);
          }
          channelMap.get(sub.type).push(channel);
        });
      });
    });

    const basePresets = [
      {
        id: "red",
        name: "Red",
        effects: [
          { type: channelType.Red, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ff0000",
      },
      {
        id: "green",
        name: "Green",
        effects: [
          { type: channelType.Green, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#00ff00",
      },
      {
        id: "blue",
        name: "Blue",
        effects: [
          { type: channelType.Blue, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#0000ff",
      },
      {
        id: "yellow",
        name: "Yellow",
        effects: [
          { type: channelType.Red, value: 175 },
          { type: channelType.Green, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ffff00",
      },
      {
        id: "purple",
        name: "Purple",
        effects: [
          { type: channelType.Red, value: 255 },
          { type: channelType.Blue, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ff00ff",
      },
      {
        id: "orange",
        name: "Orange",
        effects: [
          { type: channelType.Red, value: 255 },
          { type: channelType.Green, value: 175 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ff8800",
      },
      {
        id: "cyan",
        name: "Cyan",
        effects: [
          { type: channelType.Green, value: 255 },
          { type: channelType.Blue, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#00ffff",
      },
      {
        id: "white",
        name: "White",
        effects: [
          { type: channelType.Red, value: 255 },
          { type: channelType.Green, value: 255 },
          { type: channelType.Blue, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ffffff",
      },
      {
        id: "red-strobo",
        name: "Red Strobo",
        effects: [
          { type: channelType.Red, value: 255 },
          { type: channelType.Strobe, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ff0000",
      },
      {
        id: "white-strobo",
        name: "White Strobo",
        effects: [
          { type: channelType.Red, value: 255 },
          { type: channelType.Green, value: 255 },
          { type: channelType.Blue, value: 255 },
          { type: channelType.Strobe, value: 255 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#ffffff",
      },
      {
        id: "sound-control",
        name: "Sound Control",
        effects: [
          { type: channelType.Sound, value: 5 },
          { type: channelType.Intensity, value: 255 },
        ],
        color: "#333",
      },
    ];

    return basePresets.map((preset) => {
      // Separate color and intensity channels
      const colorChannels = new Map<number, number>();
      const intensityChannels = new Map<number, number>();
      const otherChannels = new Map<number, number>();

      preset.effects.forEach((effect) => {
        const matchingChannels = findMatchingChannels(channelMap, effect.type);

        matchingChannels.forEach((channel) => {
          // If it's a direct match or subtype match
          if (channel.type === effect.type || channel.subtype === effect.type) {
            if (
              isColorChannel(channel.type) ||
              isColorChannel(channel.subtype || channel.type)
            ) {
              colorChannels.set(channel.channel, effect.value);
            } else if (isIntensityChannel(channel.type)) {
              intensityChannels.set(channel.channel, effect.value);
            } else {
              otherChannels.set(channel.channel, effect.value);
            }
          }
          // If it's a subchannel match
          else if (
            channel.subChannels?.some((sub) => sub.type === effect.type)
          ) {
            const subchannel = channel.subChannels.find(
              (sub) => sub.type === effect.type
            )!;
            const scaledValue = Math.floor(
              subchannel.range.start +
                (effect.value / 255) *
                  (subchannel.range.end - subchannel.range.start)
            );
            otherChannels.set(channel.channel, scaledValue);
          }
        });
      });

      // Combine channels in specific order: colors first, then intensity, then others
      const orderedChannelData = [
        ...Array.from(colorChannels.entries()),
        ...Array.from(intensityChannels.entries()),
        ...Array.from(otherChannels.entries()),
      ].map(([channel, value]) => ({
        channel,
        value,
      }));

      return {
        ...preset,
        channelData: orderedChannelData,
      };
    });
  }, [initialFixtures]);

  const toggleEditing = () => setEditing((prev) => !prev);

  const handleEffectStart = (preset: padPreset) => {
    if (!preset.channelData?.length) return;
    sendChannelDataDirect(preset.channelData);
  };

  const handleEffectEnd = (preset: padPreset) => {
    if (!preset.channelData?.length) return;
    // Reuse the same array to avoid allocation
    const zeroedChannels = preset.channelData.map((cd) => ({
      channel: cd.channel,
      value: 0,
    }));
    sendChannelDataDirect(zeroedChannels);
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      {/* <ThemedText type="title">Effect Pads Page</ThemedText> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 8,
          padding: 16,
          width: "100%",
        }}
      >
        {/* <Pressable
          onPress={() => console.log("Pressed button 1")}
          style={{
            backgroundColor: "#333",
            padding: 8,
            borderRadius: 8,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#eee", fontWeight: 600, fontSize: 16 }}>
            Button 1
          </Text>
        </Pressable>
        <Pressable
          onPress={() => console.log("Pressed button 2")}
          style={{
            backgroundColor: "#333",
            padding: 8,
            borderRadius: 8,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#eee", fontWeight: 600, fontSize: 16 }}>
            Button 2
          </Text>
        </Pressable> */}
        <Pressable
          onPress={toggleEditing}
          style={{ backgroundColor: "#333", padding: 8, borderRadius: 8 }}
        >
          {/* <Pencil size={32} color="#eee" />
          Or 
          <PencilOff size={32} color="#eee" /> */}

          {editing ? (
            <PencilOff size={32} color="#eee" />
          ) : (
            <Pencil size={32} color="#eee" />
          )}
        </Pressable>
      </View>

      {/* A grid of 3x4 buttons */}
      <ThemedView
        style={{
          flex: 1,
          padding: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
          }}
          pointerEvents="box-none"
        >
          {effectPresets.map((preset, index) => (
            <Pad
              key={preset.id}
              editing={editing}
              index={index + 1}
              onPressIn={() => handleEffectStart(preset)}
              onPressOut={() => handleEffectEnd(preset)}
              label={preset.name}
              style={{
                backgroundColor: preset.color,
              }}
            />
          ))}
          {editing ? (
            <Pressable
              onPress={() => console.log("Pressed button 1")}
              style={{
                width: "30%",
                height: "20%",
                backgroundColor: "#333",
                borderRadius: 8,
                borderStyle: "dashed",
              }}
            >
              <View
                key={"add"}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Plus size={32} color="#fff" />
              </View>
            </Pressable>
          ) : null}
        </View>
      </ThemedView>
    </ThemedView>
  );
}
