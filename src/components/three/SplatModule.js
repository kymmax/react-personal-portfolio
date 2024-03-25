import { useRef, forwardRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Splat } from "../three/splat/index.jsx";
// Plugin GSAP
import { gsap } from "gsap";


export default forwardRef(function SplatModule({ enable },ref) {
  const { roughness, transmission, rotation, showOriginal, color } =
    //useControls ()
    {
      roughness: { value: 0.05, min: 0, max: 1 },
      transmission: { value: 1, min: 0, max: 1 },
      rotation: { value: 1.4 * Math.PI, min: 0, max: 2 * Math.PI },
      showOriginal: { value: false },
      color: { value: "#fff" },
    };
  // const ref = useRef();
  const ref0= useRef();

  useFrame((state) => {
    // ref.current.material.uniforms.customAlpha = {value: ani+=0.005}
    // ref.current.material.uniforms.customAlpha = {value: enable ? 1 : 0}

    // console.log(ref.current.material.uniforms.customAlpha.value);
    
  });

  useEffect(()=> {
    
    if(enable) ref.current.material.uniforms.customAlpha = {value: 0};
    console.log("======", ref.current.material.uniforms.customAlpha.value);

    gsap.to(ref.current.material.uniforms.customAlpha, {
        value: enable ? 1 : 0,
        duration: enable ? 2 : 1,
        ease: "power1.inOut",
        onComplete: function(){

        }
    })

  },[ref, enable])

  console.log("RENDER");
  
  

  return (
    <>
      <group ref={ref0}>
        <Splat
          ref={ref}
          scale={6}
          rotation={[0.05*Math.PI, 0, 0]}
          position={[0, 0, 0]}
          // https://www.youtube.com/watch?v=W7G7HqWbgdo
          src='../../assets/resource/Jason.min.splat'
        />
      </group>
    </>
  );
})
