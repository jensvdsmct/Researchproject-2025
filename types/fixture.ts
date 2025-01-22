export type Fixture = {
  id: number; // ID of the light Ex: 1
  name: string; // Name of the light Ex: "LED PAR"
  manufacturer: string; // Manufacturer of the light Ex: "Chauvet"
  numberOfChannels: number; // Number of channels of the light Ex: 6
  startAddress: number; // Start address of the light Ex: 001
  endAddress: number; // End address of the light Ex: 006
  channels: channel[]; // Channels of the light
};

export type channel = {
  name: string; // Name of the channel Ex: "Red"
  type: string; // Type of the channel Ex: "Color"
  subtype?: string; // Subtype of the channel Ex: "Red"
  channel: number; // Channel number Ex: 001
  multipurpose?: boolean; // Is the channel multipurpose
  subChannels?: subChannel[]; // Subchannels of the channel
  value?: number; // Value of the channel
};

export type subChannel = {
  name: string; // Name of the subchannel Ex: "Strobe 1 - 100%"
  type: string; // Type of the subchannel Ex: "Strobe"
  range: range; // Range of the subchannel Ex: {start: 000, end: 125}
};

export type range = {
  start: number; // Start of the range Ex: 000
  end: number; // End of the range Ex: 125
};

export type fixturePreset = {
  id: number; // Unique ID for the preset
  name: string; // Name of the preset Ex: "LED PAR Basic"
  description?: string; // Optional description of the preset
  fixtureType: string; // Type of fixture this preset is for Ex: "LED PAR"
  manufacturer: string; // Manufacturer of the fixture
  numberOfChannels: number; // Number of channels
  channels: channel[]; // Default channel configuration
  metadata?: {
    author?: string; // Creator of the preset
    dateCreated?: string; // Date the preset was created
    lastModified?: string; // Date the preset was last modified
    version?: string; // Version of the preset
  };
};

export type draggableFixture = {
  fixture: Fixture; // Fixture object
  x: number; // X position of the fixture
  y: number; // Y position of the fixture
};

export type channelData = {
  channel: number; // Channel number
  value: number; // Value of the channel
};

// LED PAR EXAMPLE
// const ledPar: Fixture = {
//   id: 1,
//   name: "LED PARty TCL Spot",
//   manufacturer: "Eurolite",
//   numberOfChannels: 5,
//   startAddress: 1,
//   endAddress: 5,
//   channels: [
//     {
//       name: "Red",
//       type: "Color",
//       subtype: "Red",
//       channel: 1,
//       multipurpose: false,
//       value: 0,
//     },
//     {
//       name: "Green",
//       type: "Color",
//       subtype: "Green",
//       channel: 2,
//       multipurpose: false,
//       value: 0,
//     },
//     {
//       name: "Blue",
//       type: "Color",
//       subtype: "Blue",
//       channel: 3,
//       multipurpose: false,
//       value: 0,
//     },
//     {
//       name: "Dimmer",
//       type: "Intensity",
//       channel: 4,
//       multipurpose: false,
//       value: 0,
//     },
//     {
//       name: "Effects",
//       type: "Effects",
//       channel: 5,
//       multipurpose: true,
//       subChannels: [
//         {
//           name: "Sound Control",
//           type: "Sound",
//           range: { start: 1, end: 5 },
//         },
//         {
//           name: "Strobe",
//           type: "Strobe",
//           range: { start: 11, end: 255 },
//         },
//       ],
//     },
//   ],
// };

// LED PAR PRESET EXAMPLE
// const ledParBasic: FixturePreset = {
//   id: 1,
//   name: "LED PAR Basic",
//   description: "Basic color mixing with dimmer",
//   fixtureType: "LED PAR",
//   manufacturer: "Eurolite",
//   numberOfChannels: 5,
//   channels: [
//     {
//       name: "Red",
//       type: "Color",
//       subtype: "Red",
//       channel: 1,
//       multipurpose: false,
//     },
//     {
//       name: "Green",
//       type: "Color",
//       subtype: "Green",
//       channel: 2,
//       multipurpose: false,
//     },
//     {
//       name: "Blue",
//       type: "Color",
//       subtype: "Blue",
//       channel: 3,
//       multipurpose: false,
//     },
//     {
//       name: "Dimmer",
//       type: "Intensity",
//       channel: 4,
//       multipurpose: false,
//     },
//     {
//       name: "Effects",
//       type: "Effects",
//       channel: 5,
//       multipurpose: true,
//       subChannels: [
//         {
//           name: "Sound Control",
//           type: "Sound",
//           range: { start: 1, end: 5 },
//         },
//         {
//           name: "Strobe",
//           type: "Strobe",
//           range: { start: 11, end: 255 },
//         },
//       ],
//     },
//   ],
//   metadata: {
//     author: "John Doe",
//     dateCreated: "2021-10-01",
//     lastModified: "2021-10-01",
//     version: "1.0",
//   },
// };

// export type { Fixture, channel, subChannel, range };
