export type ColorCode = `#${string}`;

export type TimetableColor = {
  backgroundColor: ColorCode;
  hoverBackgroundColor: ColorCode;
  textColor: ColorCode;
};

export type TimetableColors = TimetableColor[];

export const TimetableThemeNames = [
  "default",
  "soft_pastel",
  "dark_rich",
  "cool_and_muted",
  "bright_and_vibrant",
  "desert_sand",
] as const;

export type TimetableThemeName = (typeof TimetableThemeNames)[number];

export type TimetableTheme = Record<TimetableThemeName, TimetableColors>;

export const TIMETABLE_THEMES: TimetableTheme = {
  default: [
    // red
    {
      backgroundColor: "#f87171",
      hoverBackgroundColor: "#ef4444",
      textColor: "#450a0a",
    },
    // yellow
    {
      backgroundColor: "#facc15",
      hoverBackgroundColor: "#eab308",
      textColor: "#422006",
    },
    // green
    {
      backgroundColor: "#4ade80",
      hoverBackgroundColor: "#22c55e",
      textColor: "#052e16",
    },
    // teal
    {
      backgroundColor: "#2dd4bf",
      hoverBackgroundColor: "#14b8a6",
      textColor: "#042f2e",
    },
    // sky
    {
      backgroundColor: "#38bdf8",
      hoverBackgroundColor: "#0ea5e9",
      textColor: "#082f49",
    },
    // indigo
    {
      backgroundColor: "#818cf8",
      hoverBackgroundColor: "#6366f1",
      textColor: "#1e1b4b",
    },
    // purple
    {
      backgroundColor: "#c084fc",
      hoverBackgroundColor: "#a855f7",
      textColor: "#3b0764",
    },
    // fuchsia
    {
      backgroundColor: "#e879f9",
      hoverBackgroundColor: "#d946ef",
      textColor: "#4a044e",
    },
    // rose
    {
      backgroundColor: "#fb7185",
      hoverBackgroundColor: "#f43f5e",
      textColor: "#4c0519",
    },
  ],
  soft_pastel: [
    // red
    {
      backgroundColor: "#fca5a5",
      hoverBackgroundColor: "#f87171",
      textColor: "#7f1d1d",
    },
    // yellow
    {
      backgroundColor: "#fde68a",
      hoverBackgroundColor: "#facc15",
      textColor: "#713f12",
    },
    // green
    {
      backgroundColor: "#86efac",
      hoverBackgroundColor: "#4ade80",
      textColor: "#14532d",
    },
    // teal
    {
      backgroundColor: "#67e8f9",
      hoverBackgroundColor: "#2dd4bf",
      textColor: "#134e4a",
    },
    // sky
    {
      backgroundColor: "#7dd3fc",
      hoverBackgroundColor: "#38bdf8",
      textColor: "#0c4a6e",
    },
    // indigo
    {
      backgroundColor: "#a5b4fc",
      hoverBackgroundColor: "#818cf8",
      textColor: "#312e81",
    },
    // purple
    {
      backgroundColor: "#d8b4fe",
      hoverBackgroundColor: "#c084fc",
      textColor: "#581c87",
    },
    // fuchsia
    {
      backgroundColor: "#f0abfc",
      hoverBackgroundColor: "#e879f9",
      textColor: "#701a75",
    },
    // rose
    {
      backgroundColor: "#fdb6c7",
      hoverBackgroundColor: "#fb7185",
      textColor: "#881337",
    },
  ],
  dark_rich: [
    // red
    {
      backgroundColor: "#b91c1c",
      hoverBackgroundColor: "#8e1717",
      textColor: "#fff5f5",
    },
    // yellow
    {
      backgroundColor: "#b45309",
      hoverBackgroundColor: "#8c4007",
      textColor: "#fdf7e1",
    },
    // green
    {
      backgroundColor: "#15803d",
      hoverBackgroundColor: "#106632",
      textColor: "#f2f9f2",
    },
    // teal
    {
      backgroundColor: "#0f766e",
      hoverBackgroundColor: "#0c5f59",
      textColor: "#e6f7f5",
    },
    // sky
    {
      backgroundColor: "#0369a1",
      hoverBackgroundColor: "#025480",
      textColor: "#ebf5ff",
    },
    // indigo
    {
      backgroundColor: "#3730a3",
      hoverBackgroundColor: "#2c267e",
      textColor: "#e8e6f8",
    },
    // purple
    {
      backgroundColor: "#6d28d9",
      hoverBackgroundColor: "#541fb0",
      textColor: "#f5eaff",
    },
    // fuchsia
    {
      backgroundColor: "#a21caf",
      hoverBackgroundColor: "#80198c",
      textColor: "#fde5fb",
    },
    // rose
    {
      backgroundColor: "#be123c",
      hoverBackgroundColor: "#961030",
      textColor: "#fbe7eb",
    },
  ],
  cool_and_muted: [
    // red
    {
      backgroundColor: "#e57373",
      hoverBackgroundColor: "#a12923",
      textColor: "#4c1111",
    },
    // yellow
    {
      backgroundColor: "#ffd54f",
      hoverBackgroundColor: "#c8871a",
      textColor: "#4d3014",
    },
    // green
    {
      backgroundColor: "#81c784",
      hoverBackgroundColor: "#136a34",
      textColor: "#1e2b1a",
    },
    // teal
    {
      backgroundColor: "#4db6Ac",
      hoverBackgroundColor: "#007366",
      textColor: "#003533",
    },
    // sky
    {
      backgroundColor: "#4fc3f7",
      hoverBackgroundColor: "#2b58c2",
      textColor: "#18233d",
    },
    // indigo
    {
      backgroundColor: "#7986cb",
      hoverBackgroundColor: "#5f86c4",
      textColor: "#1e2b5a",
    },
    // purple
    {
      backgroundColor: "#ba68c8",
      hoverBackgroundColor: "#b01a4e",
      textColor: "#52122b",
    },
    // fuchsia
    {
      backgroundColor: "#ce93d8",
      hoverBackgroundColor: "#a873ae",
      textColor: "#4a2147",
    },
    // rose
    {
      backgroundColor: "#f06292",
      hoverBackgroundColor: "#ba7574",
      textColor: "#4f1d20",
    },
  ],
  bright_and_vibrant: [
    // red
    {
      backgroundColor: "#cc342b",
      hoverBackgroundColor: "#9c251e",
      textColor: "#fff5f5",
    },
    // yellow
    {
      backgroundColor: "#fba922",
      hoverBackgroundColor: "#d18d1d",
      textColor: "#fdf7e1",
    },
    // green
    {
      backgroundColor: "#198844",
      hoverBackgroundColor: "#156B37",
      textColor: "#f2f9f2",
    },
    // teal
    {
      backgroundColor: "#009688",
      hoverBackgroundColor: "#006c62",
      textColor: "#e6f7f5",
    },
    // sky
    {
      backgroundColor: "#3971ed",
      hoverBackgroundColor: "#2d5abc",
      textColor: "#ebf5ff",
    },
    // indigo
    {
      backgroundColor: "#6674ff",
      hoverBackgroundColor: "#4d57c3",
      textColor: "#e8e6f8",
    },
    // purple
    {
      backgroundColor: "#b061ff",
      hoverBackgroundColor: "#844abe",
      textColor: "#f5eaff",
    },
    // fuchsia
    {
      backgroundColor: "#dd44f4",
      hoverBackgroundColor: "#b837cb",
      textColor: "#fde5fb",
    },
    // rose
    {
      backgroundColor: "#f02e70",
      hoverBackgroundColor: "#961030",
      textColor: "#fbe7eb",
    },
  ],
  desert_sand: [
    // red
    {
      backgroundColor: "#d1495b",
      hoverBackgroundColor: "#ba4756",
      textColor: "#3e0f12",
    },
    // yellow
    {
      backgroundColor: "#e9c46a",
      hoverBackgroundColor: "#c8a95c",
      textColor: "#4a3a1e",
    },
    // green
    {
      backgroundColor: "#2a9d8f",
      hoverBackgroundColor: "#298f83",
      textColor: "#0d3b33",
    },
    // teal
    {
      backgroundColor: "#5aa7b1",
      hoverBackgroundColor: "#386369",
      textColor: "#255055",
    },
    // sky
    {
      backgroundColor: "#82c0cc",
      hoverBackgroundColor: "#6898a1",
      textColor: "#1c2f36",
    },
    // indigo
    {
      backgroundColor: "#969eca",
      hoverBackgroundColor: "#7e84a8",
      textColor: "#2a2c5f",
    },
    // purple
    {
      backgroundColor: "#bd92c4",
      hoverBackgroundColor: "#98769d",
      textColor: "#331a36",
    },
    // fuchsia
    {
      backgroundColor: "#d0a9d7",
      hoverBackgroundColor: "#ab8cb0",
      textColor: "#3f243d",
    },
    // rose
    {
      backgroundColor: "#e982a5",
      hoverBackgroundColor: "#cd7996",
      textColor: "#4c2632",
    },
  ],
};
