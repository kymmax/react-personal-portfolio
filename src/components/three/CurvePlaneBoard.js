// React
import { useEffect, useRef, useState } from "react";

// Plugin THREE.js
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

// Plugin GSAP
import { gsap } from "gsap";


const CurvePlaneBoard = (props) => {

    const ref = useRef();
    const texture = useLoader(THREE.TextureLoader, props.url);

    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    // Hover Action
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


    // 微調模型內部的 position 
    useEffect(()=>{
      const widthHalf = props.width / 2;
    
      const positions = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = Math.sin(Math.PI/2 - (Math.abs(x) / widthHalf) * Math.PI/2) * 0.5; // 調整彎曲度
    
        positions[i + 2] = z;
      }
    
      ref.current.geometry.attributes.position.needsUpdate = true;
      
    },[])


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

            <planeGeometry args={[props.width, props.height, 32, 32]} />
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

export default CurvePlaneBoard;
