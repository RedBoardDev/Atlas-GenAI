import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { MaptilerLayer } from "@maptiler/leaflet-maptilersdk";
import { geoman, scale, subGroup } from "@utils/plugins";

const MapComponent: React.FC = () => {
  useEffect(() => {
    const map = L.map("map", {
      maxZoom: 18,  // 
    }).setView([43.7102, 7.2620], 13);
    

    // 🔹 Ajout de ton style personnalisé MapTiler
    const mtLayer = new MaptilerLayer({
      apiKey: "34VZkwOz4eNcq6ai3orq",
      style: "feb8df58-7be4-433f-9dfb-65415201546c",
    });

    mtLayer.addTo(map);

    // Ajout des autres fonctionnalités
    geoman(map);
    scale(map);

    // 🔹 Création du `markerClusterGroup`
    const markerClusterGroup = L.markerClusterGroup();

    // Initialisation du tableau de marqueurs
    const markers: L.Marker[] = [];

    // Fonction pour récupérer les bâtiments publics via Overpass API
    const fetchPublicBuildings = async () => {
      const query = `
        [out:json];
        area[name="Nice"]->.searchArea;
        (
          node["amenity"="school"](area.searchArea);
          node["amenity"="hospital"](area.searchArea);
          node["amenity"="university"](area.searchArea);
          node["amenity"="library"](area.searchArea);
          node["amenity"="police"](area.searchArea);
          node["amenity"="fire_station"](area.searchArea);
        );
        out body;
      `;

      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.elements) {
          data.elements.forEach((element: any) => {
            if (element.lat && element.lon) {
              const marker = L.marker([element.lat, element.lon], {
                icon: L.icon({
                  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
                  iconSize: [12, 12]
                })
              }).bindPopup(`<b>${element.tags.amenity}</b>`);

              markers.push(marker); // 🔹 Ajout du marqueur dans le tableau
            }
          });

          // 🔹 Ajout du `markerClusterGroup` à la carte AVANT d'ajouter `subGroup`
          map.addLayer(markerClusterGroup);

          // 🔹 Ajout des marqueurs au `subGroup`, qui sera géré par le `markerClusterGroup`
          subGroup(map, markers, markerClusterGroup);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des bâtiments publics :", error);
      }
    };

    // Charger les données
    fetchPublicBuildings();

    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default MapComponent;
