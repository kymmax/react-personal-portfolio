// React
import { useEffect } from "react";


const useMousePosition = (ref, action) => {

    useEffect(()=> {

        if(!ref?.current) return;

        const getMouseEvent = (e) => {
            const px = e.clientX - (window.innerWidth / 2);
            const py = e.clientY - (window.innerHeight / 2);

            action({x: px, y: py, ref: ref});
        }
        window.addEventListener("mousemove",getMouseEvent);
  
        return () => window.removeEventListener("mousemove",getMouseEvent)
        
    },[ref.current])
}

export default useMousePosition;