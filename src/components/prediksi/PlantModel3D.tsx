/** @format */
"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BASE_URL } from "@/services/baseURL";
import { Loader2 } from "lucide-react";

interface PlantModel3DProps {
  plantClass: string | null;
  isVisible: boolean;
  currentModelClass: string | null;
  transparent?: boolean;
}

const PlantModel3D: React.FC<PlantModel3DProps> = ({
  plantClass,
  isVisible,
  transparent = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State untuk melacak model yang sudah dimuat
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loadedModelClass, setLoadedModelClass] = useState<string | null>(null);

  // Referensi untuk Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);

  // Mapping kelas tanaman ke file model 3D
  const plantModelMapping: { [key: string]: string } = {
    "Daun Kunyit": "daun_kunyit.glb",
    "Daun Kemangi": "daun_kemangi.glb",
    "Daun Pepaya": "daun_pepaya.glb",
    "Daun Sirih": "daun_sirih.glb",
    "Daun Sirsak": "daun_sirsak.glb",
    "Lidah Buaya": "lidah_buaya.glb",
  };

  // Effect untuk inisialisasi Three.js - dibuat ulang setiap kali isVisible berubah
  useEffect(() => {
    if (!isVisible) {
      // Cleanup saat tidak visible
      console.log("Component not visible, cleaning up");

      // Cancel animation frame
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }

      // Dispose renderer dan hapus dari DOM
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(
            rendererRef.current.domElement
          );
        }
      }

      // Reset semua referensi
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      controlsRef.current = null;
      modelRef.current = null;

      // Reset state
      setModelLoaded(false);
      setLoadedModelClass(null);
      setError(null);
      setLoading(false);

      return;
    }

    // Inisialisasi Three.js setiap kali isVisible berubah ke true
    console.log("Initializing Three.js scene");

    if (!containerRef.current) return;

    try {
      // Setup scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Background transparan
      if (transparent) {
        scene.background = null;
      } else {
        scene.background = new THREE.Color(0x000000);
      }

      // Setup lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
      backLight.position.set(-1, 0.5, -1);
      scene.add(backLight);

      // Setup camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;
      camera.position.z = 5;

      // Setup renderer
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      rendererRef.current = renderer;

      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x000000, 0);

      containerRef.current.appendChild(renderer.domElement);

      // Setup controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controlsRef.current = controls;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.8;

      // Animation loop
      const animate = () => {
        if (sceneRef.current && cameraRef.current && rendererRef.current) {
          frameIdRef.current = requestAnimationFrame(animate);

          if (controlsRef.current) {
            controlsRef.current.update();
          }

          // Auto rotate model
          if (modelRef.current && !controlsRef.current?.enableDamping) {
            modelRef.current.rotation.y += 0.005;
          }

          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current)
          return;

        cameraRef.current.aspect =
          containerRef.current.clientWidth / containerRef.current.clientHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } catch (err) {
      console.error("Error in initialization:", err);
      setError(
        `Error initializing 3D scene: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  }, [isVisible, transparent]);

  // Effect untuk load model - dipicu setiap kali plantClass berubah
  useEffect(() => {
    console.log("=== Model Loading Effect ===");
    console.log("plantClass:", plantClass);
    console.log("isVisible:", isVisible);

    if (!plantClass || !isVisible || !sceneRef.current) {
      return;
    }

    const modelName = plantModelMapping[plantClass];
    if (!modelName) {
      console.error("No model found for class:", plantClass);
      setError(`Tidak ada model 3D untuk tanaman: ${plantClass}`);
      document.dispatchEvent(new CustomEvent("model3dLoaded"));
      return;
    }

    loadModel(modelName, plantClass);
  }, [plantClass, isVisible]);

  // Load model 3D
  const loadModel = async (modelName: string, modelClass: string) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Clear existing model
      if (modelRef.current && sceneRef.current) {
        sceneRef.current.remove(modelRef.current);
        modelRef.current = null;
      }

      const modelUrl = `${BASE_URL}/media/medical_plant/${modelName}`;
      console.log("Loading model from:", modelUrl);

      const loader = new GLTFLoader();
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(modelUrl, resolve, undefined, reject);
      });

      if (!sceneRef.current) throw new Error("Scene reference not available");

      const model = gltf.scene;
      modelRef.current = model;

      // Center model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      model.position.set(-center.x, -center.y, -center.z);

      // Adjust camera
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = cameraRef.current!.fov * (Math.PI / 180);
      let cameraDistance = maxDim / (2 * Math.tan(fov / 2));
      cameraDistance *= 1.5;
      cameraRef.current!.position.z = cameraDistance;

      // Add model to scene
      sceneRef.current.add(model);

      // Reset controls
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }

      // Set state
      setModelLoaded(true);
      setLoadedModelClass(modelClass);

      // Dispatch event
      document.dispatchEvent(new CustomEvent("model3dLoaded"));
    } catch (err) {
      console.error("Error loading 3D model:", err);
      setError(
        `Gagal memuat model 3D: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      document.dispatchEvent(new CustomEvent("model3dLoaded"));
    } finally {
      setLoading(false);
    }
  };

  // Cleanup saat component unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting - final cleanup");
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement.parentNode) {
          rendererRef.current.domElement.parentNode.removeChild(
            rendererRef.current.domElement
          );
        }
      }
    };
  }, []);

  console.log({ loadedModelClass });

  // Jika tidak visible, tidak render apa-apa
  if (!isVisible) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center z-20 ${
        transparent ? "" : "bg-black bg-opacity-90"
      }`}
    >
      <div ref={containerRef} className="w-full h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-black bg-opacity-70 rounded-lg p-4 flex flex-col items-center">
              <Loader2 className="animate-spin mb-2 text-white" size={40} />
              <span className="text-white">Memuat model 3D...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-900 bg-opacity-80 p-4 rounded-lg max-w-md">
              <p className="text-white font-bold mb-2">Error:</p>
              <p className="text-white">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info untuk pengguna */}
      {modelLoaded && !loading && !error && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center">
          <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
            Geser untuk rotasi, scroll untuk zoom
          </div>
        </div>
      )}

      {/* Tombol Tutup */}
      <button
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full z-30"
        onClick={() => document.dispatchEvent(new CustomEvent("close3dModel"))}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default PlantModel3D;
