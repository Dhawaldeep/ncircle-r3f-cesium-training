import { Vector3 } from 'three';

export interface ITHREESyncCameraData {
  /**
   * Degress
   */
  fov: number;
  cameraPosition: Vector3;
  cameraDirection: Vector3;
  cameraUp: Vector3;
}