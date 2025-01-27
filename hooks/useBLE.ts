/* eslint-disable no-bitwise */

import { useMemo, useState, useEffect } from "react";
import { BleManager, Device, DeviceId, BleError } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import * as ExpoDevice from "expo-device";
import { channelData } from "@/types/fixture";
import base64 from "react-native-base64";

interface BluetoothLowEnergyApi {
  requestPermissions: () => Promise<boolean>;
  scanForPeripherals: () => void;
  allDevices: Device[];
  connectToDevice: (DeviceId: Device) => Promise<void>;
  connectedDevice: Device | null;
  disconnectFromDevice: () => Promise<void>;
  autoConnectToWebDMX: () => Promise<boolean>;
  sendChannelData: (channelValues: channelData[]) => Promise<void>;
  sendChannelDataDirect: (channelValues: channelData[]) => Promise<void>;
}

const DMX_UUID = "afe16d0c-ce27-4ffb-8943-5c3228cffabb";
const DMX_CHARACTERISTIC = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";

function useBLE(): BluetoothLowEnergyApi {
  const bleManager = useMemo(() => new BleManager(), []);

  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  // useEffect(() => {
  //   const subscription = bleManager.onDeviceDisconnected(
  //     null,
  //     (error, device) => {
  //       if (error) {
  //         console.error(error);
  //       } else if (device && device.id === connectedDevice?.id) {
  //         setConnectedDevice(null);
  //         console.log("Device disconnected: ", device);
  //       }
  //     }
  //   );

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [bleManager, connectedDevice]);

  const setupOnDeviceDisconnected = (deviceIdToMonitor: DeviceId) => {
    bleManager.onDeviceDisconnected(deviceIdToMonitor, disconnectedListener);
  };

  const disconnectedListener = (
    error: BleError | null,
    device: Device | null
  ) => {
    if (error) {
      console.error(JSON.stringify(error, null, 4));
    }
    if (device) {
      console.info(JSON.stringify(device, null, 4));
    }

    setConnectedDevice(null);
    console.log("Device disconnected: ", device);
  };

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Scan Permission",
        message:
          "This app needs access to Bluetooth Low Energy to scan for the WEBDMX device.",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Connect Permission",
        message:
          "This app needs access to Bluetooth Low Energy to connect to the WEBDMX device.",
        buttonPositive: "OK",
      }
    );
    const bluetoothFineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Fine Location Permission",
        message:
          "This app needs access to Bluetooth Low Energy to scan for the WEBDMX device.",
        buttonPositive: "OK",
      }
    );

    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      bluetoothFineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    console.log("Requesting permissions");
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Fine Location Permission",
            message:
              "This app needs access to Bluetooth Low Energy to scan for the WEBDMX device.",
            buttonPositive: "OK",
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () => {
    console.log("Scanning for peripherals");
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error(error);
      }
      if (device && device.name?.includes("Web DMX")) {
        setAllDevices((prevState) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    console.log("Connecting to device", device);
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      await setupOnDeviceDisconnected(deviceConnection.id);
      bleManager.stopDeviceScan();
      console.log(
        "Connected to device ",
        deviceConnection,
        " and stopped scan"
      );
      setConnectedDevice(deviceConnection);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      console.log("Disconnecting from device: ", connectedDevice);
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      console.log("Disconnected from device: ", connectedDevice);
    }
  };

  const autoConnectToWebDMX = async (): Promise<boolean> => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log("Scanning for peripherals");
      return new Promise((resolve) => {
        const tryConnect = async () => {
          bleManager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
              console.error(error);
              resolve(false);
            }
            if (device && device.name?.includes("Web DMX")) {
              console.log("Found device: ", device.name);
              bleManager.stopDeviceScan();
              try {
                await connectToDevice(device);
                resolve(true);
              } catch (error) {
                console.error("Connection failed, retrying...", error);
                setTimeout(tryConnect, 2000); // Retry after 2 seconds
              }
            }
          });
        };
        tryConnect();
      });
    }
    return false;
  };

  const sendChannelData = async (channelValues: channelData[]) => {
    if (connectedDevice) {
      console.log("Sending channel data: ", channelValues);
      // channelData:
      //
      // export type channelData = {
      //   channel: number; // Channel number
      //   value: number; // Value of the channel
      // };

      // Data that the bluetooth device needs to receive
      // channel: 1, value: 255
      // = 01FF

      // channel: 2, value: 0
      // = 0200

      // channel: 3, value: 45
      // = 032D

      // channel: 4, value: 126
      // = 047E

      // = 01FF0200032D047E

      // Convert channel data to bytes
      const rawData = new Uint8Array(channelValues.length * 2);
      channelValues.forEach((channel, index) => {
        rawData[index * 2] = channel.channel;
        rawData[index * 2 + 1] = channel.value;
      });

      console.log("rawData to send: ", rawData);

      // Convert to Base64
      const data = base64.encode(
        String.fromCharCode.apply(null, Array.from(rawData))
      );

      console.log("Data (base64): ", data);

      try {
        await bleManager.writeCharacteristicWithResponseForDevice(
          connectedDevice.id,
          DMX_UUID,
          DMX_CHARACTERISTIC,
          data
        );
        console.log("Channel data sent successfully");
      } catch (error) {
        console.error("Failed to send channel data", error);
      }
    } else {
      console.log("No device connected");
    }
  };

  const sendChannelDataDirect = async (channelValues: channelData[]) => {
    if (!connectedDevice || !channelValues.length) return;

    try {
      // Sort by channel number within their groups, but maintain group ordering
      // (the order is already set by the effect pad component)
      const sortedValues = [...channelValues].sort((a, b) => a.channel - b.channel);

      // Optimize buffer creation
      const view = new Uint8Array(sortedValues.length * 2);
      for (let i = 0; i < sortedValues.length; i++) {
        view[i * 2] = sortedValues[i].channel;
        view[i * 2 + 1] = sortedValues[i].value;
      }

      // Use smaller chunks for more reliable transmission
      const chunkSize = 16; // 8 channels * 2 bytes
      
      // Send chunks sequentially
      for (let i = 0; i < view.length; i += chunkSize) {
        const chunk = view.slice(i, i + chunkSize);
        const chunkData = base64.encode(String.fromCharCode(...chunk));

        await bleManager.writeCharacteristicWithoutResponseForDevice(
          connectedDevice.id,
          DMX_UUID,
          DMX_CHARACTERISTIC,
          chunkData
        );

        // Small delay between chunks
        if (i + chunkSize < view.length) {
          await new Promise(resolve => setTimeout(resolve, 2));
        }
      }

    } catch (error) {
      console.error("Failed to send channel data directly", error);
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
    disconnectFromDevice,
    autoConnectToWebDMX,
    sendChannelData,
    sendChannelDataDirect,
  };
}

export default useBLE;
