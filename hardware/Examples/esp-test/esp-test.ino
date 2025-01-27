#include <Arduino.h>
#include <U8g2lib.h>

#ifdef U8X8_HAVE_HW_SPI
#include <SPI.h>
#endif
#ifdef U8X8_HAVE_HW_I2C
#include <Wire.h>
#endif

U8G2_SSD1306_128X64_NONAME_F_SW_I2C
u8g2(U8G2_R0, /* clock=*/14, /* data=*/12, /* reset=*/U8X8_PIN_NONE); // All Boards without Reset of the Display

uint8_t frame = 0;
uint8_t connectionState = 0; // 0 = Disconnected, 1 = Pairing, 2 = Connected

void u8g2_prepare(void)
{
  u8g2.setFontRefHeightExtendedText();
  u8g2.setDrawColor(1);
  u8g2.setFontPosTop();
  u8g2.setFontDirection(0);
}

void printTitle(String title)
{
  u8g2.setFont(u8g2_font_doomalpha04_tr);
  u8g2.drawStr(2, 13, title.c_str());
  printConnectionState();
}

void connecting(void)
{
  if (frame > 3)
  {
    frame = 0;
  }
  u8g2.setFont(u8g2_font_7x14_tr);
  u8g2.drawStr(2, 48, "Connecting");
  animateDots(75, 48, frame);
}

void printConnectionState(void)
{
  u8g2.setFont(u8g2_font_siji_t_6x10);

  switch (connectionState)
  {
  case 0: // Disconnected
    u8g2.drawGlyphX2(75, 17, 0xe216);
    break;
  case 1: // Pairing
    if (frame % 2 == 0)
    {
      u8g2.drawGlyphX2(75, 17, 0xe28a);
    }
    break;
  case 2: // Connected
    u8g2.drawGlyphX2(75, 17, 0xe1b7);
    break;
  default: // Empty
    u8g2.drawGlyphX2(75, 17, 0xe076);
  }
}

void animateDots(uint8_t x, uint8_t y, uint8_t frame)
{
  char dots[4] = "   ";
  for (uint8_t i = 0; i < frame; i++)
  {
    dots[i] = '.';
  }
  u8g2.drawStr(x, y, dots);
}

void setup(void)
{
  u8g2.begin();
}

void loop(void)
{
  u8g2.clearBuffer();
  printTitle("Web DMX");
  connectionState = 1;
  connecting();
  frame++;
  u8g2.sendBuffer();

  delay(100);
}
