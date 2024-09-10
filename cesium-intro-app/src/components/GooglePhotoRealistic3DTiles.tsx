import { Cesium3DTileset, Viewer } from 'cesium';
import { useCallback, useEffect, useState } from 'react';

export default function GooglePhotoRealistic3DTiles({ viewer, onLoad }: { viewer: Viewer; onLoad: (tileSet: Cesium3DTileset) => void }) {
  const [added, setAdded] = useState(false);
  const [googleEarth3DTiles, setGoogleEarth3DTiles] = useState<Cesium3DTileset>();

  const addGoogleEarthGlobe = useCallback(async (viewer: Viewer) => {
    const googleEarth3DTiles = await Cesium3DTileset.fromIonAssetId(2275207);
    viewer.scene.primitives.add(googleEarth3DTiles);
    onLoad(googleEarth3DTiles);
    setGoogleEarth3DTiles(googleEarth3DTiles);
  }, [onLoad]);

  useEffect(() => {
    if (!added) {
      viewer.scene.globe.show = false;
      console.log("ADD");
      addGoogleEarthGlobe(viewer)
      setAdded(true);
    }
  }, [viewer, addGoogleEarthGlobe, added]);

  useEffect(() => {
    return () => {
      if (googleEarth3DTiles) {
        console.log(viewer.scene.primitives.remove(googleEarth3DTiles))
        console.log(viewer.scene.primitives)
        viewer.scene.globe.show = true;
      };
    }
  }, [googleEarth3DTiles, viewer]);

  return <></>
}