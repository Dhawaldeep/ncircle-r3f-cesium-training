import { ViewIcon } from '@chakra-ui/icons';
import { Button, Checkbox, CheckboxGroup, InputGroup, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack } from '@chakra-ui/react';
import { ArcGisBaseMapType, ArcGisMapServerImageryProvider, Cesium3DTileset, ImageryLayer, OpenStreetMapImageryProvider, Viewer } from 'cesium';
import { useCallback, useEffect, useState } from 'react';

export default function BaseLayer({ viewer }: { viewer: Viewer }) {
  const [japan3DBuilidingTileset, setJapan3DBuilidingTileset] = useState<Cesium3DTileset>();
  const [osmLayer, setOSMLayer] = useState<ImageryLayer>()
  const [esriLayer, setESRILayer] = useState<ImageryLayer>()

  const addBaseLayers = useCallback(async (viewer: Viewer) => {
    try {
      viewer.imageryLayers.removeAll(true);
      const esriLayer = await ArcGisMapServerImageryProvider.fromBasemapType(ArcGisBaseMapType.SATELLITE);
      const esriSatLayer = viewer.imageryLayers.addImageryProvider(esriLayer);
      setESRILayer(esriSatLayer);

      const osmLayer = new ImageryLayer(new OpenStreetMapImageryProvider({
        url: 'https://a.tile.openstreetmap.org/',
      }), {
        show: false,
        alpha: 1,
      });
      viewer.imageryLayers.add(osmLayer);
      setOSMLayer(osmLayer)
    } catch (error) {
      console.log(error);
    }
  }, []);

  const addJP3DBuilding = useCallback(async (viewer: Viewer) => {
    const tileset = await Cesium3DTileset.fromIonAssetId(2602291);
    viewer.scene.primitives.add(tileset);
    setJapan3DBuilidingTileset(tileset);
  }, []);

  useEffect(() => {
    if (viewer) {
      addBaseLayers(viewer);
      addJP3DBuilding(viewer);
    }
  }, [viewer, addBaseLayers, addJP3DBuilding]);

  useEffect(() => {
    return () => {
      console.log("Remove", japan3DBuilidingTileset);
      if (japan3DBuilidingTileset) {
        viewer.scene.primitives.remove(japan3DBuilidingTileset)
        viewer.imageryLayers.removeAll(true);
      };
    }
  }, [japan3DBuilidingTileset, viewer]);


  return <Stack pl='10px'>
    <CheckboxGroup>
      <InputGroup>
        <Checkbox icon={<ViewIcon />} onChange={() => {
          console.log(osmLayer, osmLayer?.show);
          if (!osmLayer) return;
          osmLayer.show = !osmLayer.show;
        }} >OpenLayers Street Map</Checkbox>
        {
          osmLayer?.show &&
          <Slider aria-label='slider-ex-1' defaultValue={1}
            min={0} max={1} step={0.01} onChange={(val) => {
              if (!osmLayer) return;
              osmLayer.alpha = val;
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        }
      </InputGroup>
      <Checkbox icon={<ViewIcon />} defaultChecked onChange={() => {
        if (!esriLayer) return;
        esriLayer.show = !esriLayer.show;
      }} >ESRI Satellite Layer</Checkbox>
    </CheckboxGroup>
    <Button size='sm' bg='black' color='white' _hover={{ bg: 'gray.700' }} onClick={() => {
      if (japan3DBuilidingTileset) {
        viewer.flyTo(japan3DBuilidingTileset, {
          duration: 5,
        });
      }
    }}>
      Fly to Japan
    </Button>
  </Stack>
}