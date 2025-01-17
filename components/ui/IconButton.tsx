import React, { PropsWithChildren } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";

export default function IconButton({
  children,
  style,
  buttonBackgroundColor = "#2979FF",
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
}: PropsWithChildren & {
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
        {children}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    borderRadius: 8,
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    // color: "#fff",
    // fontSize: 10,
    // fontWeight: "bold",
  },
  buttonIcon: {
    paddingRight: 8,
  },
});
