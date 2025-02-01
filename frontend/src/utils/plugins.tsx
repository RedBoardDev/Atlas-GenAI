import L from "leaflet";
import 'leaflet.heat';
import 'leaflet.featuregroup.subgroup';
import '@utils/betterscale.module.css';
import 'leaflet-betterscale';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@utils/geosearch.module.css';
import 'leaflet-easyprint';
import 'leaflet-search';
import '@utils/leaflet-search.module.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

interface Point {
  coords: [number, number];
  name: string;
}


// Liste des marqueurs
const markers: L.Marker[] = [
  L.marker([48.8566, 2.3522]).bindPopup("Paris"),
  L.marker([48.8556, 2.3521]).bindPopup("Paris"),
  L.marker([48.8546, 2.3522]).bindPopup("Paris"),
  L.marker([48.8536, 2.3523]).bindPopup("Paris"),
  L.marker([48.8526, 2.3524]).bindPopup("Paris"),
  L.marker([48.6566, 2.3522]).bindPopup("Paris"),
  L.marker([48.4566, 2.3522]).bindPopup("Paris"),
  L.marker([48.8566, 2.1522]).bindPopup("Paris"),
  L.marker([48.8566, 2.5522]).bindPopup("Paris"),
];
// SubGroup - crée des clusters en affichant le nombre de points dans la zone correspondante
export const subGroup = (map: L.Map) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Options pour le MarkerClusterGroup
      const options: L.MarkerClusterGroupOptions = {
        showCoverageOnHover: true,
        disableClusteringAtZoom: 25,
      };

      // Création du groupe parent (Marker Cluster Group)
      const parentGroup = (L as any).markerClusterGroup(options);

      // Création du sous-groupe via le plugin FeatureGroup.SubGroup
      const mySubGroup = (L as any).featureGroup.subGroup(parentGroup, markers);

      // Ajout des groupes à la carte
      parentGroup.addTo(map);
      mySubGroup.addTo(map);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// Marqueur - ajoute des points / marqueurs aux coordonnées indiquées
export const points: Point[] = [
  { coords: [48.8566, 2.3522], name: "Paris" },
  { coords: [45.764, 4.8357], name: "Lyon" },
  { coords: [43.6047, 1.4442], name: "Toulouse" },
  { coords: [50.6292, 3.0573], name: "Lille" },
];

export const addMarkers = (map: L.Map, points: Point[]) => {
  points.forEach((point) => {
    (L as any).marker(point.coords)
      .addTo(map)
      .bindPopup(`<b>${point.name}</b>`);
  });
};

// Geoman - Tracer et ajouter des formes diverses sur la carte
export const geoman = (map: L.Map) => {
  map.pm.addControls({
    position: 'topleft',
  });
}

// Geosearch - possibilité de chercher une adresse précise sur la carte
export const geosearch = (map: L.Map) => {
  const provider = new OpenStreetMapProvider();
  const searchControl = new (GeoSearchControl as any)({
    provider,
    position: 'bottomright',
  });
  map.addControl(searchControl);
}

// HEAT - ajoute une heatmap aux coordonnées indiquées

// Exemple de données pour la heatmap (latitude, longitude, intensité)
export const heatData: [number, number, number][] = [
  [48.8566, 2.3522, 9999.5],  // Paris
  [43.6047, 1.4442, 0.4],  // Toulouse
  [45.7640, 4.8357, 0.6],  // Lyon
];

export const addHeatmap = (map: L.Map, data: [number, number, number][]) => {
  // data est un tableau de points [latitude, longitude, intensité]
  const heat = (L as any).heatLayer(data, {
    radius: 25,  // rayon de chaque "point" sur la heatmap
    blur: 15,    // flou appliqué aux points
    maxZoom: 17, // niveau de zoom maximum pour l'affichage de la heatmap
  }).addTo(map);
  return heat;
};

// Betterscale - Ajoute une échelle dans le coin de l'écran
export const scale = (map: L.Map) => {
  (L as any).control.betterscale({ imperial: false, metric: true }).addTo(map); // enlever les arguments dans betterscale pour avoir l'échelle en miles
};

// Search-layer - Chercher un marqueur à partir d'un nom
export const search_layer = (map: L.Map) => {
  const searchLayer = L.layerGroup().addTo(map);
  
  // Test : ajout d'un marqueur temporaire
  const testMarker = L.marker([48.8566, 2.3522]).bindPopup("Test");
  searchLayer.addLayer(testMarker);

  map.addControl(new (L as any).Control.Search({
    layer: searchLayer,
    position: 'topleft',
    initial: false,
    zoom: 12,
    marker: false
  }));
};

// Print - permet de télécharger l'image actuelle, dans le but d'imprimer par la suite
export const printer = (map: L.Map) => {
  (L as any).easyPrint({
    title: 'Print Map',
    position: 'topright',
    sizeModes: ['A4Portrait', 'A4Landscape'],
    filename: 'myMap',
    exportOnly: true,
    hideControlContainer: false,
  }).addTo(map);
};
// Subgroup à tester, peut etre fonctionnel mais que les données sont nazes