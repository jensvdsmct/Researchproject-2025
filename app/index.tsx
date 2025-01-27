import Button from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { router } from "expo-router";

export default function Index() {
  return (
    <ThemedView
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThemedView
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedText type="title">Web DMX</ThemedText>
        <ThemedText type="subtitle">By Jens Vanderstraeten</ThemedText>
      </ThemedView>
      <ThemedView
        style={{
          flex: 1,
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Button
          label="Fixture editor"
          buttonBackgroundColor="#2979FF"
          onPress={() => router.push("/fixture-presets")}
        />

        {/* Divider */}
        <ThemedView
          style={{
            width: "35%",
            height: 2,
            borderRadius: 20,
            backgroundColor: "#444",
          }}
        />

        <Button
          label="Controller"
          buttonBackgroundColor="#efefef"
          buttonForegroundColor="#122"
          onPress={() => router.push("/controller")}
        />

        <Button
          label="Effect Pads"
          buttonBackgroundColor="#efefef"
          buttonForegroundColor="#122"
          onPress={() => router.push("/effect-pads")}
        />
      </ThemedView>
    </ThemedView>
  );
}
