import { PropsWithChildren, useEffect, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView";
import { FilterCheckbox } from "@/components/channels/filterCheckbox";
import { Palette, Sun, Move, Sparkles } from "lucide-react-native";
import { View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface FilterState {
  intensity: boolean;
  color: boolean;
  position: boolean;
  effects: boolean;
}

export function ChannelFilter({
  onFiltersChange,
  availableTypes = [],
}: PropsWithChildren & {
  onFiltersChange?: (filters: FilterState) => void;
  availableTypes?: string[];
}) {
  const textColor = useThemeColor({}, "text");
  const [filters, setFilters] = useState([
    {
      name: "intensity",
      selected: true,
      icon: <Sun size={24} color={textColor} />,
      label: "Intensity",
    },
    {
      name: "color",
      selected: true,
      icon: <Palette size={24} color={textColor} />,
      label: "Color",
    },
    {
      name: "position",
      selected: true,
      icon: <Move size={24} color={textColor} />,
      label: "Position",
    },
    {
      name: "effects",
      selected: true,
      icon: <Sparkles size={24} color={textColor} />,
      label: "Effects",
    },
  ]);

  const displayedFilters = filters.filter((f) =>
    availableTypes.includes(f.name)
  );

  useEffect(() => {
    const filterState: FilterState = {
      intensity: filters.find((f) => f.name === "intensity")?.selected ?? false,
      color: filters.find((f) => f.name === "color")?.selected ?? false,
      position: filters.find((f) => f.name === "position")?.selected ?? false,
      effects: filters.find((f) => f.name === "effects")?.selected ?? false,
    };
    onFiltersChange?.(filterState);
  }, [filters]);

  const toggleAll = (checked: boolean) => {
    const newFilters = filters.map((f) => ({ ...f, selected: checked }));
    setFilters(newFilters);
  };

  return (
    <ThemedView
      style={{
        gap: 16,
        padding: 16,
        width: 164,
        height: "auto",
        borderRadius: 8,
        borderColor: "#eee",
        borderWidth: 2,
      }}
    >
      <View style={{ gap: 8 }}>
        <FilterCheckbox
          checked={displayedFilters.every((f) => f.selected)}
          onValueChange={toggleAll}
          label="Select All"
        />

        {displayedFilters.map((filter) => (
          <FilterCheckbox
            key={filter.name}
            checked={filter.selected}
            onValueChange={(checked) => {
              const newFilters = filters.map((f) =>
                f.name === filter.name ? { ...f, selected: checked } : f
              );
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
