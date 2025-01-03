"use client";

import { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import "./locationMap.css";

export default function LocationMap() {
  const position = { lat: 50.9483, lng: 6.9534 };
  const [isOpen, setIsOpen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(15);

  const handleZoomChanged = (zoom) => {
    setCurrentZoom(zoom);
  };

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div className="map-container">
        <Map
          zoom={currentZoom}
          center={position}
          mapId={process.env.REACT_APP_GOOGLE_MAP_ID}
          gestureHandling={"greedy"}
          onZoomChanged={(e) => handleZoomChanged(e.detail.zoom)}
          options={{
            zoomControl: true,
            scrollwheel: true,
          }}
        >
          <AdvancedMarker position={position} onClick={() => setIsOpen(true)}>
            <Pin
              background={"#A09080"}
              borderColor={"#705F4D"}
              glyphColor={"#FFFFFF"}
            />
          </AdvancedMarker>
          {isOpen && (
            <InfoWindow
              position={position}
              onCloseClick={() => setIsOpen(false)}
            >
              <div className="info-window">
                <h3>The Han Hotel</h3>
                <p>Visit our Han Hotel in Cologne</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
