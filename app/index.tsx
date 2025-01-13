import Channels from "@/components/Channels";
import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native";

const lights = Array.from({ length: 33 }, (_, i) => ({
  name: `Light ${i + 1}`,
  value: 0,
}));

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Channels channels={lights} />
    </ThemedView>
  );
}
