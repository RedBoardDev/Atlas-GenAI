import React, { createContext, useContext, useState } from "react";
import L from "leaflet";
import { subGroup } from "@utils/plugins";
import { booleanPointInPolygon, point } from "@turf/turf";
import { Feature, Polygon, MultiPolygon } from "geojson";

interface MapContextProps {
  map: L.Map | null;
  setMap: (map: L.Map) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<L.Map | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap doit être utilisé à l'intérieur de MapProvider");
  }
  return context;
};

export const loadPublicBuildings = async (map: L.Map) => {
    if (!map) {
      console.error("La carte Leaflet n'est pas encore initialisée !");
      return;
    }
  
    // 🔹 Groupe de clusters
    const markerClusterGroup = L.markerClusterGroup();
    // Tableau de marqueurs
    const markers: L.Marker[] = [];
  
    // 🔹 1) Récupération du polygone depuis `data.geojson`
    let polygonFeature: Feature<Polygon | MultiPolygon> | null = null;
    try {
      const geoJsonResponse = await fetch("/data.geojson");
      const geoJsonData = await geoJsonResponse.json();
  
      // On suppose ici qu'il y a au moins un Feature dans le FeatureCollection.
      // Vous pouvez adapter la logique si vous avez plusieurs polygones.
      const firstFeature = geoJsonData.features[0];
  
      if (
        firstFeature &&
        (firstFeature.geometry.type === "Polygon" ||
         firstFeature.geometry.type === "MultiPolygon")
      ) {
        // On "caste" pour satisfaire TypeScript,
        // maintenant on sait que c'est un Polygon ou un MultiPolygon.
        polygonFeature = firstFeature as Feature<Polygon | MultiPolygon>;
      } else {
        console.error("La géométrie de data.geojson n'est pas un (Multi)Polygon !");
        return;
      }
    } catch (error) {
      console.error("Erreur de chargement du fichier data.geojson :", error);
      return;
    }
  
    // 🔹 2) Construction de la requête Overpass
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
  
    // 🔹 3) Récupération et filtrage des données Overpass
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.elements) {
        data.elements.forEach((element: any) => {
          if (element.lat && element.lon) {
            // Création d'un point Turf (attention à l'ordre [lon, lat])
            const turfPoint = point([element.lon, element.lat]);
  
            // Vérification si le point est dans le polygone
            if (polygonFeature && booleanPointInPolygon(turfPoint, polygonFeature)) {
              // 🔹 Si oui, on crée et on stocke le marqueur
              const marker = L.marker([element.lat, element.lon], {
                icon: L.icon({
                  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg",
                  iconSize: [12, 12],
                }),
              }).bindPopup(`<b>${element.tags.amenity}</b>`);
  
              markers.push(marker);
            }
          }
        });
  
        // 🔹 4) Ajout du markerClusterGroup à la carte
        map.addLayer(markerClusterGroup);
  
        // 🔹 5) Ajout des marqueurs au subGroup
        subGroup(map, markers, markerClusterGroup);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des bâtiments publics :", error);
    }
  };
  