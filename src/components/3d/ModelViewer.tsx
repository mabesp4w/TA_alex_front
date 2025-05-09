/** @format */

"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PresentationControls,
  Stage,
  useGLTF,
} from "@react-three/drei";
import { AlertCircle } from "lucide-react";

// Karena kita perlu menghindari penggunaan hook, kita buat komponen Model yang
// menggunakan hook useGLTF di dalamnya
function Model({ modelPath }: { modelPath: string }) {
  const model = useGLTF(modelPath);

  return <primitive object={model.scene} scale={1.5} position={[0, 0, 0]} />;
}

type ModelViewerProps = {
  modelUrl: string;
  title?: string;
  isInteractive?: boolean;
};

export default function ModelViewer({
  modelUrl,
  title,
  isInteractive = true,
}: ModelViewerProps) {
  // Deteksi format file model 3D (untuk menentukan loader yang tepat)
  const fileExtension = modelUrl.split(".").pop()?.toLowerCase();

  // Periksa apakah format didukung
  const supportedFormats = ["glb", "gltf", "obj", "fbx"];
  const isSupported = fileExtension && supportedFormats.includes(fileExtension);

  if (!isSupported) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>Format model 3D tidak didukung ({fileExtension})</span>
        </div>
        <p className="text-sm mt-2">
          Format yang didukung: GLB, GLTF, OBJ, FBX
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-inner">
      {title && (
        <div className="bg-white p-3 rounded-t-lg border-b">
          <h3 className="text-lg font-medium text-teal-800">{title}</h3>
        </div>
      )}

      <div className="aspect-w-16 aspect-h-9 w-full">
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
          <Suspense fallback={null}>
            {isInteractive ? (
              <>
                <ambientLight intensity={0.5} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={1}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <Model modelPath={modelUrl} />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                />
              </>
            ) : (
              <PresentationControls
                global
                rotation={[0, -Math.PI / 4, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <Stage environment="city" intensity={0.6}>
                  <Model modelPath={modelUrl} />
                </Stage>
              </PresentationControls>
            )}
          </Suspense>
        </Canvas>
      </div>

      <div className="p-3 bg-white rounded-b-lg border-t text-sm text-gray-600 flex items-center justify-center">
        <p>Gunakan mouse untuk memutar, zoom, dan geser model</p>
      </div>
    </div>
  );
}
