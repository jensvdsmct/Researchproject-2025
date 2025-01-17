import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import Button from '@/components/ui/Button';
import { TextInput } from 'react-native';
import type { FixturePreset, channel } from '@/types/fixture';

export default function CreateFixturePresetScreen() {
  const [preset, setPreset] = useState<Partial<FixturePreset>>({
    channels: [],
    metadata: {
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: "1.0"
    }
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving preset:', preset);
  };

  const addChannel = () => {
    setPreset(prev => ({
      ...prev,
      channels: [...(prev.channels || []), {
        name: '',
        type: '',
        channel: (prev.channels?.length || 0) + 1,
        multipurpose: false
      }]
    }));
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <ThemedText type="title">Create Fixture Preset</ThemedText>
        
        <ThemedView style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Preset Name"
            value={preset.name}
            onChangeText={(text) => setPreset(prev => ({ ...prev, name: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Manufacturer"
            value={preset.manufacturer}
            onChangeText={(text) => setPreset(prev => ({ ...prev, manufacturer: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Fixture Type"
            value={preset.fixtureType}
            onChangeText={(text) => setPreset(prev => ({ ...prev, fixtureType: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Description"
            multiline
            numberOfLines={3}
            value={preset.description}
            onChangeText={(text) => setPreset(prev => ({ ...prev, description: text }))}
          />

          <ThemedText type="subtitle" style={styles.sectionHeader}>Channels</ThemedText>
          {preset.channels?.map((channel, index) => (
            <ThemedView key={index} style={styles.channelContainer}>
              <TextInput
                style={styles.input}
                placeholder="Channel Name"
                value={channel.name}
                onChangeText={(text) => {
                  const updatedChannels = [...(preset.channels || [])];
                  updatedChannels[index] = { ...channel, name: text };
                  setPreset(prev => ({ ...prev, channels: updatedChannels }));
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Channel Type"
                value={channel.type}
                onChangeText={(text) => {
                  const updatedChannels = [...(preset.channels || [])];
                  updatedChannels[index] = { ...channel, type: text };
                  setPreset(prev => ({ ...prev, channels: updatedChannels }));
                }}
              />
            </ThemedView>
          ))}

          <Button
            label="Add Channel"
            onPress={addChannel}
            style={styles.button}
          />

          <Button
            label="Save Preset"
            onPress={handleSave}
            style={styles.button}
            buttonBackgroundColor="#4CAF50"
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    gap: 16,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 8,
  },
  channelContainer: {
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  }
});
