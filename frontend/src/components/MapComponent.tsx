import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geosearch , geoman, addHeatmap , heatData , addMarkers , points , scale , search_layer, subGroup , printer} from '@utils/plugins';

const MapComponent: React.FC = () => {
  useEffect(() => {
  
    const map = L.map('map').setView([46.603354, 1.888334], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    geoman(map);
    geosearch(map);
    addHeatmap(map,heatData);
    // addMarkers(map, points);
    scale(map);
    search_layer(map);
    subGroup(map);
    printer(map);
    
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;
