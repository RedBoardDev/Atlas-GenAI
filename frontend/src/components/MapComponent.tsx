import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { geoman, scale, subGroup } from "@utils/plugins";
import { useMap } from "@components/MapContext";

const MapComponent: React.FC = () => {
  const { setMap } = useMap();
  useEffect(() => {
    const map = L.map("map", {
      maxZoom: 18,  // 
    }).setView([46.603354, 1.888334], 6);
    
    setMap(map);
    // 🔹 Ajout de ton style personnalisé MapTiler
    const mtLayer = new MaptilerLayer({
      apiKey: "34VZkwOz4eNcq6ai3orq",
      style: "feb8df58-7be4-433f-9dfb-65415201546c",
    });

    mtLayer.addTo(map);

    // Ajout des autres fonctionnalités
    geoman(map);
    scale(map);

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapComponent;

