// React
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Plugin THREE 
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { Stats, OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from "three";
import { EffectComposer, Bloom, DepthOfField, Noise } from '@react-three/postprocessing';

// Plugin GSAP
import { gsap } from "gsap";

// Component
import Nav from './Nav';
import Loading from "./Loading";

// Component - THREE
import PlaneBoard from "./three/PlaneBoard";
import BgSphere from "./three/BgSphere";
import FogCustom from "./three/FogCustom";

// Slice
import { setPlaneCurrent, setStatus, setRefObj, setMapState } from "../slice/threeSlice";

// Data
import helixPara from "../assets/data/helixPara";

// Utils
import setProgressBtn from "../utils/setProgressBtn";
import useMousePosition from "../utils/useMousePosition";


let touchStart = 0;


const ThreeScene = () => {

    const data = useSelector((state) => state.data.data);
    const dataLength = useSelector((state) => state.data.length);
    const three = useSelector((state) => state.three);
    const planeCurrent = useSelector((state) => state.three.planeCurrent);
    const dispatch = useDispatch();         
    // 
    const navigate = useNavigate();
    const { id } = useParams();
    // 
    const refCamera = useRef();
    const refHelixObj = useRef();
    const refScene = useRef();
    // 
    const [onload, setOnLoad] = useState(false);
        
    const handleClickToPlane = ( NUMBER, isPROJECT, DURATION, STATUS ) => {    
        
        dispatch(setMapState(false));
        if(STATUS !== "SKIP") dispatch(setStatus("TRANSITION"));        

        helixPara.gap = -1;

        var rotate = ( (2*Math.PI) / 360 ) * helixPara.theta;
        var numberGap = Math.abs(NUMBER - planeCurrent);
        var durationGap = numberGap <= 10 ? 1 : 3;
        // if(numberGap == 0) durationGap = 0.2;        

        dispatch(setPlaneCurrent(NUMBER));
        setProgressBtn(NUMBER, dataLength, durationGap);

        // Animation on Helix Scroll
        gsap.to(refHelixObj?.current?.rotation, {
            y: -1 * rotate * (NUMBER),
            duration: DURATION || durationGap,
            ease: "power1.inOut",
            onComplete: function(){
                if(!isPROJECT) dispatch(setStatus("INDEX"));
            }
        })
        gsap.to(refHelixObj?.current?.position, {
            y: -1 * helixPara.gap * NUMBER,
            duration: DURATION || durationGap,
            ease: "power1.inOut"
        })

        gsap.to(refHelixObj?.current?.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: DURATION || durationGap,
            ease: "power1.inOut",
        })       
        
        if(!isPROJECT) return;

        // Animation on Main Scene
        gsap.to(refScene?.current?.position, {
            x: window.innerWidth <= 960 ? 0 : 11 * (window.innerWidth / 1920),
            y: 0,
            z: window.innerWidth <= 960 ? 20 : 2,
            duration: DURATION || durationGap,
            // delay: durationGap,
            ease: "power1.inOut"
        })
        gsap.to(refScene?.current?.rotation, {
            y: window.innerWidth <= 960 ? 0 : -0.3 * (window.innerWidth / 1920),
            duration: DURATION || durationGap,
            // delay: durationGap,
            ease: "power1.inOut",
            onComplete: function(){
                navigate(`/project/${NUMBER}`);
            }
        })

    }

    const handleHelixRotate = function(e, isTouch){
        
        if(!(["INDEX", "MAP"].includes(three.status))) return;

        const delta = isTouch ? (e.changedTouches[0].pageX - touchStart) * -1 * 2 : e.deltaY;
        const scrollVal = delta/100;
        const rotate = ( (2*Math.PI) / 360 ) * helixPara.theta;
        const shiftUnit = helixPara.gap * (three.map ? 0.4 : 1) / rotate;
        
        touchStart = isTouch ? e.changedTouches[0].pageX : touchStart;        

        // 
        gsap.to(refHelixObj?.current?.rotation, 1, {
            y: `-=${scrollVal}`,
        })
        gsap.to(refHelixObj?.current?.position, 1, {
            y: `-=${scrollVal*shiftUnit}`,
        })

        // PREV END
        if(refHelixObj?.current?.rotation.y > 0){
            gsap.to(refHelixObj?.current?.rotation, 1, {
                y: 0,
            })
            gsap.to(refHelixObj?.current?.position, 1, {
                y: 0,
            })
        }

        // NEXT END
        if(refHelixObj?.current?.rotation.y < -rotate * (helixPara.planeNum-1)){
            gsap.to(refHelixObj?.current?.rotation, 1, {
                y: `${-1*rotate * (helixPara.planeNum-1)}`,
            })
            gsap.to(refHelixObj?.current?.position, 1, {
                y: `${-1* helixPara.gap * (helixPara.planeNum-1)}`,
            })
        }

        // 
        var planeAfterOri = Math.abs(refHelixObj?.current?.rotation.y / rotate);
        var planeAfter = Math.round(planeAfterOri);
        
        // 
        setProgressBtn(planeAfter, dataLength);

        // 
        if(planeAfter - planeCurrent != 0){
            dispatch(setPlaneCurrent(planeAfter));
        }
    }

    const CreateHelixGroup = useMemo(() => {
        
        return (
            <group ref={refHelixObj}>

                {data.map((item, itemNum) => {
                    return item.project.map((project, projectNum) => {

                        let isProject = project?.["img-intro"]?.length > 0;
                        let id = project.id;
                        let theta = ((2 * Math.PI) / 360) * helixPara.theta * id - Math.PI / 2;
                        let x = helixPara.radius * Math.cos(theta);
                        let y = helixPara.gap * id;
                        let z = helixPara.radius * Math.sin(theta);

                        helixPara.planeNum = id;

                        // console.log("Plane Render");

                        return (
                            <PlaneBoard
                                key={id}
                                url={`${helixPara.url}${project["img-scene"]}-scene${helixPara.imagType}`}
                                position={[x, y, -z]}
                                rotation={[0, theta - Math.PI / 2 + Math.PI, 0]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClickToPlane(id, isProject);
                                }}
                            />
                        );
                    });
                })}
            </group>
        );
    }, [planeCurrent]);

    // useEffect =========================
    // Control scroll
    useEffect(() => {

        const getTouchStart = (e) => {
            touchStart = (e.changedTouches[0].pageX);
        }
        const getTouchMove = (e) => {
            handleHelixRotate(e,true);
        }

        document.addEventListener("wheel",handleHelixRotate);
        document.addEventListener("touchstart", getTouchStart);
        document.addEventListener("touchmove", getTouchMove);

        return (()=> {
            document.removeEventListener("wheel",handleHelixRotate);
            document.removeEventListener("touchstart", getTouchStart);
            document.removeEventListener("touchmove", getTouchMove);
        })
    },[planeCurrent, three, touchStart])

    // Check THREE ONLOAD
    useEffect(() => {
        THREE.DefaultLoadingManager.onLoad = function () {
            console.log('THREE Loading complete!');
            setOnLoad(true);
        };
    
        THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
            // console.log('%c %s', 'background: green; color: white;', 'Three Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };
    },[])

    // Control Web Status
    useEffect(() => {

        if (!refScene?.current && !refHelixObj?.current) return;

        switch (three.status) {
            case "INIT":
                // gsap.to(refScene?.current?.position, 1, {
                //     x: 0,
                //     y: 0,
                //     z: 0,
                //     ease: "power1.inOut"
                // })
                gsap.from(refScene?.current?.rotation, 2, {
                    x: Math.PI / 2,
                    y: Math.PI * 1,
                    // ease: "power1.inOut",
                    onComplete: function(){
                        dispatch(setStatus("INDEX"));
                    }
                })
                break;
            case "HOME":
                handleClickToPlane(0, false, 1);
                break;
            case "INDEX":                
                gsap.to(refScene?.current?.position, 1, {
                    x: 0,
                    y: 0,
                    z: 0,
                    ease: "power1.inOut"
                })
                gsap.to(refScene?.current?.rotation, 1, {
                    y: 0,
                    ease: "power1.inOut",
                })
                gsap.to(refScene?.current?.scale, 1, {
                    x: 1,
                    y: 1,
                    z: 1,
                    ease: "power1.inOut",
                })
                gsap.to(refHelixObj?.current?.scale, 1, {
                    x: 1,
                    y: 1,
                    z: 1,
                })
                break;
            case "PROJECT":
                handleClickToPlane(id, true, 1, "SKIP");
                break;
            case "PERSONAL":
                gsap.to(refScene?.current?.scale, 1, {
                    x: 8,
                    y: 8,
                    z: 8,
                    ease: "power1.inOut",
                })
                break;
            case "MAP":

                break;
            case "INDEX-TO-MAP":

                gsap.to(refHelixObj?.current?.position, 1, {
                    y: -1* helixPara.gap * 0.4 * planeCurrent,
                })
                gsap.to(refHelixObj?.current?.scale, 1, {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4,
                    onComplete: function(){
                        dispatch(setStatus("MAP"));
                    }
                })
                break;
            case "MAP-TO-INDEX":

                gsap.to(refHelixObj?.current?.position, 1, {
                    y: -1* helixPara.gap * 1 * planeCurrent,
                })
                gsap.to(refHelixObj?.current?.scale, 1, {
                    x: 1,
                    y: 1,
                    z: 1,
                    onComplete: function(){
                        dispatch(setStatus("INDEX"));
                    }
                })
                break;
            case "TRANSITION":

                break;
            default:
                if (three.status.startsWith("DATE")){                    
                    const number = three.status.split("=")[1];
                    handleClickToPlane(number, false);
                }
                break;
        }

    },[three.status, refScene.current, refHelixObj.current, planeCurrent])

    // Get OBJ Ref to Store
    useEffect(() => {

        (refScene?.current && refHelixObj?.current) && dispatch(setRefObj({
            scene: refScene.current,
            helix: refHelixObj.current
        }))
        
    }, [refScene.current, refHelixObj.current])

    // Mouse Parallax
    useMousePosition(refCamera,({x,y,ref}) => {
        const level = 400;
        gsap.to(ref?.current?.position, 1, {
            x: -x / level,
            y: y / level,
        })
    })
    
    
    return (
        <>
            {/* Loading */}
            <Loading onload={onload} />

            {/* THREE SCENE BLOCK */}
            <Canvas id="three-scene" flat 
                onCreated={(renderer) => {

                }}
            >

                {/* Camera */}
                <PerspectiveCamera ref={refCamera} makeDefault position={[0, 0, window.innerWidth < 500 ? 40 : 35]} fov={45} cameraNear={1} cameraFar={1000} />
                {/* Background Color */}
                <color attach="background" args={['black']} />
                {/* Fog */}
                <FogCustom />
                {/* Helper */}
                <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} enableDamping={true} dampingFactor={.05} />
                {/* <axesHelper args={[5]} /> */}
                
                {/* 狀態顯示 */}
                {/* <Stats /> */}

                {/* Light */}
                <ambientLight color={0xffffff} intensity={1.51} />
                {/* Environment */}
                <Environment
                    files="./assets/resource/scene.hdr"
                    background
                    blur={.5}
                />
                {/* Postprocessing */}
                {/* <EffectComposer> */}
                    {/* <Bloom intensity={10} luminanceThreshold={0.5} luminanceSmoothing={0.9}></Bloom> */}
                    {/* <DepthOfField
                        focusDistance={0}
                        focalLength={0.1}
                        bokehScale={5}
                        height={600}
                        blur={true}
                    /> */}
                    {/* <Noise opacity={0} /> */}
                {/* </EffectComposer> */}
                
                <group ref={refScene}>
                    {/* Scene Sphere - Universal */}
                    <BgSphere />

                    {/* Helix Plane */}
                    {CreateHelixGroup}
                </group>

            </Canvas>

            {/* Nav */}
            <Nav handleHelixRotate={handleHelixRotate}></Nav>

            {/* Other Page Content */}
            <Outlet></Outlet>
        </>
    )
}

export default ThreeScene;