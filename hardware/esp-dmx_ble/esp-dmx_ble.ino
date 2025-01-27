#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include "esp_dmx.h"

// BLE Configuration
#define LED_PIN 2
#define SERVICE_UUID "afe16d0c-ce27-4ffb-8943-5c3228cffabb"
#define CHARACTERISTIC_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

// DMX Configuration
const dmx_port_t dmx_num = DMX_NUM_1;
const int TX_PIN = 16; // DI pinz
const int RX_PIN = -1; // Not used since we're only transmitting
const int EN_PIN = 21; // DE & RE pins

// BLE variables
BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic *pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// DMX variables
uint8_t dmxData[DMX_PACKET_SIZE] = {0};

const unsigned long DMX_TRANSMIT_INTERVAL = 25; // 40Hz refresh rate
unsigned long lastDmxTransmit = 0;

#define DEBUG true // Set to false to disable debug printing

void printDmxDebug(uint8_t channel, uint8_t value)
{
  if (!DEBUG)
    return;

  Serial.print("DMX Channel ");
  if (channel < 10)
    Serial.print("00");
  else if (channel < 100)
    Serial.print("0");
  Serial.print(channel);
  Serial.print(" set to ");
  if (value < 100)
    Serial.print(" ");
  if (value < 10)
    Serial.print(" ");
  Serial.print(value);
  Serial.print(" (");
  Serial.print(float(value) / 255.0 * 100.0, 1);
  Serial.println("%)");
}

class MyServerCallbacks : public BLEServerCallbacks
{
  void onConnect(BLEServer *pServer)
  {
    deviceConnected = true;
  }
  void onDisconnect(BLEServer *pServer)
  {
    deviceConnected = false;
  }
};

/*
Example byte array format for sending DMX data over BLE:
For a simple RGB light starting at DMX address 1:
[1, 255,    // Channel 1 (Red) = 255
 2, 128,    // Channel 2 (Green) = 128
 3, 64]     // Channel 3 (Blue) = 64

For multiple lights:
[1, 255,    // Light 1: Red = 255
 2, 128,    // Light 1: Green = 128
 3, 64,     // Light 1: Blue = 64
 4, 255,    // Light 1: Dimmer = 255
 5, 0,      // Light 1: Strobe = 0
 6, 255,    // Light 2: Red = 255
 7, 0,      // Light 2: Green = 0
 8, 0]      // Light 2: Blue = 0

Each pair represents: [DMX_Channel, Value]
Channel: 1-512
Value: 0-255
*/

class MyCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    std::string rxValue = pCharacteristic->getValue();
    if (rxValue.length() > 0)
    {

      if (DEBUG)
      {
        Serial.println("\n--- New DMX Values Received ---");
      }

      for (size_t i = 0; i < rxValue.length() - 1; i += 2)
      {
        uint8_t channel = rxValue[i];
        uint8_t value = rxValue[i + 1];
        if (channel < DMX_PACKET_SIZE)
        {
          dmxData[channel] = value;
          printDmxDebug(channel, value);
        }
      }

      if (DEBUG)
      {
        Serial.println("---------------------------\n");
      }

      // Blink LED to indicate received data
      digitalWrite(LED_PIN, HIGH);
      delay(10);
      digitalWrite(LED_PIN, LOW);
    }
  }
};

void setup()
{
  Serial.begin(115200);

  // Setup BLE
  BLEDevice::init("DMX Controller");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
      CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_READ |
          BLECharacteristic::PROPERTY_WRITE);

  pCharacteristic->setCallbacks(new MyCallbacks());
  pService->start();
  pServer->getAdvertising()->start();

  // Setup DMX
  dmx_config_t config = DMX_CONFIG_DEFAULT;
  dmx_driver_install(dmx_num, &config, NULL, 0);
  dmx_set_pin(dmx_num, TX_PIN, RX_PIN, EN_PIN);

  pinMode(LED_PIN, OUTPUT);
}

void loop()
{
  // Handle BLE connection status
  if (!deviceConnected && oldDeviceConnected)
  {
    delay(500);
    pServer->startAdvertising();
    oldDeviceConnected = deviceConnected;
  }

  if (deviceConnected && !oldDeviceConnected)
  {
    oldDeviceConnected = deviceConnected;
  }

  // Continuously send DMX data at regular intervals
  unsigned long currentMillis = millis();
  if (currentMillis - lastDmxTransmit >= DMX_TRANSMIT_INTERVAL)
  {
    lastDmxTransmit = currentMillis;
    dmx_write(dmx_num, dmxData, DMX_PACKET_SIZE);
    dmx_send(dmx_num);
    dmx_wait_sent(dmx_num, DMX_TIMEOUT_TICK);
  }

  // Blink LED when not connected
  if (!deviceConnected)
  {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }
}
