import { Cesium3DTileset, Terrain, Viewer } from 'cesium';
import { useEffect, useRef, useState } from 'react'
import "cesium/Build/Cesium/Widgets/widgets.css"
import BaseLayer from './components/BaseLayer';
import DataViz from './components/DataViz';
import ISSTrajectory from './components/ISSTrajectory';
import GooglePhotoRealistic3DTiles from './components/GooglePhotoRealistic3DTiles';
import { Box, Divider, Radio, RadioGroup, Stack } from '@chakra-ui/react';

function App() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<Viewer>();
  const [google3DTiles, setGoogle3DTiles] = useState<Cesium3DTileset>();
  const [globeType, setGlobeType] = useState<"1" | "2">("1")

  useEffect(() => {
    if (viewerRef.current && !viewer) {
      console.log(viewer);

      setViewer(new Viewer(viewerRef.current, {
        terrain: Terrain.fromWorldTerrain(),
      }));
    }

    if (viewer && viewerRef.current && viewerRef.current.children.length > 1) {
      const firstChild = viewerRef.current?.firstChild;
      firstChild?.remove();
    }

    return () => viewer?.destroy();
  }, [viewerRef, viewer]);

  useEffect(() => {
    console.log(google3DTiles, globeType);
  }, [google3DTiles, globeType]);

  return <>
    <div className='viewer' ref={viewerRef}></div>
    {
      viewer &&
      <Box position={'absolute'} top='60px' right='5px' boxShadow='xs' p='6' rounded='md' bg='white' minWidth='300px'>
        <RadioGroup defaultValue='1' onChange={(val) => setGlobeType(val as ("1" | "2"))}>
          <Stack>
            <Radio value='1'>
              Cesium Globe
            </Radio>
            {
              globeType === "1" &&
              <BaseLayer viewer={viewer} />
            }
            <Radio value='2'>
              Google Earth
            </Radio>
          </Stack>
        </RadioGroup>
        <Divider mt='25px' mb='25px' />
        {
          globeType === "2" &&
          <GooglePhotoRealistic3DTiles viewer={viewer} onLoad={tileset => setGoogle3DTiles(tileset)} />
        }
        <DataViz viewer={viewer} />
        <Divider mt='25px' mb='25px' />
        <ISSTrajectory viewer={viewer} />
      </Box>
    }
  </>
}

export default App
