/** @format */

// Add this to your next-env.d.ts file or create a new file like threejs.d.ts

/**
 * Type declarations for Three.js to help TypeScript understand GLTFLoader
 * and other Three.js extensions that might not be fully typed
 */

import * as THREE from "three";

declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  export class GLTFLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager);
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    setDRACOLoader(dracoLoader: any): GLTFLoader;
    setKTX2Loader(ktx2Loader: any): GLTFLoader;
    setMeshoptDecoder(meshoptDecoder: any): GLTFLoader;
    parse(
      data: ArrayBuffer | string,
      path: string,
      onLoad: (gltf: GLTF) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
  }

  export interface GLTF {
    animations: THREE.AnimationClip[];
    scene: THREE.Group;
    scenes: THREE.Group[];
    cameras: THREE.Camera[];
    asset: {
      copyright?: string;
      generator?: string;
      version?: string;
      minVersion?: string;
      extensions?: any;
      extras?: any;
    };
    parser: any;
    userData: any;
  }
}
