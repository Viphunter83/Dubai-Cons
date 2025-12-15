import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';

function FloatingGeometry({ position, color, speed, rotationSpeed, scale }) {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * rotationSpeed;
        meshRef.current.rotation.y = time * rotationSpeed * 0.5;
        meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.2;
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={2}
                />
            </mesh>
        </Float>
    );
}

function GlassPrism({ position, rotation, scale }) {
    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={position} rotation={rotation} scale={scale}>
                <boxGeometry args={[1, 2, 1]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transmission={0.95}
                    opacity={0.5}
                    metalness={0.2}
                    roughness={0}
                    ior={1.5}
                    thickness={2}
                    transparent
                />
            </mesh>
        </Float>
    );
}

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                <Environment preset="city" />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#f4d03f" />
                <pointLight position={[-10, -5, -10]} intensity={1} color="#00f2ea" />
                <spotLight position={[0, 5, 0]} intensity={5} distance={10} angle={0.5} penumbra={1} />

                {/* Golden Elements */}
                <FloatingGeometry position={[3, 1, 0]} color="#d4af37" speed={1.2} rotationSpeed={0.3} scale={0.8} />
                <FloatingGeometry position={[-4, -2, -2]} color="#b48f17" speed={0.8} rotationSpeed={0.2} scale={1.2} />
                <FloatingGeometry position={[5, -3, -5]} color="#f4d03f" speed={1.5} rotationSpeed={0.4} scale={0.5} />

                {/* Glass Elements representing modern structures */}
                <GlassPrism position={[-2, 2, -3]} rotation={[0.4, 0.2, 0]} scale={1.5} />
                <GlassPrism position={[4, -1, -4]} rotation={[0.2, 0.5, 0.2]} scale={2} />
            </Canvas>
        </div>
    );
}
