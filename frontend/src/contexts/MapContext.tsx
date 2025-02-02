import React, { createContext, useState, useContext, ReactNode } from "react";
import L, { Map } from "leaflet";

interface MapContextProps {
  map?: Map;
  setMap: (map: Map) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [map, setMap] = useState<Map>();

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextProps => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within a MapProvider");
  return context;
};
