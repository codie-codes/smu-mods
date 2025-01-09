"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

import Banner from "@/components/Banner";
import Fallback from "@/components/Fallback";
import NavigationPopup from "@/components/MobilePopUp";
import { Bookshelf } from "@/components/threed/Bookshelf";
import { Calendar } from "@/components/threed/Calendar";
import { Monitor } from "@/components/threed/Monitor";
import { NoticeBoard } from "@/components/threed/NoticeBoard";
import { Rooms } from "@/components/threed/rooms";
import { APP_CONFIG } from "@/config";
import { useConfigStore } from "@/stores/config/provider";

function Lighting({ theme }: { theme: string }) {
  const { roomTheme } = useConfigStore((state) => state);
  const lightIntensity =
    theme === "light" ? 1.5 : roomTheme == "isaiah" ? 0.6 : 0.4;
  const directionalLightIntensity = theme === "light" ? 5.5 : 0.4;

  return (
    <>
      <ambientLight intensity={lightIntensity} />
      <directionalLight
        position={[-4, 3, -1]}
        intensity={directionalLightIntensity}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </>
  );
}
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

function Scene() {
  const { theme = "light" } = useTheme();
  const { roomTheme } = useConfigStore((state) => state);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const { camera } = useThree();
  const router = useRouter();

  const lookAtPoint = new THREE.Vector3(-0.8, 2.5, 0);
  const currentPosition = useRef(new THREE.Vector3(0, 2.8, 1.5));
  const rotationRadius = 2.5;
  const easeAmount = 0.05;
  const startAngle = Math.atan2(1.5 - lookAtPoint.z, 0 - lookAtPoint.x);

  const isMobile = isMobileDevice();

  useEffect(() => {
    if (cameraRef.current) {
      camera.position.copy(currentPosition.current);
      camera.lookAt(lookAtPoint);
    }
  }, [camera]);

  useFrame((state) => {
    const { pointer } = state;

    const PointerX = pointer.x;

    const rotationY = THREE.MathUtils.lerp(
      -Math.PI / 4,
      Math.PI / 3,
      (PointerX + 1) / 2,
    );

    const targetX =
      lookAtPoint.x + rotationRadius * Math.cos(startAngle + rotationY);
    const targetZ =
      lookAtPoint.z + rotationRadius * Math.sin(startAngle + rotationY);

    currentPosition.current.x +=
      (targetX - currentPosition.current.x) * easeAmount;
    currentPosition.current.z +=
      (targetZ - currentPosition.current.z) * easeAmount;
    currentPosition.current.y = 2.8;

    if (cameraRef.current) {
      cameraRef.current.position.copy(currentPosition.current);
      cameraRef.current.lookAt(lookAtPoint);
    }
  });

  if (!roomTheme || !Rooms[roomTheme]) {
    router.push(`/timetable/${APP_CONFIG.currentTerm}`);
    return null;
  }

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={70}
        near={0.1}
        far={100}
      />

      <OrbitControls
        target={lookAtPoint}
        enableDamping={!isMobile}
        dampingFactor={isMobile ? 0 : 0.25}
        rotateSpeed={isMobile ? 2 : 0.5}
        enableZoom={false}
        maxPolarAngle={isMobile ? Math.PI : Math.PI / 2}
        minPolarAngle={isMobile ? 0 : Math.PI / 2}
      />
      <Lighting theme={theme} />
      <Monitor />
      <Bookshelf />
      <Calendar />
      <NoticeBoard />
      {Rooms[roomTheme].room}
    </>
  );
}

export default function Home() {
  const { resolvedTheme } = useTheme();
  const canvasStyle =
    resolvedTheme === "light"
      ? { background: "white" }
      : { background: "black" };

  return (
    <div className="relative h-screen w-full">
      <Suspense fallback={<Fallback />}>
        <Banner />
        <NavigationPopup />
        <Canvas style={canvasStyle}>
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
