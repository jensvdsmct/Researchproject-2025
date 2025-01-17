import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { DraggableLamp } from "./DraggableLamp";
import { draggableFixture } from "@/types/fixture";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";

interface LampCanvasProps {
  lamps: draggableFixture[];
  onLampSelect?: (lampId: number) => void;
  onLampPositionChange?: (lampId: number, x: number, y: number) => void;
}

export function LampCanvas({
  lamps,
  onLampSelect,
  onLampPositionChange,
}: LampCanvasProps) {
  const [selectedLampId, setSelectedLampId] = useState<number | null>(null);
  const [selectedLampIds, setSelectedLampIds] = useState<number[]>([]);
  const selectionStartX = useSharedValue(0);
  const selectionStartY = useSharedValue(0);
  const selectionEndX = useSharedValue(0);
  const selectionEndY = useSharedValue(0);

  const handleLampSelect = (lampId: number) => {
    setSelectedLampId(lampId);
    onLampSelect?.(lampId);
  };

  const handlePositionChange = (lampId: number, x: number, y: number) => {
    onLampPositionChange?.(lampId, x, y);
  };

  const handleCanvasPress = () => {
    setSelectedLampId(null);
    onLampSelect?.(-1);
  };

  function updateSelectedLamps() {
    const x1 = Math.min(selectionStartX.value, selectionEndX.value);
    const y1 = Math.min(selectionStartY.value, selectionEndY.value);
    const x2 = Math.max(selectionStartX.value, selectionEndX.value);
    const y2 = Math.max(selectionStartY.value, selectionEndY.value);

    const insideBox = lamps
      .filter(({ x, y }) => x >= x1 && x <= x2 && y >= y1 && y <= y2)
      .map((lamp) => lamp.fixture.id);

    setSelectedLampIds(insideBox);
    onLampSelect?.(insideBox.length ? insideBox[0] : -1); // optional
  }

  const selectionGesture = Gesture.Pan()
    .minDistance(5) // add this so short taps register on lamps
    .onBegin((evt) => {
      selectionStartX.value = evt.x;
      selectionStartY.value = evt.y;
      selectionEndX.value = evt.x;
      selectionEndY.value = evt.y;
      setSelectedLampIds([]);
    })
    .onUpdate((evt) => {
      selectionEndX.value = evt.x;
      selectionEndY.value = evt.y;
      runOnJS(updateSelectedLamps)();
    })
    .onEnd(() => {
      runOnJS(() => {
        selectionStartX.value = -2;
        selectionStartY.value = -2;
        selectionEndX.value = -2;
        selectionEndY.value = -2;
      })();
    });

  const selectionRectStyle = useAnimatedStyle(() => {
    const x = Math.min(selectionStartX.value, selectionEndX.value);
    const y = Math.min(selectionStartY.value, selectionEndY.value);
    const width = Math.abs(selectionEndX.value - selectionStartX.value);
    const height = Math.abs(selectionEndY.value - selectionStartY.value);

    return {
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.75)",
      backgroundColor: "rgba(255,255,255,0.2)",
    };
  });

  return (
    <GestureDetector gesture={selectionGesture}>
      <Animated.View style={styles.canvas}>
        {lamps.map((lamp) => (
          <DraggableLamp
            key={lamp.fixture.id}
            id={lamp.fixture.id}
            name={lamp.fixture.name}
            initialX={lamp.x}
            initialY={lamp.y}
            isSelected={selectedLampIds.includes(lamp.fixture.id)}
            onSelect={() => handleLampSelect(lamp.fixture.id)}
            onPositionChange={(x, y) =>
              handlePositionChange(lamp.fixture.id, x, y)
            }
          />
        ))}
        <Animated.View style={selectionRectStyle} pointerEvents="none" />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    width: "100%",
    height: "100%",
  },
});
