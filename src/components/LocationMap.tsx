interface LocationMapProps {
  lat: number;
  lng: number;
}

export default function LocationMap({ lat, lng }: LocationMapProps) {
  const padding = 0.008;
  const bbox = `${lng - padding},${lat - padding},${lng + padding},${lat + padding}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <iframe
      title="Mapa de Mackyna en Neuquén"
      src={src}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      className="block h-full min-h-0 w-full border-0"
      allowFullScreen
    />
  );
}
