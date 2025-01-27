import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Platform, useColorScheme } from "react-native";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { Stack } from "expo-router";

import {
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
} from "lucide-react-native";

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { ChannelProvider } from "@/store/channelStore";
import { BLEProvider, useBLEContext } from "@/store/bleContext";
import { channelData } from "@/types/fixture";

function NativeHeader() {
  const {
    autoConnectToWebDMX,
    disconnectFromDevice,
    connectedDevice,
    sendChannelData,
  } = useBLEContext();
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!connectedDevice) {
      setIsSearching(false);
    }
  }, [connectedDevice]);

  const handleConnect = async () => {
    console.log("Connected device: ", connectedDevice);
    if (connectedDevice) {
      await disconnectFromDevice();
    } else {
      setIsSearching(true);
      await autoConnectToWebDMX();
      setIsSearching(false);
    }
  };

  const sendTestData = async () => {
    console.log("Sending test data");

    const data: channelData[] = [
      { channel: 1, value: 255 },
      { channel: 2, value: 0 },
      { channel: 3, value: 0 },
      { channel: 4, value: 255 },
      { channel: 65, value: 12 },
    ];

    sendChannelData(data);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
      <Pressable onPress={handleConnect}>
        <View
          style={{
            backgroundColor: connectedDevice
              ? "#4caf50"
              : isSearching
              ? "#FF8C33"
              : "#f44336",
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          {connectedDevice ? (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Connected
              </Text>
              <BluetoothConnected size={20} color="#fff" />
            </View>
          ) : isSearching ? (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Searching
              </Text>
              <BluetoothSearching size={20} color="#fff" />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Disconnected
              </Text>
              <BluetoothOff size={20} color="#fff" />
            </View>
          )}
        </View>
      </Pressable>
      {/* <Pressable onPress={sendTestData}>
        <ThemedText type="defaultSemiBold" style={{ paddingHorizontal: 16 }}>
          Test Data
        </ThemedText>
      </Pressable> */}
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const headerColor = colorScheme === "dark" ? "#000" : "#fff";
  const headerTintColor = colorScheme === "dark" ? "#fff" : "#000";

  if (Platform.OS === "web") {
    return (
      <GestureHandlerRootView style={styles.container}>
        <ChannelProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: headerColor,
              },
              headerTintColor: headerTintColor,
            }}
          >
            <Stack.Screen
              name="controller"
              options={{
                title: "Controller",
              }}
            />
            <Stack.Screen
              name="effect-pads"
              options={{
                title: "Effect Pads",
              }}
            />
            <Stack.Screen
              name="fixture-presets/index"
              options={{
                title: "Fixture Editor",
              }}
            />
            <Stack.Screen
              name="fixture-presets/create"
              options={{
                title: "Create Fixture",
              }}
            />
          </Stack>
        </ChannelProvider>
      </GestureHandlerRootView>
    );
  } else {
    return (
      <BLEProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <GestureHandlerRootView>
              <ChannelProvider>
                <Stack
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: headerColor,
                    },
                    headerTintColor: headerTintColor,
                    headerRight: () => <NativeHeader />,
                  }}
                >
                  <Stack.Screen name="index" options={{ title: "Web DMX" }} />
                  <Stack.Screen
                    name="controller"
                    options={{
                      title: "Controller",
                    }}
                  />
                  <Stack.Screen
                    name="effect-pads"
                    options={{
                      title: "Effect Pads",
                    }}
                  />
                  <Stack.Screen
                    name="fixture-presets/index"
                    options={{
                      title: "Fixture Editor",
                    }}
                  />
                  <Stack.Screen
                    name="fixture-presets/create"
                    options={{
                      title: "Create Fixture",
                    }}
                  />
                </Stack>
              </ChannelProvider>
            </GestureHandlerRootView>
          </SafeAreaView>
        </SafeAreaProvider>
      </BLEProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
