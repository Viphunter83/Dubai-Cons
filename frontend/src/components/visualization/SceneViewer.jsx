import React, { Suspense, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, Grid, Html } from '@react-three/drei'
import * as THREE from 'three'

// Simple Box Component for Furniture
const Box = ({ position, scale, color, rotation = [0, 0, 0], name }) => {
    return (
        <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
            {name && (
                <Html position={[0, 1, 0]} center distanceFactor={10}>
                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-md whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity cursor-help pointer-events-auto">
                        {name}
                    </div>
                </Html>
            )}
        </mesh>
    )
}

// Plane Component for Walls/Floor
const Plane = ({ position, rotation, scale, color, name }) => {
    return (
        <mesh position={position} rotation={rotation} scale={scale} receiveShadow>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
    )
}

// Main Scene Content
const SceneContent = ({ sceneData }) => {
    const { camera } = useThree()

    useEffect(() => {
        // Initial camera position adjustment based on room size if needed
        if (sceneData?.dimensions) {
            // e.g. move camera back based on room depth
        }
    }, [sceneData])

    if (!sceneData || !sceneData.objects) return null

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
            />
            <Environment preset="apartment" />

            <group>
                {sceneData.objects.map((obj, index) => {
                    if (obj.type === 'box') {
                        return (
                            <Box
                                key={index}
                                position={obj.position}
                                scale={obj.scale}
                                rotation={obj.rotation.map(r => r * Math.PI / 180)} // Convert deg to rad
                                color={obj.color}
                                name={obj.name}
                            />
                        )
                    } else if (obj.type === 'plane') {
                        return (
                            <Plane
                                key={index}
                                position={obj.position}
                                scale={obj.scale}
                                rotation={obj.rotation.map(r => r * Math.PI / 180)}
                                color={obj.color}
                                name={obj.name}
                            />
                        )
                    }
                    return null
                })}
            </group>

            {/* Floor Grid for reference */}
            <Grid
                infiniteGrid
                fadeDistance={30}
                sectionColor="#4d4d4d"
                cellColor="#333333"
                position={[0, -0.01, 0]}
            />
        </>
    )
}

const SceneViewer = ({ sceneData, isLoading }) => {
    if (isLoading) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900 rounded-xl border border-white/10">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-400">Loading 3D Scene...</p>
                </div>
            </div>
        )
    }

    if (!sceneData) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900 rounded-xl border border-white/10">
                <p className="text-zinc-500">No 3D data available</p>
            </div>
        )
    }

    return (
        <div className="w-full h-[500px] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 relative shadow-2xl">
            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <h4 className="text-sm font-semibold text-gold uppercase tracking-wider">
                    Interactive 3D View
                </h4>
                <p className="text-xs text-zinc-400">Left Click: Rotate • Right Click: Pan • Scroll: Zoom</p>
            </div>

            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={2}
                    maxDistance={20}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Check floor only from above
                />
                <Suspense fallback={null}>
                    <SceneContent sceneData={sceneData} />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default SceneViewer
