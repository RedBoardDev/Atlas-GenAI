// MapComponent.tsx
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { useMap } from "@contexts/MapContext";
import { geoman, scale, subGroup } from "@utils/plugins";

const MapComponent: React.FC = () => {
  const { setMap } = useMap();

  useEffect(() => {
    const mapInstance = L.map("map").setView([46.603354, 1.888334], 6);
    const mtLayer = new MaptilerLayer({
      apiKey: "34VZkwOz4eNcq6ai3orq",
      style: "feb8df58-7be4-433f-9dfb-65415201546c",
    });
    mtLayer.addTo(mapInstance);


    geoman(mapInstance);
    scale(mapInstance);
    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [setMap]);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapComponent;
