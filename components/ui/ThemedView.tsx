import { View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  centered?: boolean;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  centered,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View
      style={[
        { backgroundColor },
        centered && { justifyContent: "center", alignItems: "center" },
        style,
      ]}
      {...otherProps}
    />
  );
}
