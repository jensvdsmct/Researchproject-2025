import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

interface PadProps {
  index: number;
  label: string;
  style?: any;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  editing: boolean;
}

const Pad: React.FC<PadProps> = ({
  index,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  style,
  editing,
  label,
}) => {
  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onLongPress={onLongPress}
      style={[
        styles.pressable,
        style,
        {
          borderColor: editing ? "#eee" : "transparent",
          borderWidth: editing ? 2 : 0,
        },
      ]}
      hitSlop={8}
      pressRetentionOffset={8}
      android_disableSound={true}
      unstable_pressDelay={0}
    >
      <View key={index} style={styles.themedView}>
        <ThemedText type="defaultSemiBold" style={styles.themedText}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "30%",
    height: "20%",
    backgroundColor: "#333",
    borderRadius: 8,
    borderStyle: "dashed",
  },
  themedView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  themedText: {
    color: "#fff",
    backgroundColor: "#000",
    padding: 4,
    borderRadius: 8,
  },
});

export default Pad;
