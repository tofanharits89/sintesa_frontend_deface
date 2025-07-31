import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const MapTest = () => {
  const testGeoJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Test Rectangle" },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [100, 0],
            [101, 0],
            [101, 1],
            [100, 1],
            [100, 0]
          ]]
        }
      }
    ]
  };

  return (
    <div style={{ width: "100%", height: "400px", border: "1px solid red" }}>
      <h3>Map Test</h3>
      <ComposableMap width={800} height={400}>
        <Geographies geography={testGeoJson}>
          {({ geographies }) =>
            geographies.map((geo, i) => (
              <Geography
                key={i}
                geography={geo}
                fill="#DDD"
                stroke="#999"
                strokeWidth={0.5}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapTest;
