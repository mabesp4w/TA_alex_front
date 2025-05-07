/** @format */
"use client";
import { useEffect, useRef, useState } from "react";

interface CameraProps {
  onFrame: (canvas: HTMLCanvasElement) => void;
  isCapturing: boolean;
  className?: string;
}

const Camera = ({ onFrame, isCapturing, className = "" }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>(
    []
  );

  // Get list of available cameras
  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setAvailableCameras(videoDevices);

      // Default to back camera if available
      const backCamera = videoDevices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
      );

      if (backCamera) {
        setActiveCameraId(backCamera.deviceId);
      } else if (videoDevices.length > 0) {
        setActiveCameraId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error enumerating devices:", err);
    }
  };

  // Initialize camera
  const initializeCamera = async (deviceId?: string) => {
    try {
      setCameraError(null);

      // Stop any previous stream
      if (streamRef.current) {
        stopCamera();
      }

      // Set up camera constraints with better mobile handling
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      let constraints: MediaStreamConstraints = {
        video: deviceId
          ? {
              deviceId: { exact: deviceId },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            }
          : {
              facingMode: isMobile ? "environment" : "user",
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
      };

      // iOS Safari requires special handling
      if (
        isMobile &&
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !deviceId
      ) {
        // For iOS, be less specific about resolution to improve compatibility
        constraints = {
          video: {
            facingMode: "environment",
          },
        };
      }

      console.log("Requesting camera access with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        // Fix untuk "play() request was interrupted by a new load request"
        try {
          // Pause terlebih dahulu sebelum mengganti srcObject
          if (videoRef.current.srcObject) {
            videoRef.current.pause();
          }

          // Tunggu sedikit sebelum mengganti srcObject
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Set srcObject baru
          videoRef.current.srcObject = stream;

          // Tunggu sedikit sebelum memanggil play()
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Panggil play() dengan try-catch terpisah
          try {
            await videoRef.current.play();
            console.log("Camera playing successfully");
          } catch (playError) {
            console.error("Error playing video:", playError);
            // Beberapa browser memerlukan interaksi pengguna untuk play
            if (isMobile) {
              setCameraError("Sentuh layar untuk mengaktifkan kamera");
            }
          }
        } catch (videoError) {
          console.error("Error setting up video:", videoError);
        }

        streamRef.current = stream;

        // Get actual camera ID that was used
        const tracks = stream.getVideoTracks();
        if (tracks.length > 0) {
          setActiveCameraId(tracks[0].getSettings().deviceId || null);
          console.log("Active track settings:", tracks[0].getSettings());
        }
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError(
        "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin kamera pada browser."
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Switch camera
  const switchCamera = async () => {
    if (availableCameras.length <= 1) return;

    const currentIndex = availableCameras.findIndex(
      (camera) => camera.deviceId === activeCameraId
    );

    const nextIndex = (currentIndex + 1) % availableCameras.length;
    const nextCamera = availableCameras[nextIndex];

    await initializeCamera(nextCamera.deviceId);
  };

  // Capture frames when isCapturing is true
  useEffect(() => {
    if (isCapturing) {
      // Clear any existing interval
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }

      // Set up interval for capturing frames
      captureIntervalRef.current = setInterval(() => {
        captureFrame();
      }, 500);

      // Capture initial frame
      captureFrame();
    } else {
      // Clear interval when not capturing
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
        captureIntervalRef.current = null;
      }
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [isCapturing]);

  // Capture current frame and send to parent
  const captureFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) {
      return; // Skip if video not ready
    }

    try {
      // Capture current frame from video
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = videoRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Send frame to parent component
      onFrame(canvas);
    } catch (error) {
      console.error("Error capturing frame:", error);
    }
  };

  // Initialize camera and get available cameras on component mount
  useEffect(() => {
    // Fix for some mobile browsers: ensure properly sized container first
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    let isMounted = true;

    // Delay camera initialization slightly to avoid interruption errors
    setTimeout(() => {
      if (isMounted) {
        getAvailableCameras().then(() => {
          if (isMounted) {
            initializeCamera();
          }
        });
      }
    }, 300);

    // Cleanup on unmount
    return () => {
      isMounted = false;
      stopCamera();
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      document.documentElement.style.height = "";
      document.body.style.height = "";
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      {cameraError ? (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700 mb-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <p>{cameraError}</p>
          <button
            onClick={() => initializeCamera()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg text-sm"
          >
            Coba Lagi
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute min-w-full min-h-full object-cover left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${className}`}
            style={{ maxHeight: "100vh" }}
          />

          {/* Tombol switch kamera dipindahkan ke kiri atas untuk menghindari tumpang tindih dengan UI lain */}
          {availableCameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
              aria-label="Switch Camera"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 14a5 5 0 0 0 0-4"></path>
                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
                <path d="m10 14-3-3 3-3"></path>
              </svg>
            </button>
          )}

          {/* Tambahkan area sentuh untuk mengatasi masalah play() pada iOS */}
          <div
            className="absolute inset-0 z-5 cursor-pointer"
            onClick={() => {
              if (videoRef.current && videoRef.current.paused) {
                videoRef.current
                  .play()
                  .catch((e) => console.log("Play attempt:", e));
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Camera;
