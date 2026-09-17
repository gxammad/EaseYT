import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const BubbleModel = () => {
  const { scene } = useGLTF("/models/bubble.glb"); // Load Model

  return (
    <Canvas style={{ height: "100vh" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <primitive object={scene} scale={1.5} />
      <OrbitControls />
    </Canvas>
  );
};

export default BubbleModel;
