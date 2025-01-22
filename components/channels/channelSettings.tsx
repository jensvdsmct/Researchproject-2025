import { ThemedView } from "@/components/ui/ThemedView";
import { View, Switch } from "react-native";
import { ThemedText } from "../ui/ThemedText";

interface ChannelSettingsProps {
  onCombineChannelsChange: (enabled: boolean) => void;
  combineChannels: boolean;
}

export function ChannelSettings({
  onCombineChannelsChange,
  combineChannels,
}: ChannelSettingsProps) {
  return (
    <ThemedView
      style={{
        gap: 16,
        padding: 16,
        width: 164,
        height: "auto",
        borderRadius: 8,
        borderColor: "#eee",
        borderWidth: 2,
      }}
    >
      <ThemedText style={{ fontWeight: "bold" }}>Channel Settings</ThemedText>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText>Combine</ThemedText>
        <Switch
          value={combineChannels}
          onValueChange={onCombineChannelsChange}
          trackColor={{ false: "#767577", true: "#2979FF" }}
          thumbColor={combineChannels ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>
    </ThemedView>
  );
}
