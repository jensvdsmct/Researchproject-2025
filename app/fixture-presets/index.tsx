import { View, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import Button from '@/components/ui/Button';

export default function FixturePresetsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Fixture Presets</ThemedText>
      
      <Link href="/fixture-presets/create" asChild>
        <Pressable>
          <Button label="Create New Preset" style={styles.createButton} />
        </Pressable>
      </Link>

      {/* TODO: Add list of existing presets */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  createButton: {
    marginTop: 16,
  },
});
