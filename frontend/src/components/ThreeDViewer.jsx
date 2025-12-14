import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Grid, Environment, ContactShadows, PerspectiveCamera, Html, useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Simple ErrorBoundary for individual components
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("3D Object failed to load:", error);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// Re-define FurniturePlaceholder for fallback use
const FurniturePlaceholder = ({ position, size, color, name }) => {
    return (
        <group position={position}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={size} />
                <meshStandardMaterial color={color} />
            </mesh>
            <Html position={[0, size[1] / 2 + 0.2, 0]} center transform sprite>
                <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px' }}>
                    {name}
                </div>
            </Html>
        </group>
    )
}

const FeatureWall = ({ width, height, depth, color, imageUrl }) => {
    // Load texture if imageUrl is provided
    const texture = useLoader(THREE.TextureLoader, imageUrl ? imageUrl : 'https://placehold.co/1024x1024/png?text=No+Texture');

    return (
        <mesh position={[0, height / 2, -depth / 2]} receiveShadow castShadow>
            <boxGeometry args={[width, height, 0.2]} />
            <meshStandardMaterial
                color={imageUrl ? 'white' : color}
                map={imageUrl ? texture : null}
            />
        </mesh>
    );
};

const Room = ({ width = 10, depth = 10, height = 3, color = '#f0f0f0', designImageUrl }) => {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                <planeGeometry args={[width, depth]} />
                <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
            </mesh>
            <gridHelper args={[Math.max(width, depth), Math.max(width, depth)]} position={[0, 0.01, 0]} />

            {/* Back Wall (Feature Wall) */}
            <Suspense fallback={
                <mesh position={[0, height / 2, -depth / 2]}>
                    <boxGeometry args={[width, height, 0.2]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            }>
                {designImageUrl ? (
                    <FeatureWall width={width} height={height} depth={depth} color={color} imageUrl={designImageUrl} />
                ) : (
                    <mesh position={[0, height / 2, -depth / 2]} receiveShadow castShadow>
                        <boxGeometry args={[width, height, 0.2]} />
                        <meshStandardMaterial color={color} />
                    </mesh>
                )}
            </Suspense>

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
        </group>
    );
};

const FurnitureModel = ({ url, position, rotation = [0, 0, 0], scale = [1, 1, 1], name, color }) => {
    const { scene } = useGLTF(url, true, true, (loader) => {
        // Handle loading errors or fallback if needed
    })

    // Clone scene to allow multiple instances with independent properties
    const clonedScene = useMemo(() => scene.clone(), [scene])

    return (
        <group position={position} rotation={rotation} scale={scale}>
            <primitive object={clonedScene} castShadow receiveShadow />
            <Html position={[0, 1, 0]} center transform sprite>
                <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px' }}>
                    {name}
                </div>
            </Html>
        </group>
    )
}

// Preload models to avoid pop-in
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf')
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table-wood/model.gltf')

const ThreeDViewer = ({ designData }) => {
    // 1. Dynamic Parsing of Dimensions
    const dimensions = useMemo(() => {
        let width = 10, depth = 10;
        if (designData?.project_details) {
            // Try to find "12x15" or "12 by 15" patterns
            const dimMatch = designData.project_details.match(/(\d+)(?:\s*[xX*]\s*|\s+by\s+)(\d+)/);
            if (dimMatch) {
                width = parseFloat(dimMatch[1]);
                depth = parseFloat(dimMatch[2]);
            } else {
                // Fallback: Estimate from area
                const area = designData.area || 50;
                const side = Math.sqrt(area);
                width = side;
                depth = side;
            }
        }
        // Clamp for visualization sanity
        return {
            width: Math.min(Math.max(width, 5), 30),
            depth: Math.min(Math.max(depth, 5), 30)
        };
    }, [designData]);

    const roomColor = designData?.color_scheme?.includes('gold') ? '#f5e6cc' :
        designData?.color_scheme?.includes('dark') ? '#333333' : '#f5f5f5';

    // 2. Dynamic Furniture Layout (Procedural)
    const furniture = useMemo(() => {
        const items = [];
        const { width, depth } = dimensions;

        // Sofa centered
        items.push({
            url: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf',
            pos: [0, 0, -depth / 2 + 3],
            scale: [1.5, 1.5, 1.5], // Scale adjustment for visual fit
            rotation: [0, Math.PI, 0], // Face forward
            name: 'Luxury Sofa'
        });

        // Table in front
        items.push({
            url: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table-wood/model.gltf',
            pos: [0, 0, -depth / 2 + 5],
            scale: [1, 1, 1],
            name: 'Coffee Table'
        });

        return items;
    }, [dimensions]);

    return (
        <div style={{ width: '100%', height: '600px', borderRadius: '12px', overflow: 'hidden', background: '#111', position: 'relative' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[dimensions.width, dimensions.width * 0.8, dimensions.width]} fov={50} />

                <Suspense fallback={<Html center>Loading 3D Assets...</Html>}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                    <Environment preset="apartment" background={false} blur={0.8} />

                    <Stage intensity={0.5} environment="apartment" adjustCamera={false}>
                        <Room
                            width={dimensions.width}
                            depth={dimensions.depth}
                            height={4}
                            color={roomColor}
                            designImageUrl={designData?.image_url}
                        />
                        {furniture.map((item, idx) => (
                            <ErrorBoundary key={idx} fallback={<FurniturePlaceholder position={item.pos} size={[2, 1, 1]} color="gray" name={item.name + " (Fallback)"} />}>
                                <FurnitureModel
                                    url={item.url}
                                    position={item.pos}
                                    rotation={item.rotation}
                                    scale={item.scale}
                                    name={item.name}
                                />
                            </ErrorBoundary>
                        ))}
                    </Stage>
                    <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={50} blur={2} far={4.5} />
                </Suspense>

                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            <div style={{ position: 'absolute', top: '20px', left: '20px', color: 'white', background: 'rgba(0,0,0,0.6)', padding: '10px', borderRadius: '8px', pointerEvents: 'none' }}>
                <h4 style={{ margin: 0 }}>Digital Twin (Live)</h4>
                <p style={{ margin: '5px 0 0', fontSize: '12px', opacity: 0.8 }}>
                    {Math.round(dimensions.width)}m x {Math.round(dimensions.depth)}m • {designData?.style || 'Modern'} Style
                </p>
                {designData?.image_url && (
                    <div style={{ marginTop: '5px', fontSize: '10px', color: '#4CAF50' }}>
                        ✓ Texture Projected from AI
                    </div>
                )}
            </div>

            <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'white', fontSize: '12px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px' }}>
                Interactive Preview • Drag to Explore
            </div>
        </div>
    );
};

export default ThreeDViewer;
