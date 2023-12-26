// React
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

// Plugin GSAP
import { gsap } from 'gsap';

// Utils
import setProgressBtn from '../utils/setProgressBtn';

// Slice 
import { setStatus, setMapState, setPlaneCurrent, setLightState } from '../slice/threeSlice';

// Assets
import imgLogo from './../assets/resource/logo.png';
import helixPara from '../assets/data/helixPara';


const Nav = ({handleHelixRotate}) => {

    const navigate = useNavigate();
    // 
    const refMap = useRef();
    const refLight = useRef();
    const refUtility = useRef();
    const refPerson = useRef();
    const refLogo = useRef();
    const refCopyright = useRef();
    const refDate = useRef();
    const refProgress = useRef();
    const refProgressBlock = useRef();
    // 
    const dispatch = useDispatch();
    const data = useSelector((state) => state.data.data);
    const dataLength = useSelector((state) => state.data.length);
    // const planeCurrent = useSelector((state) => state.three.planeCurrent);
    const three = useSelector((state) => state.three);    
    // 
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    // 
    const light = searchParams.get("light");
    // 
    const [firstView, setFirstView] = useState(false);
    const [timeOutNav, setTimeOutNav] = useState(null);

    const handleMapView = (e) => {
        if( !["INDEX","MAP"].includes(three.status) ) return;

        GA('click','nav-map');
        
        let trigger = (refMap.current.className.includes("off"));

        dispatch(setStatus(trigger ? "INDEX-TO-MAP" : "MAP-TO-INDEX"));

        dispatch(setMapState(trigger));
    }

    const handlePersonalView = useCallback(() => {

        GA('click','nav-hamburger');

        let el = refPerson.current;
        let trigger = (el.className.includes("active-hamburger"));  

        if (timeOutNav) {
            clearTimeout(timeOutNav);
        }

        if(trigger){
            dispatch(setStatus("INDEX"));
            el.classList.remove("active-hamburger");

            setTimeOutNav(setTimeout(() => {
                navigate("/");        
            }, 1000))

        }
        else{
            el.classList.add("active-hamburger");

            setFirstView(true);
            dispatch(setStatus("TRANSITION"));
                
            navigate("/personal");
            dispatch(setStatus("PERSONAL"));
        }    
        
    },[timeOutNav])

    const handleLogoView = useCallback(() => {
        GA('click','nav-logo');

        dispatch(setStatus("HOME"));
        dispatch(setMapState(false));
        refMap.current.className = `icon-map-off`;
        refPerson.current.classList.remove("active-hamburger");

        navigate("/");
    },[])

    const handleDateView = (e) => {

        const currentPlane = e.target.getAttribute('data-current');

        dispatch(setStatus("DATE=" + currentPlane));
        dispatch(setMapState(false));
    }

    const handleActiveClassToRefs = (state, ...refs) => {
        refs.forEach((ref) => {
            if (ref.current) {
                ref.current.classList[state]("active");
            }
        });
    };

    const handleLightView = (e) => {
        GA('click','nav-light');

        const el = e.target;
        const trigger = (el.className.includes("icon-light-on"));  
        const className = trigger ? "scene-white" : "scene-black";

        el.className = `icon-light-${trigger ? "off" : "on"}`;

        dispatch(setLightState(trigger));
        document.body.className = className;
    }

    // 

    useEffect(() => {
        if(location.pathname.includes("personal") && !firstView){
            setFirstView(true);
            handlePersonalView();
        }
    },[location.pathname])

    useEffect(() => {
        switch (three.status) {
            case "INDEX":
                handleActiveClassToRefs("add",refLogo,refCopyright,refPerson,refUtility,refDate,refProgressBlock)
                break;
            case "PROJECT":
                handleActiveClassToRefs("remove",refLogo,refCopyright,refDate,refProgressBlock, window.innerWidth < 500 && refUtility)
                break;
            case "PERSONAL":
                handleActiveClassToRefs("remove",refDate,refProgressBlock)
                break;
            default:
                break;
        }
    },[three.status])

    useEffect(() => {

        if(!three.helix) return;
        
        const handleProgress = (e) => {
            const value = Number( e.target.value );
            const planeCurrent = Math.round(value);	
            const rotate = ( (2*Math.PI) / 360 ) * helixPara.theta;

            dispatch(setPlaneCurrent(planeCurrent))

            gsap.to(three?.helix?.rotation, 1, {
                y: -1 * rotate * value,
            })
            gsap.to(three?.helix?.position, 1, {
                y: -1 * helixPara.gap * (three.map ? 0.4 : 1) * value,
            })

            // 

            setProgressBtn(planeCurrent, dataLength);
        }
        
        refProgress?.current.addEventListener("input", handleProgress);

        return () => {
            refProgress?.current.removeEventListener("input", handleProgress);
        }
        
    },[three.helix, three.planeCurrent, three.map])

    

    return (
        <nav>
            {/* Logo */}
            <a ref={refLogo} className="nav-logo" onClick={() => handleLogoView()}>
                <img src={imgLogo} alt="" className="w-100%" />
            </a>
            {/* Personal */}
            <a ref={refPerson} className="nav-hamburger" onClick={(e) => handlePersonalView(e)}>
                <span></span>
                <span></span>
                <span></span>
            </a>
            {/* Copyright */}
            <p ref={refCopyright} className="nav-copyright">{`KYM © ${(new Date).getFullYear()} All rights reserved`}</p>
            {/* Utility */}
            <div ref={refUtility} className="nav-utility" data-click>
                <a data-cursor="MAP">
                    <i ref={refMap} id="nav-utility-map" className="icon-map-off" onClick={(e) => handleMapView(e)}></i>
                </a>
                <a data-cursor="LIGHT">
                    <i ref={refLight} id="nav-utility-light" className={`icon-light-${light === "scene-white" ? "off" : "on"}`} onClick={(e) => handleLightView(e)}></i>
                </a>
            </div>
            {/* Date */}
            <div ref={refDate} className='nav-date'>
                {data.map((items) => {
                    
                    const url = items.project[0].url;
                    const year = items.project[0].name;
                    const id = items.project[0].id;

                    return (
                        url && <a key={id} className="nav-year" data-current={id} onClick={(e) => {
                            GA('click',`year-${year}`);
                            handleDateView(e);
                        }}>{year}</a>
                    )
                })}
            </div>
            {/* Progress */}
            <div ref={refProgressBlock} className="nav-progress-block">
                <input ref={refProgress} type="range" id="progress-range" defaultValue="0" step="0.0001" max={dataLength-1} min="0" />
            </div>
            
        </nav>
    )
}

export default Nav;