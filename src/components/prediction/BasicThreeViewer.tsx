/**
 * @format
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-expect-error
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-expect-error
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface BasicThreeViewerProps {
  modelUrl: string;
  isFullscreen?: boolean;
}

const BasicThreeViewer: React.FC<BasicThreeViewerProps> = ({
  modelUrl,
  isFullscreen = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fungsi setup Three.js
  useEffect(() => {
    if (!containerRef.current) return;

    let animationFrameId: number;

    // Scene setup
    const scene = new THREE.Scene();
    // Buat background transparan
    scene.background = null;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    // Renderer setup minimal
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
      });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.setPixelRatio(window.devicePixelRatio);
      // @ts-expect-error
      renderer.outputEncoding = THREE.sRGBEncoding;

      // Atur transparent background
      renderer.setClearColor(0x000000, 0);

      // Tidak perlu shadow untuk AR
      renderer.shadowMap.enabled = false;

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(renderer.domElement);
    } catch (err) {
      console.error("Failed to create WebGL renderer:", err);
      setLoadError("Failed to initialize 3D renderer");
      return;
    }

    // Lighting minimal
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.minDistance = 1;
    controls.maxDistance = 20;

    // Load model
    const loader = new GLTFLoader();

    try {
      if (modelUrl) {
        loader.load(
          modelUrl,
          // @ts-expect-error
          (gltf) => {
            // Model berhasil di-load
            const model = gltf.scene;

            // Hapus bayangan untuk tampilan minimal
            model.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;

                // Atur material secara minimal
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => {
                      mat.transparent = true;
                      mat.side = THREE.DoubleSide;
                      // Hapus efek lainnya jika ada
                    });
                  } else {
                    child.material.transparent = true;
                    child.material.side = THREE.DoubleSide;
                    // Hapus efek lainnya jika ada
                  }
                }
              }
            });

            scene.add(model);

            // Auto-center dan auto-scale model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Reset posisi ke tengah
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Set posisi kamera berdasarkan ukuran model
            const maxDim = Math.max(size.x, size.y, size.z);
            const distance = maxDim * 2;

            camera.position.set(distance, distance / 2, distance);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
            camera.updateProjectionMatrix();

            // Reset controls untuk melihat model
            controls.target.set(0, 0, 0);
            controls.update();
          },
          // Progress callback
          null,
          // Error callback
          // @ts-expect-error
          (error) => {
            console.error("Error loading model:", error);
            setLoadError(`Failed to load model: ${error.message}`);
          }
        );
      }
    } catch (err) {
      console.error("Failed to load model:", err);
      setLoadError(
        `Failed to load model: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }

    // Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      // Dispose semua objek Three.js
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [modelUrl, isFullscreen]);

  return (
    <div className="relative w-full h-full bg-transparent">
      <div
        ref={containerRef}
        className="w-full h-full bg-transparent"
        style={{ background: "transparent" }}
      ></div>

      {/* Tampilkan loading error jika ada */}
      {loadError && (
        <div className="absolute top-0 left-0 right-0 m-2 p-2 bg-red-500 text-white text-xs rounded opacity-80">
          {loadError}
        </div>
      )}
    </div>
  );
};

export default BasicThreeViewer;
