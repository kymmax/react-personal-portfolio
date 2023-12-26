// Plugin GSAP
import { gsap } from "gsap";

const setProgressBtn = (planeCurrent, dataLength, time) => {

    const target = document.getElementById('progress-range');
    
    var percent = (planeCurrent / (dataLength - 1)) * 100;	
    if(percent >= 100) percent = 100;	

    gsap.to(target, time || 1, {
        value: planeCurrent,
    })
}

export default setProgressBtn;