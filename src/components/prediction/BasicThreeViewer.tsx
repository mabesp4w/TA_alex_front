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
  isActive?: boolean; // Tambahan prop untuk kontrol rendering
}

// Menyimpan single shared renderer untuk mengurangi WebGL contexts
let sharedRenderer: THREE.WebGLRenderer | null = null;

const BasicThreeViewer: React.FC<BasicThreeViewerProps> = ({
  modelUrl,
  isFullscreen = false,
  isActive = true, // Default active
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mountedRef = useRef<boolean>(false);

  const [loadError, setLoadError] = useState<string | null>(null);

  // Fungsi untuk membersihkan resources
  const cleanupResources = () => {
    // Cancel animation frame jika ada
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Dispose semua Three.js objects
    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => {
                if (material.map) material.map.dispose();
                material.dispose();
              });
            } else {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        }
      });
    }

    // Dispose controls jika ada
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = null;
    }

    // We don't dispose renderer here to reuse it
  };

  // Setup Three.js hanya jika isActive true
  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    mountedRef.current = true;
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = null;

    try {
      // Setup camera
      cameraRef.current = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      cameraRef.current.position.set(0, 0, 5);

      // Setup or reuse renderer
      if (!sharedRenderer) {
        try {
          sharedRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
          });
          // Reduce memory usage
          sharedRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          // @ts-expect-error
          sharedRenderer.outputEncoding = THREE.sRGBEncoding;
          sharedRenderer.setClearColor(0x000000, 0);
          sharedRenderer.shadowMap.enabled = false;
        } catch (err) {
          console.error("Failed to create WebGL renderer:", err);
          setLoadError("Failed to initialize 3D renderer");
          return;
        }
      }

      rendererRef.current = sharedRenderer;
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );

      // Clear container and append renderer
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(rendererRef.current.domElement);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      sceneRef.current.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(1, 1, 1);
      sceneRef.current.add(directionalLight);

      // Setup controls if camera and renderer are available
      if (cameraRef.current && rendererRef.current) {
        controlsRef.current = new OrbitControls(
          cameraRef.current,
          rendererRef.current.domElement
        );
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.05;
        controlsRef.current.minDistance = 1;
        controlsRef.current.maxDistance = 20;
      }

      // Load 3D model
      if (modelUrl) {
        const loader = new GLTFLoader();
        loader.load(
          modelUrl,
          // @ts-expect-error
          (gltf) => {
            if (!mountedRef.current || !sceneRef.current) return;

            const model = gltf.scene;

            // Optimize model
            model.traverse((child: any) => {
              if (child instanceof THREE.Mesh) {
                child.castShadow = false;
                child.receiveShadow = false;

                // Memory optimization for materials
                if (child.material) {
                  if (Array.isArray(child.material)) {
                    child.material.forEach((mat) => {
                      mat.transparent = true;
                      mat.side = THREE.DoubleSide;
                      // Reduce memory usage for textures
                      if (mat.map) {
                        mat.map.anisotropy = 1;
                      }
                    });
                  } else {
                    child.material.transparent = true;
                    child.material.side = THREE.DoubleSide;
                    if (child.material.map) {
                      child.material.map.anisotropy = 1;
                    }
                  }
                }
              }
            });

            sceneRef.current.add(model);

            // Auto center and scale
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;

            // Set camera position based on model size
            if (cameraRef.current && controlsRef.current) {
              const maxDim = Math.max(size.x, size.y, size.z);
              const distance = maxDim * 1;

              cameraRef.current.position.set(distance, distance / 2, distance);
              cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
              cameraRef.current.updateProjectionMatrix();

              controlsRef.current.target.set(0, 0, 0);
              controlsRef.current.update();
            }
          },
          null,
          // @ts-expect-error
          (error) => {
            console.error("Error loading model:", error);
            setLoadError(`Failed to load model: ${error.message}`);
          }
        );
      }

      // Animation loop
      const animate = () => {
        if (!mountedRef.current) return;

        animationFrameRef.current = requestAnimationFrame(animate);

        if (controlsRef.current) {
          controlsRef.current.update();
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };

      animate();

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current)
          return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      };

      window.addEventListener("resize", handleResize);

      // Cleanup function
      return () => {
        mountedRef.current = false;
        window.removeEventListener("resize", handleResize);

        // Clean all resources
        cleanupResources();

        // Remove element from container
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      };
    } catch (err) {
      console.error("Error in Three.js setup:", err);
      setLoadError(
        `3D viewer error: ${err instanceof Error ? err.message : String(err)}`
      );
      return () => {
        mountedRef.current = false;
      };
    }
  }, [modelUrl, isActive, isFullscreen]);

  // Special effect when isActive changes
  useEffect(() => {
    // If becoming inactive but was previously active
    if (!isActive && mountedRef.current) {
      cleanupResources();

      // Remove content but keep the reference to the DOM element
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    }
  }, [isActive]);

  return (
    <div className="relative w-full h-full bg-transparent">
      <div
        ref={containerRef}
        className="w-full h-full bg-transparent"
        style={{ background: "transparent" }}
      ></div>

      {/* Error display */}
      {loadError && (
        <div className="absolute top-0 left-0 right-0 m-2 p-2 bg-red-500 text-white text-xs rounded opacity-80">
          {loadError}
        </div>
      )}
    </div>
  );
};

export default BasicThreeViewer;
