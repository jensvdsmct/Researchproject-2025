import Checkbox from "expo-checkbox";
import { StyleSheet, Text, View } from "react-native";
import { ReactNode } from "react";

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
      {icon && <View style={styles.icon}>{icon}</View>}
      {label && <Text style={styles.label}>{label}</Text>}
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
    color: "#fff",
  },
  icon: {
    marginRight: 4,
  },
});
