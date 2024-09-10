import { Cartesian2, Cartesian3, Color, ColorMaterialProperty, DataSource, DistanceDisplayCondition, Entity, GeoJsonDataSource, KmlDataSource, LabelStyle, VerticalOrigin, Viewer } from 'cesium';
import { useCallback, useEffect, useState } from 'react';
import { centralPark, centralParkReservoir } from '../assets/data';
import { Button, Stack } from '@chakra-ui/react';

export default function DataViz({ viewer }: { viewer: Viewer }) {
  const [geoJSONDS, setGeoJSONDS] = useState<DataSource>();
  const [kmlDS, setKMLDS] = useState<DataSource>();
  const [entities, setEntities] = useState<Entity[]>();

  const addGeoJSONData = useCallback(async (viewer: Viewer) => {
    const geoJSONDS = await GeoJsonDataSource.load("/north-east-india.geojson", {
      clampToGround: true,
    });
    const entities = geoJSONDS.entities.values;

    const enitiesMap = new Map<number, Entity[]>();

    for (const entity of entities) {
      const id_1 = entity.properties?.getValue().ID_1;
      if (enitiesMap.has(id_1)) {
        enitiesMap.get(id_1)!.push(entity);
      } else {
        enitiesMap.set(id_1, [entity]);
      }
    }

    for (const entities of enitiesMap.values()) {
      const material = new ColorMaterialProperty(Color.fromRandom({ alpha: 0.6 }));
      const positions: Cartesian3[] = [];
      for (const entity of entities) {
        if (entity.polygon) {
          entity.polygon.material = material;
          positions.push(
            ...entity.polygon.hierarchy!.getValue().positions
          );
        }
      }

      const centerPos = new Cartesian3();

      positions.forEach(pos => {
        centerPos.x += pos.x;
        centerPos.y += pos.y;
        centerPos.z += pos.z;
      });

      centerPos.x /= positions.length;
      centerPos.y /= positions.length;
      centerPos.z /= positions.length;

      const stateName = entities[0].properties?.getValue().NAME_1;

      viewer.entities.add({
        position: centerPos,
        label: {
          text: stateName,
          font: "12px sans-serif",
          fillColor: Color.BLACK,
          outlineColor: Color.WHITE,
          outlineWidth: 2,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
          pixelOffset: new Cartesian2(0, -20),
          distanceDisplayCondition: new DistanceDisplayCondition(10, 2 * Math.pow(10, 6)),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
      });
    }

    viewer.dataSources.add(geoJSONDS);

    setGeoJSONDS(geoJSONDS);
    // viewer.flyTo(geoJSONDS);
  }, []);

  const addKMLDataSource = useCallback(async (viewer: Viewer) => {
    const kmlDS = await KmlDataSource.load("/Jogging Path.kml", {
      clampToGround: true,
    });
    viewer.dataSources.add(kmlDS);
    setKMLDS(kmlDS);
  }, []);

  const addEntities = useCallback((viewer: Viewer) => {
    console.log(viewer);
    const entities = centralPark.features[0].geometry.coordinates.map(parkCoords => {
      return viewer.entities.add({
        wall: {
          positions: Cartesian3.fromDegreesArrayHeights(parkCoords[0].map(coords => ([...coords, 50])).flat()),
          material: new ColorMaterialProperty(Color.GREEN),
          fill: true,
        }
      });
    });

    const positions = Cartesian3.fromDegreesArray(centralParkReservoir.features[0].geometry.coordinates[0].flat());

    console.log(positions);

    const centerPos = new Cartesian3();

    positions.forEach(pos => {
      centerPos.x += pos.x;
      centerPos.y += pos.y;
      centerPos.z += pos.z;
    });

    centerPos.x /= positions.length;
    centerPos.y /= positions.length;
    centerPos.z /= positions.length;

    const reservoir = viewer.entities.add({
      polygon: {
        hierarchy: positions,
        extrudedHeight: 20,
        material: new ColorMaterialProperty(Color.BLUE.withAlpha(0.1)),
      },
    });

    const labelEntity = viewer.entities.add({
      position: centerPos,
      label: {
        text: centralParkReservoir.features[0].properties.name,
        font: "14px sans-serif",
        fillColor: Color.RED,
        // outlineColor: Color.WHITE,
        // outlineWidth: 2,
        style: LabelStyle.FILL,
        verticalOrigin: VerticalOrigin.BOTTOM,
        pixelOffset: new Cartesian2(0, -20),
        distanceDisplayCondition: new DistanceDisplayCondition(0, 5000),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    });

    console.log([...entities, reservoir, labelEntity]);
    setEntities([...entities, reservoir, labelEntity]);
    // viewer.flyTo([...entities, reservoir, labelEntity], {
    //   duration: 5,
    // });
  }, []);

  useEffect(() => {
    addGeoJSONData(viewer);
    addKMLDataSource(viewer);
    addEntities(viewer);
  }, [viewer, addGeoJSONData, addKMLDataSource, addEntities]);

  return <Stack mt='5px'>
    <Button size='sm' bg='black' color='white' _hover={{ bg: 'gray.700' }} onClick={() => {
      if (geoJSONDS) viewer.flyTo(geoJSONDS);
    }}>
      Fly to GeoJSON Data
    </Button>
    <Button size='sm' bg='black' color='white' _hover={{ bg: 'gray.700' }} onClick={() => {
      if (kmlDS) viewer.flyTo(kmlDS, {
        duration: 5,
      });
    }}>
      Fly to KML Data
    </Button>
    <Button size='sm' bg='black' color='white' _hover={{ bg: 'gray.700' }} onClick={() => {
      if (entities) {
        viewer.flyTo(entities, {
          duration: 5,
        });
      }
    }}>
      Fly to Custom Entities
    </Button>
  </Stack>
}