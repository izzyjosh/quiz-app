export const signUpSteps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Username" },
  { id: 3, label: "Avatar" },
];

export const usernameSuggestions = [
  "vectorpilot22",
  "quizcaptain",
  "flashsolver",
  "patternninja",
  "roundmaster",
  "bytechaser",
];

export const avatarCategories = ["Animals", "Space", "Tech"] as const;

export type AvatarCategory = (typeof avatarCategories)[number];

export const avatarsByCategory: Record<AvatarCategory, string[]> = {
  Animals: [
    "Fox",
    "Wolf",
    "Bear",
    "Owl",
    "Whale",
    "Tiger",
    "Frog",
    "Panda",
    "Shark",
    "Seal",
    "Lynx",
    "Moose",
  ],
  Space: [
    "Nova",
    "Comet",
    "Orbit",
    "Pulsar",
    "Nebula",
    "Lunar",
    "Astra",
    "Cosmo",
    "Quasar",
    "Rocket",
    "Stellar",
    "Meteor",
  ],
  Tech: [
    "Kernel",
    "Cipher",
    "Vector",
    "Circuit",
    "Pixel",
    "Binary",
    "Logic",
    "Node",
    "Cloud",
    "Matrix",
    "Stack",
    "Delta",
  ],
};
