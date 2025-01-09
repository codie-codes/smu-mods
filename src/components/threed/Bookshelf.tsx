import type { ThreeEvent } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Define the GLTF type for the bookshelf
type GLTFResult = GLTF & {
  nodes: {
    Cube011: THREE.Mesh;
    Cube011_1: THREE.Mesh;
    Cube011_2: THREE.Mesh;
    Cube011_3: THREE.Mesh;
    Cube011_4: THREE.Mesh;
    Cube011_5: THREE.Mesh;
    Cube011_6: THREE.Mesh;
  };
  materials: {
    table: THREE.MeshStandardMaterial;
    book2: THREE.MeshStandardMaterial;
    book3: THREE.MeshStandardMaterial;
    book1: THREE.MeshStandardMaterial;
    ["book1.001"]: THREE.MeshStandardMaterial;
    ["book2.001"]: THREE.MeshStandardMaterial;
    ["book3.001"]: THREE.MeshStandardMaterial;
  };
  animations: THREE.AnimationClip[];
};

export function Bookshelf(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/room/Bookshelf.glb") as GLTFResult;
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

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
              ? new THREE.Color(0x964b00) // Brown when hovered
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

  // Handle click event
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setClicked(true);
    router.push("/modules");
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
        <Html position={[-2.1, 2.4, -2.857]}>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              pointerEvents: "none",
              height: "40px",
              width: "240px",
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            Explore Modules Here!
          </div>
        </Html>
      )}
      <group
        position={[-1.259, 3.12, -2.857]}
        rotation={[Math.PI, -Math.PI / 2, 0]}
        scale={[-0.339, -0.604, -1.885]}
      >
        <mesh geometry={nodes.Cube011.geometry} material={materials.table} />
        <mesh geometry={nodes.Cube011_1.geometry} material={materials.book2} />
        <mesh geometry={nodes.Cube011_2.geometry} material={materials.book3} />
        <mesh geometry={nodes.Cube011_3.geometry} material={materials.book1} />
        <mesh
          geometry={nodes.Cube011_4.geometry}
          material={materials["book1.001"]}
        />
        <mesh
          geometry={nodes.Cube011_5.geometry}
          material={materials["book2.001"]}
        />
        <mesh
          geometry={nodes.Cube011_6.geometry}
          material={materials["book3.001"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/room/Bookshelf.glb");
