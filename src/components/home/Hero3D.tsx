import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial, Sphere, ContactShadows } from "@react-three/drei";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

const LiquidFabric = () => {
    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Sphere args={[1, 100, 200]} scale={2.2}>
                <MeshDistortMaterial
                    color="#0a0a0a" // Deep black/charcoal
                    attach="material"
                    distort={0.4} // The "Liquid" fabric effect
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8} // Metallic shine
                    bumpScale={0.01}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    radius={1}
                />
            </Sphere>
        </Float>
    );
};

const Scene = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <Environment preset="city" />

            {/* Dramatic Lighting */}
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 5]} angle={0.4} penumbra={1} intensity={15} color="#ffffff" />
            <pointLight position={[-10, -5, 5]} intensity={10} color="#49d77e" /> {/* Green rim light */}

            <LiquidFabric />

            <ContactShadows opacity={0.5} scale={10} blur={2.5} far={4} color="#000000" />
        </>
    );
};

const HeroOverlay = () => {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-4 mix-blend-difference text-white">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
            >
                {/* Big Clean Typography */}
                <h1 className="heading-display text-8xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter mb-6 text-white leading-none">
                    VERO
                </h1>
                <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-90 max-w-lg mx-auto font-medium">
                    Egypt Elegance <span className="mx-2 text-white/50">•</span> Est. 2026
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest opacity-60">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white animate-slide-down" />
                </div>
            </motion.div>
        </div>
    );
};

export const Hero3D = () => {
    return (
        <div className="relative w-full h-screen bg-[#050505] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Canvas gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping }}>
                    <React.Suspense fallback={null}>
                        <Scene />
                    </React.Suspense>
                </Canvas>
            </div>
            <HeroOverlay />
        </div>
    );
};
