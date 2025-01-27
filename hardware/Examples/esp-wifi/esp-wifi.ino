#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include <U8g2lib.h>

// Define OLED screen settings
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /* clock=*/14, /* data=*/12, /* reset=*/U8X8_PIN_NONE);

// WiFi settings
const char *ssid = "WebDMX_AP";    // Change SSID as needed
const char *password = "dmx-rn-jvds";   // Minimum 8 characters for WPA2

// WebSocket server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// DMX data buffer
uint8_t dmxBuffer[512] = {0};

// Global variables for OLED
uint8_t frame = 0;
uint8_t connectionState = 0;

void u8g2_prepare()
{
  u8g2.setFontRefHeightExtendedText();
  u8g2.setDrawColor(1);
  u8g2.setFontPosTop();
  u8g2.setFontDirection(0);
}

void printMsg(String msg)
{
  u8g2.setFont(u8g2_font_7x14_tr);
  u8g2.drawStr(2, 48, msg.c_str());
}

void printTitle(String title)
{
  u8g2.setFont(u8g2_font_doomalpha04_tr);
  u8g2.drawStr(2, 13, title.c_str());
  printConnectionState();
}

void printConnectionState()
{
  u8g2.setFont(u8g2_font_siji_t_6x10);
  switch (connectionState)
  {
  case 0:                             // Disconnected
    u8g2.drawGlyphX2(75, 17, 0xe217); // No signal
    break;
  case 1: // Connecting
    if (frame == 2)
    {
      u8g2.drawGlyphX2(75, 17, 0xe02d); // Loading icon
      frame = 0;
    }
    else
    {
      frame++;
    }
    break;
  case 2:                             // Connected
    u8g2.drawGlyphX2(75, 17, 0xe21a); // Strong signal
    break;
  }
}

void handleWebSocketMessage(uint8_t num, uint8_t *payload, size_t length)
{
  // Parse DMX data
  for (int i = 0; i < length && i < 512; i++)
  {
    dmxBuffer[i] = payload[i];
    Serial.write(dmxBuffer[i]); // Send DMX data via UART
  }
}

void onWebSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case WStype_TEXT:
    handleWebSocketMessage(num, payload, length);
    printMsg("DMX Data Received");
    break;
  case WStype_DISCONNECTED:
    connectionState = 0;
    printMsg("Client Disconnected");
    break;
  case WStype_CONNECTED:
    connectionState = 2;
    printMsg("Client Connected");
    break;
  }
}

void setup()
{
  // Initialize Serial
  Serial.begin(250000); // DMX baud rate

  // Initialize OLED
  u8g2.begin();
  u8g2_prepare();

  // Set up ESP as Access Point
  WiFi.softAP(ssid, password);
  IPAddress apIP = WiFi.softAPIP();

  // Display AP info on OLED
  u8g2.clearBuffer();
  printTitle("Web DMX AP");
  u8g2.setFont(u8g2_font_7x14_tr);
  u8g2.drawStr(2, 32, (String("SSID: ") + ssid).c_str());
  u8g2.drawStr(2, 44, (String("IP: ") + apIP.toString()).c_str());
  u8g2.sendBuffer();

  delay(2000);

  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(onWebSocketEvent);

  u8g2.clearBuffer();
  printTitle("Web DMX");
  u8g2.sendBuffer();
}

void loop()
{
  // Handle WebSocket clients
  webSocket.loop();

  // Update OLED display
  u8g2.clearBuffer();
  printTitle("Web DMX");
  printMsg("Ready");
  u8g2.sendBuffer();

  delay(100);
}
