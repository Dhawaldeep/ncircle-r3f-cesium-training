import { Camera } from 'cesium';
import { CARTESIAN_POSITION } from './assets/position';
import { useFrame } from '@react-three/fiber';
import { Group, PerspectiveCamera } from 'three';
import getCameraSyncDataForTHREE from './utils/data-sync.utils';
import { useCallback, useEffect, useState } from 'react';
import { Components, IfcLoader } from '@thatopen/components';
import { useControls } from 'leva';

export default function Experience({ cesiumCamera }: { cesiumCamera: Camera }) {
  const [ifcGroup, setIFCGroup] = useState<Group>();

  const loadIFCModel = useCallback(async (url: string) => {
    const components = new Components();
    const loader = components.get(IfcLoader);
    await loader.setup();
    loader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    const file = await fetch(url);
    const data = await file.arrayBuffer();
    const buffer = new Uint8Array(data);
    const group = await loader.load(buffer);
    console.log(group);
    setIFCGroup(group);
  }, []);

  useFrame((
    { gl, scene, camera }
  ) => {
    const { fov, cameraPosition, cameraDirection, cameraUp, } = getCameraSyncDataForTHREE(cesiumCamera);
    (camera as PerspectiveCamera).fov = fov;

    camera.updateProjectionMatrix();

    camera.position.copy(cameraPosition);

    camera.up.copy(cameraUp);
    camera.lookAt(cameraPosition.clone().add(cameraDirection));
    // // // position.x = camera.position.x;
    // // // position.y = camera.position.y;
    // // // position.z = camera.position.z;
    // const cube = cubeRef.current;
    // set({
    //   x: cameraPosition.x,
    //   y: cameraPosition.y,
    //   z: cameraPosition.z,
    // });


    // if (cube) {
    // cube.rotation.x += 0.02;
    // cube.position.copy(cameraPosition.clone().addScaledVector(cameraDirection, 10));
    // cube.position.copy(cameraPosition.clone().add(cameraDirection));
    // cube.position.copy(cameraPosition)
    // console.log(cube.position.toArray(), camera.position.toArray());
    // }

    gl.render(scene, camera);


    // camera.localToWorld(new Vector3(CARTESIAN_POSITION.x, CARTESIAN_POSITION.y, CARTESIAN_POSITION.z));
  }, 1);

  useEffect(() => {
    loadIFCModel("Duplex_A_20110907.ifc");
  }, [loadIFCModel]);

  const modelRotation = useControls("IFC Rotation", {
    x: {
      value: 1.37,
      min: 0,
      max: 2 * Math.PI,
      step: 0.01,
    },
    y: {
      value: 2.98,
      min: 0,
      max: 2 * Math.PI,
      step: 0.01,
    },
    z: {
      value: 0.68,
      min: 0,
      max: 2 * Math.PI,
      step: 0.01,
    },
  });

  return <>
    {/* <mesh position={[CARTESIAN_POSITION.x, CARTESIAN_POSITION.y, CARTESIAN_POSITION.z]}>
      <boxGeometry args={[50, 50, 50]} />
      <meshBasicMaterial args={[{
        color: 'red'
      }]} />
    </mesh> */}
    <axesHelper position={[CARTESIAN_POSITION.x, CARTESIAN_POSITION.y, CARTESIAN_POSITION.z]} />
    {ifcGroup && <group
      scale={0.6}
      position={[CARTESIAN_POSITION.x, CARTESIAN_POSITION.y, CARTESIAN_POSITION.z]}
      rotation={[modelRotation.x, modelRotation.y, modelRotation.z]}
    ><primitive object={ifcGroup} /></group>}
    <ambientLight />
  </>
}