"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS = {
  conforme: "#7FB069",
  a_verifier: "#C99B4E",
  risque: "#C4593F",
};

export default function SatelliteMap({ parcels }) {
  const withCoords = parcels.filter((p) => p.lat && p.lng);

  const center =
    withCoords.length > 0
      ? [
          withCoords.reduce((s, p) => s + p.lat, 0) / withCoords.length,
          withCoords.reduce((s, p) => s + p.lng, 0) / withCoords.length,
        ]
      : [8.03, 2.48];

  return (
    <MapContainer
      center={center}
      zoom={withCoords.length > 0 ? 11 : 9}
      style={{ height: "320px", width: "100%", borderRadius: 8 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      {withCoords.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lng]}
          radius={8}
          pathOptions={{
            color: "#0E1F17",
            weight: 2,
            fillColor: STATUS_COLORS[p.status] || STATUS_COLORS.a_verifier,
            fillOpacity: 0.9,
          }}
        >
          <Tooltip>
            {p.producer_name} — {p.coop}
            <br />
            {p.area_ha ? `${p.area_ha} ha` : ""}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
