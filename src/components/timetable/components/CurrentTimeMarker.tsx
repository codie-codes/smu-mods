interface CurrentTimeMarkerProps {
  position: number;
  isVisible: boolean;
}

export function CurrentTimeMarker({
  position,
  isVisible,
}: CurrentTimeMarkerProps) {
  if (!isVisible) return null;

  return (
    <>
      {/* Red Line */}
      <div
        className="absolute bg-red-500"
        style={{
          left: `${position}%`,
          height: "95%",
          width: "2px",
          zIndex: 10,
        }}
      />

      {/* Circle Marker */}
      <div
        className="absolute rounded-full bg-red-500"
        style={{
          left: `calc(${position}% - 4px)`, // Center the circle on the line
          top: "-2px", // Slightly above the line
          width: "10px",
          height: "10px",
          zIndex: 10,
        }}
      />
    </>
  );
}
