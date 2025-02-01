import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import {
  geoman,
  addHeatmap,
  heatData,
  scale,
  search_layer,
  subGroup
} from "@utils/plugins";

const MapComponent: React.FC = () => {
  useEffect(() => {
    const map = L.map("map").setView([46.603354, 1.888334], 6);

    // 🔹 Ajout de ton style personnalisé MapTiler
    const mtLayer = new MaptilerLayer({
      apiKey: "34VZkwOz4eNcq6ai3orq", 
      style: "feb8df58-7be4-433f-9dfb-65415201546c",
    });

    mtLayer.addTo(map);

    // Ajout de tes autres fonctionnalités
    geoman(map);
    //addHeatmap(map, heatData);
    scale(map);
    //search_layer(map);
    subGroup(map);


    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};


export default MapComponent;
