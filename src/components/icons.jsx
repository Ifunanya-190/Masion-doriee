import React from 'react';

// Common stroke and fill style for a premium look
const defaultProps = {
  width: "24px",
  height: "24px",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const MeatIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 2.5 6.5 6 7.5l4-2.5 4 2.5c3.5-1 6-4 6-7.5 0-5.5-4.5-10-10-10z" />
    <path d="M12 2v15" />
    <path d="M7 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    <path d="M17 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  </svg>
);

export const FishIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M2 12c4-4 8-4 12-2 1.5-1.5 3.5-2.5 5.5-2.5.5 0 1 .5 1 1 0 2-1 4-2.5 5.5 2 4 2 8-2 12C12 20 8 16 2 12z" />
    <path d="M19 8.5c-.5.5-1.5.5-2 0s0-1.5.5-2" />
    <circle cx="16" cy="11" r="1" fill="currentColor" />
  </svg>
);

export const ChickenIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M17.5 10c0-3.5-2.5-6-6-6-2.5 0-5 1.5-5 4 0 2.5 1.5 4 3 5.5L7 19h7.5l1.5-2.5c1-.5 1.5-1.5 1.5-2.5v-4z" />
    <path d="M6.5 8c-1.5 0-2.5 1-2.5 2s1 1.5 2.5 1.5" />
    <path d="M11 19v3M13 19v3" />
    <circle cx="14" cy="8" r="1" fill="currentColor" />
  </svg>
);

export const LobsterIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 2c-1.5 0-3 2-3 4.5S10 11 12 11s3-2 3-4.5S13.5 2 12 2z" />
    <path d="M8 8c-2 0-4-1-4-3s1.5-2 3-1" />
    <path d="M16 8c2 0 4-1 4-3s-1.5-2-3-1" />
    <path d="M9 11c-1 2-2 3.5-2 5s1 2.5 3 2.5h4c2 0 3-1 3-2.5s-1-3-2-5" />
    <path d="M10 21l-1 2M14 21l1 2" />
  </svg>
);

export const PotatoIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 3c-4.5 0-8 3-8 8s3 10 8 10 8-3 8-10-3.5-8-8-8z" />
    <circle cx="7.5" cy="8.5" r="0.75" fill="currentColor" />
    <circle cx="16.5" cy="10.5" r="0.75" fill="currentColor" />
    <circle cx="10.5" cy="15.5" r="0.75" fill="currentColor" />
    <circle cx="14.5" cy="14.5" r="0.75" fill="currentColor" />
  </svg>
);

export const HerbIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M2 22c0-8 6-14 14-14M16 8c4-4 6-2 6-2s-2 2-6 6M8 12c-2 1-4 3-4 5 0 2 2 2 4 1 2-1 3-3 3-5M12 6c1-2 3-4 5-4 2 0 2 2 1 4-1 2-3 3-5 3" />
  </svg>
);

export const RiceIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M3 11c0 6 4 10 9 10s9-4 9-10H3z" />
    <path d="M12 2c-.5.8-1 1.7-1 2.5s.5 1.5 1 2.2c.5-.7 1-1.4 1-2.2S12.5 2.8 12 2z" />
    <path d="M8 4.5c-.3.6-.6 1.3-.6 2s.3 1.2.6 1.7c.3-.5.6-1.1.6-1.7s-.3-1.4-.6-2z" />
    <path d="M16 4.5c.3.6.6 1.3.6 2s-.3 1.2-.6 1.7c-.3-.5-.6-1.1-.6-1.7s.3-1.4.6-2z" />
  </svg>
);

export const CarrotIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M18.5 5.5l-3-3M21.5 2.5c-.8-.8-2-.8-2.8 0L10 11.2l2.8 2.8 8.7-8.7c.8-.8.8-2 0-2.8z" />
    <path d="M10 11.2L3.5 17.7c-1 1-1.5 2.3-1 3.3.5 1 1.8.5 2.8-.5l6.5-6.5" />
    <path d="M16 5.5c-1 1-1.5 2.5-2.5 3.5M18.5 8c-1 1-2 2-3 3" />
  </svg>
);

export const SauceIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M22 6c0-1.5-2-2.5-5-2.5s-5 1-5 2.5c0 .7.5 1.3 1.5 1.8L12 18c0 1.5 2.5 2.5 5.5 2.5s5.5-1 5.5-2.5l-1.5-10.2c1-.5 1.5-1.1 1.5-1.8z" />
    <path d="M12 6.5C7.5 6.5 4 8 4 9.5c0 1 1.5 1.8 4 2.2L6 20.5" />
  </svg>
);

export const ButterIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <path d="M7 10h10v4H7z" />
    <path d="M3 12h18" />
  </svg>
);

export const WineIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M8 2h8v7c0 3.5-3 6-6 6s-6-2.5-6-6V2z" />
    <path d="M12 15v5M7 20h10" />
    <path d="M5 6h14" />
  </svg>
);

export const LemonIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
    <path d="M12 2v20M2 12h20" />
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const SparklesIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.5 6.5l2.5 2.5M15 15l2.5 2.5M17.5 6.5L15 9M9 15l-2.5 2.5" />
  </svg>
);

export const MushroomIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 3c-4.5 0-8 3-8 7h16c0-4-3.5-7-8-7z" />
    <path d="M9 10v9c0 1.5 1.5 2.5 3 2.5s3-1 3-2.5v-9H9z" />
    <path d="M4 10c0 1.5 3.5 2 8 2s8-.5 8-2" />
  </svg>
);

export const ShrimpIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M12 2c3.5 0 6 2 7.5 4.5S20 12 18.5 14c-1.2 1.5-3 1.5-4 0s-1-3.5 0-5 2.8-2 4.5-1" />
    <path d="M12 2c-3.5 1-6 3.5-7 6s1 5 3.5 6" />
    <path d="M4.5 11l-2 1M6 14.5l-1.5 1.5M8.5 17.5L7 19.5" />
  </svg>
);

export const CheeseIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M3 21h18c0-5.5-4.5-10-10-10S3 15.5 3 21z" />
    <path d="M3 21L12 3l9 18H3z" />
    <circle cx="7" cy="17" r="1" fill="currentColor" />
    <circle cx="12" cy="13" r="1.25" fill="currentColor" />
    <circle cx="16" cy="18" r="0.75" fill="currentColor" />
  </svg>
);

export const PlateIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" strokeDasharray="3 3" />
    <path d="M2 12h2M20 12h2M12 2v2M12 20v2" />
  </svg>
);

// Medal icons for bronze, silver, gold
export const MedalIcon = ({ tierColor, ...props }) => (
  <svg {...defaultProps} {...props} stroke={tierColor || "#d48a2c"}>
    <circle cx="12" cy="13" r="5" />
    <path d="M8.5 8.5L6 2h4l2 5 2-5h4l-2.5 6.5" />
    <path d="M12 11l1 1-1 1-1-1z" fill="currentColor" />
  </svg>
);

export const CrownIcon = (props) => (
  <svg {...defaultProps} {...props}>
    <path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z" />
    <path d="M3 20h18M5 17h14" />
  </svg>
);

// Map strings/tags to the actual components
export const IconResolver = ({ name, className, style, tierColor }) => {
  const normalized = (name || "").toLowerCase();
  switch (normalized) {
    case "steak":
    case "protein":
    case "🥩":
      return <MeatIcon className={className} style={style} />;
    case "fish":
    case "🐟":
      return <FishIcon className={className} style={style} />;
    case "chicken":
    case "🍗":
      return <ChickenIcon className={className} style={style} />;
    case "lobster":
    case "🦞":
      return <LobsterIcon className={className} style={style} />;
    case "potato":
    case "🥔":
      return <PotatoIcon className={className} style={style} />;
    case "herb":
    case "🥗":
    case "🌿":
      return <HerbIcon className={className} style={style} />;
    case "rice":
    case "🍚":
      return <RiceIcon className={className} style={style} />;
    case "carrot":
    case "🥕":
      return <CarrotIcon className={className} style={style} />;
    case "sauce":
    case "🫗":
      return <SauceIcon className={className} style={style} />;
    case "butter":
    case "🧈":
      return <ButterIcon className={className} style={style} />;
    case "wine":
    case "🍷":
      return <WineIcon className={className} style={style} />;
    case "lemon":
    case "🍋":
      return <LemonIcon className={className} style={style} />;
    case "sparkle":
    case "extras":
    case "✨":
      return <SparklesIcon className={className} style={style} />;
    case "mushroom":
    case "🍄":
      return <MushroomIcon className={className} style={style} />;
    case "shrimp":
    case "🦐":
      return <ShrimpIcon className={className} style={style} />;
    case "cheese":
    case "🧀":
      return <CheeseIcon className={className} style={style} />;
    case "plate":
    case "🍽️":
      return <PlateIcon className={className} style={style} />;
    case "bronze":
    case "🥉":
      return <MedalIcon tierColor="#a77044" className={className} style={style} />;
    case "silver":
    case "🥈":
      return <MedalIcon tierColor="#a0a0a0" className={className} style={style} />;
    case "gold":
    case "🥇":
      return <MedalIcon tierColor="#d48a2c" className={className} style={style} />;
    case "platinum":
    case "crown":
    case "👑":
      return <CrownIcon className={className} style={style} />;
    default:
      return null;
  }
};
