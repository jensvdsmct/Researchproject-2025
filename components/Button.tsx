import { StyleSheet, View, Pressable, Text } from "react-native";

export default function Button({
  label,
  style,
  buttonBackgroundColor = "#2979FF",
  buttonForegroundColor = "#fff",
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
}: {
  label: string;
  style?: any;
  buttonBackgroundColor?: string;
  buttonForegroundColor?: string;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
}) {
  return (
    <View
      style={[
        styles.buttonContainer,
        { backgroundColor: buttonBackgroundColor },
        style,
      ]}
    >
      <Pressable
        style={[styles.button]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onLongPress={onLongPress}
      >
        <Text
          style={[styles.buttonLabel, { color: buttonForegroundColor }]}
          selectable={false}
        >
          {label}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 8,
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
