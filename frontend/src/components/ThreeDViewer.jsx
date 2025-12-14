import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Grid, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';

const Room = ({ width = 10, depth = 10, height = 3, color = '#f0f0f0' }) => {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
            </mesh>

            {/* Floor Grid Pattern (Visual Aid) */}
            <gridHelper args={[Math.max(width, depth), Math.max(width, depth)]} position={[0, 0.01, 0]} />

            {/* Back Wall */}
            <mesh position={[0, height / 2, -depth / 2]} receiveShadow castShadow>
                <boxGeometry args={[width, height, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
                <boxGeometry args={[depth, height, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Right Wall */}
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow castShadow>
                <boxGeometry args={[depth, height, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Ceiling (Optional, usually open for top-down view) */}
        </group>
    );
};

const FurniturePlaceholder = ({ position, size, color, name }) => {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Label could go here via Html component if needed */}
        </group>
    )
}

const ThreeDViewer = ({ designData }) => {
    // Extract parameters from designData
    // Try to parse area to visual dimensions. Sqrt(area) -> side length.
    const area = designData?.area || 50; // Default 50sqm
    const side = Math.sqrt(area);
    const roomWidth = Math.min(Math.max(side, 5), 20); // Clamp between 5m and 20m
    const roomDepth = roomWidth; // Square room for now

    const roomColor = designData?.color_scheme?.includes('gold') ? '#f5e6cc' :
        designData?.color_scheme?.includes('dark') ? '#333333' : '#f5f5f5';

    // Simple layout generation based on style
    const furniture = useMemo(() => {
        // Just random layout logic for demo
        return [
            { pos: [0, 0.5, -roomDepth / 2 + 2], size: [2, 1, 1], color: '#555', name: 'Sofa' },
            { pos: [roomWidth / 2 - 1, 0.75, 0], size: [1, 1.5, 3], color: '#664', name: 'Cabinet' },
            { pos: [-roomWidth / 4, 0.4, 0], size: [1.5, 0.8, 1.5], color: '#444', name: 'Table' },
        ];
    }, [roomWidth, roomDepth]);

    return (
        <div style={{ width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden', background: '#111', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[roomWidth, roomWidth, roomWidth]} fov={50} />

                <Suspense fallback={null}>
                    {/* Lighting & Environment */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={[2048, 2048]} castShadow />
                    <Environment preset="apartment" background={false} blur={0.8} />

                    <Stage intensity={0.5} environment="apartment" adjustCamera={false}>
                        <Room width={roomWidth} depth={roomDepth} height={3} color={roomColor} />

                        {furniture.map((item, idx) => (
                            <FurniturePlaceholder key={idx} position={item.pos} size={item.size} color={item.color} />
                        ))}
                    </Stage>

                    <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={roomWidth * 2} blur={2} far={4.5} />
                </Suspense>

                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', background: 'rgba(0,0,0,0.6)', padding: '10px', borderRadius: '8px', pointerEvents: 'none' }}>
                <h4 style={{ margin: 0 }}>3D Floor Plan</h4>
                <p style={{ margin: '5px 0 0', fontSize: '12px', opacity: 0.8 }}>
                    {Math.round(roomWidth)}m x {Math.round(roomDepth)}m • {designData?.style || 'Modern'} Style
                </p>
            </div>

            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'white', fontSize: '12px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px' }}>
                Interactive Preview • Use Mouse to Rotate/Zoom
            </div>
        </div>
    );
};

export default ThreeDViewer;
