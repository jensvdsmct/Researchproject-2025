import { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { DraggableLamp } from './DraggableLamp';
import { draggableFixture } from '@/types/fixture';

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

  return (
    <Pressable style={styles.canvas} onPress={handleCanvasPress}>
      {lamps.map((lamp) => (
        <DraggableLamp
          key={lamp.fixture.id}
          id={lamp.fixture.id}
          name={lamp.fixture.name}
          initialX={lamp.x}
          initialY={lamp.y}
          isSelected={selectedLampId === lamp.fixture.id}
          onSelect={() => handleLampSelect(lamp.fixture.id)}
          onPositionChange={(x, y) => handlePositionChange(lamp.fixture.id, x, y)}
        />
      ))}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    width: '100%',
    height: '100%',
  },
});
