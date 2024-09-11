import { Camera, Cartesian3, Math, PerspectiveFrustum } from 'cesium';
import { ITHREESyncCameraData } from '../types/camera-sync.interface';
import { Vector3 } from 'three';

export default function getCameraSyncDataForTHREE(cesiumCamera: Camera): ITHREESyncCameraData {
  const fov = Math.toDegrees((cesiumCamera.frustum as PerspectiveFrustum).fovy);
  const cvm = cesiumCamera.viewMatrix;
  const civm = cesiumCamera.inverseViewMatrix;

  // Fix the extraction of camera position and direction from matrices
  const cameraPositionC3 = Cartesian3.fromElements(civm[12], civm[13], civm[14]);
  const cameraDirectionC3 = new Cartesian3(-cvm[2], -cvm[6], -cvm[10]);
  const cameraUpC3 = new Cartesian3(cvm[1], cvm[5], cvm[9]);

  const cameraPosition = new Vector3(cameraPositionC3.x, cameraPositionC3.y, cameraPositionC3.z);
  const cameraDirection = new Vector3(cameraDirectionC3.x, cameraDirectionC3.y, cameraDirectionC3.z);
  const cameraUp = new Vector3(cameraUpC3.x, cameraUpC3.y, cameraUpC3.z);

  return {
    fov,
    cameraPosition,
    cameraDirection,
    cameraUp,
  }
}