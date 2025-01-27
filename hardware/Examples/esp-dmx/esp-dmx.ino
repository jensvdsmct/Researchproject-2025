#include "esp_dmx.h"

// Define DMX parameters
const dmx_port_t dmx_num = DMX_NUM_1;
const int TX_PIN = 16;  // DI pin
const int RX_PIN = -1;  // Not used for sending only
const int EN_PIN = 21;  // DE & RE pins

// Define light addresses
const int LIGHT1_ADDR = 1;
const int LIGHT2_ADDR = 6;
const int LIGHT3_ADDR = 11;
const int LIGHT4_ADDR = 16;

// DMX packet buffer
uint8_t data[DMX_PACKET_SIZE] = {0};

void setup() {
  // Initialize Serial for debugging
  Serial.begin(115200);
  
  // Configure DMX driver
  dmx_config_t config = DMX_CONFIG_DEFAULT;
  dmx_driver_install(dmx_num, &config, NULL, 0);
  
  // Set DMX pins
  dmx_set_pin(dmx_num, TX_PIN, RX_PIN, EN_PIN);
}

// Helper function to set RGB + Dimmer values for a light
void setLight(int startAddr, uint8_t r, uint8_t g, uint8_t b, uint8_t dim, uint8_t strobe) {
  data[startAddr + 0] = r;     // Red
  data[startAddr + 1] = g;     // Green
  data[startAddr + 2] = b;     // Blue
  data[startAddr + 3] = dim;   // Dimmer
  data[startAddr + 4] = strobe;// Strobe/Sound
}

// Different light effects
void allColor(uint8_t r, uint8_t g, uint8_t b, uint8_t dim) {
  setLight(LIGHT1_ADDR, r, g, b, dim, 0);
  setLight(LIGHT2_ADDR, r, g, b, dim, 0);
  setLight(LIGHT3_ADDR, r, g, b, dim, 0);
  setLight(LIGHT4_ADDR, r, g, b, dim, 0);
}

void chase(uint8_t r, uint8_t g, uint8_t b, uint8_t dim) {
  static int pos = 0;
  
  // Reset all lights
  allColor(0, 0, 0, dim);
  
  // Set one light at a time
  switch(pos) {
    case 0: setLight(LIGHT1_ADDR, r, g, b, dim, 0); break;
    case 1: setLight(LIGHT2_ADDR, r, g, b, dim, 0); break;
    case 2: setLight(LIGHT3_ADDR, r, g, b, dim, 0); break;
    case 3: setLight(LIGHT4_ADDR, r, g, b, dim, 0); break;
  }
  
  pos = (pos + 1) % 4;
}

void loop() {
  static unsigned long lastChange = 0;
  static int effect = 0;
  const int EFFECT_DURATION = 5000; // 5 seconds per effect
  
  // Change effect every EFFECT_DURATION milliseconds
  if (millis() - lastChange >= EFFECT_DURATION) {
    effect = (effect + 1) % 6;
    lastChange = millis();
  }
  
  // Different effects
  switch(effect) {
    case 0: // All red
      allColor(255, 0, 0, 255);
      break;
      
    case 1: // All green
      allColor(0, 255, 0, 255);
      break;
      
    case 2: // All blue
      allColor(0, 0, 255, 255);
      break;
      
    case 3: // Color chase
      chase(255, 255, 255, 255);
      delay(200); // Slow down the chase
      break;
      
    case 4: // Sound reactive mode (all lights)
      allColor(255, 255, 255, 255);
      setLight(LIGHT1_ADDR, 255, 255, 255, 255, 4); // Enable sound mode
      setLight(LIGHT2_ADDR, 255, 255, 255, 255, 4);
      setLight(LIGHT3_ADDR, 255, 255, 255, 255, 4);
      setLight(LIGHT4_ADDR, 255, 255, 255, 255, 4);
      break;
      
    case 5: // Strobe effect
      allColor(255, 255, 255, 255);
      setLight(LIGHT1_ADDR, 255, 255, 255, 255, 200); // Enable strobe
      setLight(LIGHT2_ADDR, 255, 255, 255, 255, 200);
      setLight(LIGHT3_ADDR, 255, 255, 255, 255, 200);
      setLight(LIGHT4_ADDR, 255, 255, 255, 255, 200);
      break;
  }
  
  // Send the DMX packet
  dmx_write(dmx_num, data, DMX_PACKET_SIZE);
  dmx_send(dmx_num);
  dmx_wait_sent(dmx_num, DMX_TIMEOUT_TICK);
}
