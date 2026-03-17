/**
 * MapPicker — Reusable map component for picking location (lat/lng).
 * Used in PropertyForm Step2Location.
 */

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const SAUDI_CENTER = { lat: 24.7136, lng: 46.6753 };

interface MapPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
  height?: string;
  label?: string;
}

export function MapPicker({ value, onChange, height = '300px', label }: MapPickerProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey === 'your-google-maps-api-key') {
    return (
      <div
        className="flex flex-col items-center justify-center bg-slate-100 text-slate-600 rounded-lg border border-slate-200"
        style={{ height }}
      >
        <p className="text-sm text-center px-4">
          {label || 'إعداد خرائط جوجل / Google Maps Setup'}
        </p>
        <p className="text-xs mt-1 text-slate-500">
          VITE_GOOGLE_MAPS_API_KEY في .env
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="rounded-lg overflow-hidden border border-slate-200" style={{ height }}>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={value || SAUDI_CENTER}
            defaultZoom={value ? 15 : 10}
            gestureHandling="greedy"
            style={{ width: '100%', height: '100%' }}
            mapId="DEMO_MAP_ID"
            onClick={(ev: unknown) => {
              const e = ev as { detail?: { latLng?: { lat: () => number; lng: () => number } } };
              const ll = e.detail?.latLng;
              if (ll) onChange(ll.lat(), ll.lng());
            }}
          >
            {value && (
              <AdvancedMarker position={value} />
            )}
          </Map>
        </APIProvider>
      </div>
      {value && (
        <p className="text-xs text-slate-500">
          {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}
