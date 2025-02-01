import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Geoman
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

// GeoSearch
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Heat
import 'leaflet.heat';

// Vos styles (module CSS)
import './MapComponent.module.css';

const MapComponent: React.FC = () => {
  useEffect(() => {
  
    const map = L.map('map').setView([46.603354, 1.888334], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    //Geoman
    function geoman() {
      map.pm.addControls({
        position: 'topleft',
      });
    }

    //GeoSearch
    function geosearch() {
      const provider = new OpenStreetMapProvider();
      const searchControl = new (GeoSearchControl as any)({
        provider,
        position: 'bottomright',
      });
      map.addControl(searchControl);
    }
    
    //Heat
    function Heat(lat: number, lng: number, intensity: number = 0.5) {
      const heatLayer = (L as any).heatLayer([], {
        radius: 99,    // rayon en pixels
        blur: 1,      // flou de l'effet
        max: 11.0,   // intensité maximale par point
        
        // Vous pouvez également définir d'autres options, comme gradient, minOpacity, etc.
  
      }).addTo(map);
  
        // Ajoute le point au heatLayer
        heatLayer.addLatLng([lat, lng, intensity]);
    }

    // Ajout des contrôles
    geoman();
    geosearch();
    Heat(48.8566, 2.3522, 1);


    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
