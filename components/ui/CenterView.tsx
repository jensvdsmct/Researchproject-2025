import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

export type CenterViewProps = ViewProps;

export function CenterView({ style, children }: CenterViewProps) {
  return (
    <View style={[{ justifyContent: "center", alignItems: "center" }, style]}>
      {children}
    </View>
  );
}
