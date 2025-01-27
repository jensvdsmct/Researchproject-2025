import { channelType, channelData } from "./fixture";

export type Effect = {
  type: channelType;
  value: number;
};

export type padPreset = {
  id: string;
  name: string;
  effects: Effect[];
  color: string; // Hex color for the pad
  channelData?: channelData[];
};
