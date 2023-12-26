// React
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";

// Plugin THREE.js
import * as THREE from "three";


const BgSphere = (props) => {
    const ref = useRef();
    const texture = useLoader(THREE.TextureLoader, './assets/resource/scene.jpg');

    useFrame((state, delta) => {
        ref.current.rotation.y += .001;
    })

    return (
        <mesh
            {...props}
            ref={ref}
        >
            <sphereGeometry args={[32, 30, 30]} />
            <meshBasicMaterial 
                map={texture}
                transparent={true}
                opacity={1}
                color={props.color || 'white'} 
                depthWrite={false}
                side={THREE.BackSide}
            />

            {props.children}
        </mesh>
    )
}

export default BgSphere;