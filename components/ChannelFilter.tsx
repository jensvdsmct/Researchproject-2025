import { PropsWithChildren, useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { FilterCheckbox } from "@/components/filterCheckbox";
import { Palette, Sun, Move } from "lucide-react-native";
import { View } from "react-native";

export function ChannelFilter({
  children,
  title,
}: PropsWithChildren & { title: string }) {
  const [flash, setFlash] = useState(false);
  const [borderColor, setBorderColor] = useState("#eee");

  const [filters, setFilters] = useState([
    {
      name: "intensity",
      selected: false,
      icon: <Sun size={24} color={"#fff"} />,
      label: "Intensity",
    },
    {
      name: "color",
      selected: false,
      icon: <Palette size={24} color={"#fff"} />,
      label: "Color",
    },
    {
      name: "position",
      selected: false,
      icon: <Move size={24} color={"#fff"} />,
      label: "Position",
    },
  ]);

  useEffect(() => {
    setBorderColor(flash ? "#2979FF" : "#eee");
  }, [flash]);

  const toggleAll = (checked: boolean) => {
    const newFilters = filters.map((f) => ({ ...f, selected: checked }));
    setFilters(newFilters);
  };

  return (
    <ThemedView
      style={{
        gap: 16,
        padding: 16,
        width: 200,
        height: "auto",
        borderRadius: 8,
        borderColor: borderColor,
        borderWidth: 2,
      }}
    >
      <View style={{ gap: 8 }}>
        <FilterCheckbox
          checked={filters.every((f) => f.selected)}
          onValueChange={toggleAll}
          label="Select All"
        />

        {filters.map((filter, index) => (
          <FilterCheckbox
            key={filter.name}
            checked={filter.selected}
            onValueChange={(checked) => {
              const newFilters = [...filters];
              newFilters[index].selected = checked;
              setFilters(newFilters);
            }}
            label={filter.label}
            icon={filter.icon}
          />
        ))}
      </View>
    </ThemedView>
  );
}
