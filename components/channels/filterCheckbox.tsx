import Checkbox from "expo-checkbox";
import { StyleSheet, View } from "react-native";
import { ReactNode } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

export function FilterCheckbox({
  checked,
  onValueChange,
  label,
  icon,
  disabled,
}: {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <View style={styles.section}>
      <Checkbox
        style={styles.checkbox}
        value={checked}
        onValueChange={onValueChange}
        color={checked ? "#2979FF" : undefined}
        disabled={disabled}
      />
      {icon && <ThemedView style={styles.icon}>{icon}</ThemedView>}
      {label && (
        <ThemedText selectable={false} style={styles.label}>
          {label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    margin: 4,
  },
  label: {
    fontSize: 15,
  },
  icon: {
    marginRight: 4,
  },
});
