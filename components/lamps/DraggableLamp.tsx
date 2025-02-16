import { StyleSheet, View, Pressable } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  SharedValue,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ui/ThemedText";

interface DraggableLampProps {
  id: number;
  name: string;
  initialX: number;
  initialY: number;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (x: number, y: number) => void;
  canvasWidth: number;
  canvasHeight: number;
  scale: SharedValue<number>;
  canvasTranslateX: SharedValue<number>;
  canvasTranslateY: SharedValue<number>;
}

export function DraggableLamp({
  id,
  name,
  initialX,
  initialY,
  isSelected,
  onSelect,
  onPositionChange,
  canvasWidth,
  canvasHeight,
  scale,
  canvasTranslateX,
  canvasTranslateY,
}: DraggableLampProps) {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);
  const context = useSharedValue({ x: 0, y: 0 });

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((event) => {
      // Allow any position including negative values
      translateX.value = context.value.x + event.translationX / scale.value;
      translateY.value = context.value.y + event.translationY / scale.value;
    })
    .onEnd(() => {
      runOnJS(onPositionChange)(translateX.value, translateY.value);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.lamp, animatedStyle]}>
        <View style={styles.lampWrapper}>
          <Pressable
            style={[styles.lampCircle, isSelected && styles.selectedLamp]}
            onPress={onSelect}
          >
            <ThemedText style={{ fontWeight: "bold" }}>{id}</ThemedText>
          </Pressable>

          <ThemedText style={styles.lampText}>{name}</ThemedText>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  lamp: {
    position: "absolute",
  },
  lampWrapper: {
    alignItems: "center",
  },
  lampCircle: {
    width: 60,
    height: 60,
    // width: "100%",
    // height: "100%",
    // borderRadius: 0,
    backgroundColor: "#2979FF",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedLamp: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  lampText: {
    fontSize: 12,
    color: "#fff",
  },
});
