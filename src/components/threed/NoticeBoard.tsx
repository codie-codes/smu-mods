/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 NoticeBoard.glb -t 
*/
import type { ThreeEvent } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Define the GLTF type for the noticeboard
type GLTFResult = GLTF & {
  nodes: {
    Cube032: THREE.Mesh;
    Cube032_1: THREE.Mesh;
    Poster1: THREE.Mesh;
    Poster2: THREE.Mesh;
    Poster3: THREE.Mesh;
    Poster4: THREE.Mesh;
  };
  materials: {
    ["Material.012"]: THREE.MeshStandardMaterial;
    ["Material.013"]: THREE.MeshStandardMaterial;
  };
  animations: THREE.AnimationClip[];
};

export function NoticeBoard(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/room/NoticeBoard.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  // Load textures for posters
  const poster1Texture = useLoader(
    THREE.TextureLoader,
    "/textures/poster1.jpg",
  );
  const poster2Texture = useLoader(
    THREE.TextureLoader,
    "/textures/poster2.jpg",
  );
  const poster3Texture = useLoader(
    THREE.TextureLoader,
    "/textures/poster3.jpg",
  );
  const poster4Texture = useLoader(
    THREE.TextureLoader,
    "/textures/poster4.jpg",
  );
  poster1Texture.flipY = false;
  poster2Texture.flipY = false;
  poster3Texture.flipY = false;
  poster4Texture.flipY = false;

  // Set up frame loop to update hover, click effect, and pulsing effect
  // Set up frame loop to update hover, click effect, and pulsing effect
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).material && (child as THREE.Mesh).isMesh) {
          const material = (child as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;

          // Apply different emissive colors for clicked, hovered, or idle states
          material.emissive = clicked
            ? new THREE.Color(0x00ff00) // Green when clicked
            : hovered
              ? new THREE.Color(0x9575cd) // Purple when hovered
              : new THREE.Color(0x444444); // Subtle gray when not hovered or clicked

          // Adjust the pulse intensity only when not hovered or clicked
          if (!hovered && !clicked) {
            const elapsedTime = state.clock.getElapsedTime();

            // Control the speed and intensity of the pulse
            const pulseFrequency = 2; // Higher number increases the pulse speed
            const baseIntensity = 0.55; // Base intensity to avoid too dim
            const pulseAmplitude = 0.35; // How much the pulse should vary
            const pulseIntensity =
              Math.sin(elapsedTime * pulseFrequency) * pulseAmplitude +
              baseIntensity;

            // Clamp the intensity to avoid very high or low values
            material.emissiveIntensity = THREE.MathUtils.clamp(
              pulseIntensity,
              0.1,
              1.0,
            );
          } else {
            // Set a default emissive intensity for hovered or clicked states
            material.emissiveIntensity = 1.0;
          }
        }
      });
    }
  });

  // Handle pointer over event to set hovered state
  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
  };

  // Handle pointer out event to unset hovered state
  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
  };

  // Handle click event to navigate to the appropriate page
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);
    router.push("/bid-analytics");
  };

  return (
    <group
      ref={groupRef}
      {...props}
      dispose={null}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerUp={handleClick}
    >
      {hovered && (
        <Html position={[1.3, 1.35, -3.166]}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              pointerEvents: "none",
              height: "70px",
              width: "200px",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            View Bid Analysis Here!
          </div>
        </Html>
      )}
      <group position={[1.884, 2.44, -3.166]} scale={[0.9, 0.9, 0.03]}>
        <mesh
          geometry={nodes.Cube032.geometry}
          material={materials["Material.012"]}
        />
        <mesh
          geometry={nodes.Cube032_1.geometry}
          material={materials["Material.013"]}
        />
      </group>
      <mesh
        geometry={nodes.Poster1.geometry}
        position={[1.297, 2.974, -3.089]}
        rotation={[Math.PI / 2, -0.087, 0]}
        scale={[0.2, 1, 0.283]}
      >
        <meshStandardMaterial map={poster1Texture} />
      </mesh>
      <mesh
        geometry={nodes.Poster2.geometry}
        position={[1.744, 2.974, -3.089]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.2, 1, 0.283]}
      >
        <meshStandardMaterial map={poster2Texture} />
      </mesh>
      <mesh
        geometry={nodes.Poster3.geometry}
        position={[2.185, 2.974, -3.089]}
        rotation={[Math.PI / 2, 0.087, 0]}
        scale={[0.2, 1, 0.283]}
      >
        <meshStandardMaterial map={poster3Texture} />
      </mesh>
      <mesh
        geometry={nodes.Poster4.geometry}
        position={[1.302, 2.362, -3.089]}
        rotation={[Math.PI / 2, 0.087, 0]}
        scale={[0.2, 1, 0.283]}
      >
        <meshStandardMaterial map={poster4Texture} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/room/NoticeBoard.glb");
