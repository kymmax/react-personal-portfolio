// React
import { useEffect, useRef, useState } from "react";

// Plugin THREE.js
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Plugin GSAP
import { gsap } from "gsap";


const PlaneBoard = (props) => {

    const ref = useRef();
    const texture = useLoader(THREE.TextureLoader, props.url);

    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    useEffect(() => {
        gsap.to(ref.current.scale, {
            x: hovered ? 1.2 : 1,
            y: hovered ? 1.2 : 1,
            z: hovered ? 1.2 : 1,
            duration: .5,
        })

        // cursor & text change
        let cursor = document.getElementById('cursor-mouse');
            cursor?.classList[hovered ? "add" : "remove"]("active");
        document.body.style.setProperty('--before-content', hovered ? '"CLICK"' : '"');
    }, [hovered]);


    return (
        <mesh
            {...props}
            ref={ref}
            // position={[0,0,20]}
            // onClick={(event) => click(!clicked)}
            onPointerOver={(event) => {
                event.stopPropagation();
                hover(true);
            }}
            onPointerOut={(event) => hover(false)}
        >

            <planeGeometry args={[8, 4.5]} />
            <meshStandardMaterial 
                map={texture}
                transparent={true}
                opacity={1}
                color={props.color || new THREE.Color(0xffffff)} 
                roughness={0}
                metalness={0}
                side={THREE.DoubleSide}
                // envMap={}
                envMapIntensity={1}
            />

            {props.children}
        </mesh>
    )
}

export default PlaneBoard;