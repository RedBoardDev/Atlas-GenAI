import L from "leaflet";
import "leaflet.heat";
import "leaflet.featuregroup.subgroup";
import "leaflet-betterscale";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "leaflet-search";
import "@utils/leaflet-search.module.css";

interface Point {
  coords: [number, number];
  name: string;
}

// 🔹 SubGroup - Crée des clusters et gère les marqueurs dans des groupes
export const subGroup = (
  map: L.Map,
  markers: L.Marker[],
  markerClusterGroup: L.MarkerClusterGroup
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // 🔹 Correction : On s'assure que le `markerClusterGroup` est ajouté à la carte
      if (!map.hasLayer(markerClusterGroup)) {
        map.addLayer(markerClusterGroup);
      }

      // 🔹 Correction TypeScript : Utilisation de `as any` pour éviter l'erreur TS
      const mySubGroup = (L.featureGroup as any).subGroup(markerClusterGroup, markers);

      // 🔹 Ajout des marqueurs au `subGroup`
      mySubGroup.addTo(map);
      markerClusterGroup.addLayer(mySubGroup);

      resolve();
    } catch (error) {
      console.error("Erreur dans la création du subGroup :", error);
      reject(error);
    }
  });
};

// 🔹 Ajoute des marqueurs sur la carte aux coordonnées indiquées
export const addMarkers = (map: L.Map, points: Point[]) => {
  points.forEach((point) => {
    L.marker(point.coords)
      .addTo(map)
      .bindPopup(`<b>${point.name}</b>`);
  });
};

// 🔹 Geoman - Permet de tracer et d'ajouter des formes diverses sur la carte
export const geoman = (map: L.Map) => {
  map.pm.addControls({
    position: "topleft",
  });
};

// 🔹 Heatmap - Ajoute une heatmap aux coordonnées indiquées
export const heatData: [number, number, number][] = [
  [48.8566, 2.3522, 0.9], // Paris
  [43.6047, 1.4442, 0.6], // Toulouse
  [45.7640, 4.8357, 0.7], // Lyon
];

export const addHeatmap = (map: L.Map, data: [number, number, number][]) => {
  const heat = (L as any).heatLayer(data, {
    radius: 25, // Rayon de chaque point sur la heatmap
    blur: 15, // Flou appliqué aux points
    maxZoom: 17,
  }).addTo(map);
  return heat;
};

// 🔹 Échelle - Ajoute une échelle de distance dans le coin de l'écran
export const scale = (map: L.Map) => {
  (L as any).control.betterscale({ imperial: false, metric: true }).addTo(map);
};

// 🔹 Recherche - Ajoute un champ de recherche pour trouver un marqueur par son nom
export const search_layer = (map: L.Map) => {
  const searchLayer = L.layerGroup().addTo(map);

  // Ajout d'un marqueur temporaire pour test
  const testMarker = L.marker([48.8566, 2.3522]).bindPopup("Test");
  searchLayer.addLayer(testMarker);

  map.addControl(
    new (L as any).Control.Search({
      layer: searchLayer,
      position: "topleft",
      initial: false,
      zoom: 12,
      marker: false,
    })
  );
};
