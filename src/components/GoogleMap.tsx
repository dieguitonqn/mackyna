// components/GoogleMap.tsx
'use client';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export default function GoogleMap({ lat, lng, zoom = 15 }: GoogleMapProps) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
  
  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat, lng }}
        defaultZoom={zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={false}
      >
        <Marker position={{ lat, lng }} />
      </Map>
    </APIProvider>
  );
}