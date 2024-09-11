import { useCallback, useEffect, useRef, useState } from 'react';
import { Cartesian3, Cesium3DTileset, Math, SkyAtmosphere, Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { CARTESIAN_POSITION } from './assets/position';
import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import { Leva } from 'leva';

function App() {
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<Viewer>();

  useEffect(() => {
    if (viewerRef.current) {
      setViewer(new Viewer(viewerRef.current, {
        globe: false,
        baseLayerPicker: false,
        skyAtmosphere: new SkyAtmosphere(),
      }));
    }
  }, [viewerRef]);

  const addGoogleEarthGlobe = useCallback(async (viewer: Viewer) => {
    const googleEarth3DTiles = await Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(googleEarth3DTiles);
  }, []);

  useEffect(() => {
    if (viewer) {
      console.log("ADD Earth");
      addGoogleEarthGlobe(viewer);

      setTimeout(() => {
        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(6.121879294045162, 49.62884635601481, 350),
          orientation: {
            heading: Math.toRadians(10),
            pitch: Math.toRadians(-35.0),
            roll: 0
          }
        });
      }, 5000);
    }
    return () => viewer?.destroy();
  }, [viewer, addGoogleEarthGlobe]);

  return (
    <>
      <Leva />
      <div className='viewer' ref={viewerRef}></div>
      {
        viewer &&
        <Canvas
          gl={{
            alpha: true,
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            outputColorSpace: SRGBColorSpace,
          }}
          camera={{
            fov: 75,
            near: 1,
            far: 50000000,
            position: [CARTESIAN_POSITION.x, CARTESIAN_POSITION.y + 5, CARTESIAN_POSITION.z],
            // position: [CARTESIAN_POSITION.x, CARTESIAN_POSITION.y + 5, 0],
          }}
          style={{
            zIndex: 1,
            pointerEvents: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Experience cesiumCamera={viewer.camera} />
        </Canvas >

      }
    </>
  )
}

export default App
