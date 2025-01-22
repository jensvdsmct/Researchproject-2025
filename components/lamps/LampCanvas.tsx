import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import { DraggableLamp } from "./DraggableLamp";
import { draggableFixture } from "@/types/fixture";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface LampCanvasProps {
  lamps: draggableFixture[];
  onLampSelect?: (lampIds: number[]) => void; // Changed to accept array
  onLampPositionChange?: (lampId: number, x: number, y: number) => void;
}

export function LampCanvas({
  lamps,
  onLampSelect,
  onLampPositionChange,
}: LampCanvasProps) {
  const [selectedLampIds, setSelectedLampIds] = useState<number[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });
  const canvasRef = useRef<View>(null);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      // Reduce pinch sensitivity by scaling the change
      scale.value = savedScale.value * (1 + (e.scale - 1) * 0.3);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  useEffect(() => {
    if (Platform.OS === "web" && canvasRef.current) {
      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        // Reduce wheel sensitivity
        const wheelDelta = -event.deltaY / 500;
        scale.value = savedScale.value * Math.exp(wheelDelta);
        savedScale.value = scale.value;
      };

      const element = canvasRef.current;
      element.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        element.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  useLayoutEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.measure((x, y, width, height) => {
        setCanvasDimensions({ width, height });
      });
    }
  }, []);

  const handleLampSelect = useCallback(
    (lampId: number) => {
      setSelectedLampIds((prev) => {
        const newSelection = prev.includes(lampId)
          ? prev.filter((id) => id !== lampId) // Remove if already selected
          : [...prev, lampId]; // Add if not selected
        requestAnimationFrame(() => {
          onLampSelect?.(newSelection);
        });
        return newSelection;
      });
    },
    [onLampSelect]
  );

  const handlePositionChange = useCallback(
    (lampId: number, x: number, y: number) => {
      onLampPositionChange?.(lampId, x, y);
    },
    [onLampPositionChange]
  );

  const handleCanvasPress = useCallback(() => {
    setSelectedLampIds([]);
    requestAnimationFrame(() => {
      onLampSelect?.([]);
    });
  }, [onLampSelect]);

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.canvasContainer]}>
        <Pressable
          ref={canvasRef}
          style={styles.canvas}
          onPress={handleCanvasPress}
        >
          <Animated.View style={[styles.contentContainer, animatedStyle]}>
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
                canvasWidth={canvasDimensions.width}
                canvasHeight={canvasDimensions.height}
                scale={scale}
                canvasTranslateX={translateX}
                canvasTranslateY={translateY}
              />
            ))}
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    flex: 1,
    overflow: "hidden",
  },
  canvas: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  contentContainer: {
    width: "100%",
    height: "100%",
  },
});
