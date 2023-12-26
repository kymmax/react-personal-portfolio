// React
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// Plugin GSAP
import { gsap } from "gsap";


const FogCustom = () => {
    const [color, setColor] = useState(0);
    const light = useSelector((state) => state.three.light);

    // change Fog color
    useEffect(() => {
        
        let value = {
            number: light ? 0 : 255
        }
        gsap.to(value, {
            duration: 1,
            number: light ? 255 : 0,
            onUpdate: function () {
                setColor(Math.round(value.number))
            }
        });
        
    },[light])    
    
    return <fog attach="fog" args={[`rgb(${color},${color},${color})`, 10, window.innerWidth < 500 ? 100 : 75]} />
}

export default FogCustom;