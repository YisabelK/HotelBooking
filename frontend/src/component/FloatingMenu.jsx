import React, { useState } from "react";
import "./floatingMenu.css";
import EmailIcon from "@mui/icons-material/Email";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { Float, ContactShadows, Environment } from "@react-three/drei";

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null);

  const toggleMenu = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    toggleMenu();
  };

  const handleContactClick = () => {
    window.location.href = "/contact";
    toggleMenu();
  };

  return (
    <div className={`floating-menu ${isOpen ? "open" : ""}`}>
      <audio ref={audioRef} src="/assets/mp3/pop.mp3" preload="auto" />
      <div className="menu-toggle" onClick={toggleMenu}>
        <Canvas
          className="menu-canvas"
          shadows
          gl={{ antialias: true }}
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6], fov: 50 }}
        >
          <Float speed={3} rotationIntensity={2} floatIntensity={3}>
            <mesh geometry={new THREE.DodecahedronGeometry(1.5)}>
              <meshStandardMaterial
                color="#ff0000"
                emissive="#ff0000"
                emissiveIntensity={0.2}
                roughness={0.3}
                metalness={0.5}
              />
            </mesh>
          </Float>
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={5}
            blur={1}
          />
          <Environment preset="studio" />
        </Canvas>
      </div>
      <div className="menu-items">
        <button onClick={handleContactClick} title="Contact Me">
          <EmailIcon />
        </button>
        <button onClick={scrollToTop} title="Scroll to Top">
          <KeyboardArrowUpIcon />
        </button>
      </div>
    </div>
  );
};

export default FloatingMenu;
