// Version: 0.5

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define LED_PIN 2
#define SERVICE_UUID "afe16d0c-ce27-4ffb-8943-5c3228cffabb"
#define CHARACTERISTIC_UUID "4fafc201-1fb5-459e-8fcc-c5c9c331914b"

BLEServer *pServer = NULL;
BLEService *pService = NULL;
BLECharacteristic *pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;
uint32_t value = 0;

unsigned long lastBlink = 0;
const unsigned long blinkInterval = 100; // adjust as desired
bool messageReceived = false;
const unsigned long messageFlashDuration = 500; // adjust as desired
unsigned long messageFlashStart = 0;

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

class MyCallbacks : public BLECharacteristicCallbacks
{
  void onWrite(BLECharacteristic *pCharacteristic)
  {
    String rxValue = pCharacteristic->getValue();
    if (rxValue.length() > 0)
    {
      messageReceived = true;
      messageFlashStart = millis();
      digitalWrite(LED_PIN, HIGH);

      Serial.println("*********");
      Serial.print("Received Value: ");
      for (int i = 0; i < rxValue.length(); i++)
        Serial.print(rxValue[i]);

      Serial.println();
      Serial.println("*********");
    }
  }
};

void setup()
{
  Serial.begin(115200);

  BLEDevice::init("Web DMX");
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
  Serial.println("Waiting a client connection to notify...");

  pinMode(LED_PIN, OUTPUT);
}

void loop()
{
  if (deviceConnected && !messageReceived)
  {
    digitalWrite(LED_PIN, LOW);
  }
  else if (!messageReceived)
  {
    unsigned long currentMillis = millis();
    if (currentMillis - lastBlink >= blinkInterval)
    {
      lastBlink = currentMillis;
      digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    }
  }

  if (messageReceived)
  {
    unsigned long currentMillis = millis();
    if (currentMillis - messageFlashStart >= messageFlashDuration)
    {
      
      messageReceived = false;
      digitalWrite(LED_PIN, LOW);
    }
  }

  if (!deviceConnected && oldDeviceConnected)
  {
    delay(500);                  // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising(); // restart advertising
    Serial.println("start advertising");
    oldDeviceConnected = deviceConnected;
  }

  if (deviceConnected && !oldDeviceConnected)
  {
    // Do something when reconnected
    oldDeviceConnected = deviceConnected;
  }
}
