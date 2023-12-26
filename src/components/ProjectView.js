// React
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

// Plugin jQuery
import $ from 'jquery';
import 'jquery.scrollbar';

// Slice
import { setStatus } from "../slice/threeSlice";


const ProjectView = () => {

    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    if(searchParams?.get('project') === 'false') return;

    const data = useSelector((state) => state.data.data);
    const dispatch = useDispatch();

    const [project, setProject] = useState();
    const [isActive, setIsActive] = useState(false);

    const closeProjectModule = () => {

        GA('click','project-close');
        dispatch(setStatus("INDEX"))
       
        setIsActive(false);
        setTimeout(() => {
            navigate('/');
        }, 1000);
    }


    // Show Project Content
    useEffect(()=> {
        // 使用 find 方法找到具有匹配 ID 的物件
        const targetObject = data.reduce((result, item) => {
            const matchedProject = item.project.find(projectItem => projectItem.id === +id);
            if (matchedProject) return { ...matchedProject };
            return result;
        }, null);
    
        setProject(targetObject);
        // console.log(targetObject);
        
        $('.scrollbar-inner').scrollbar();

        // 
        dispatch(setStatus("PROJECT"))

        const timeoutId = setTimeout(() => {
            setIsActive(true);
        }, 0);


        return () => clearTimeout(timeoutId);
    },[])

    const createContent = (project) => {
        return (
            <>
                <div className="project-block">
                    <p className="project-name">{project?.["name"]}</p>
                    <p className="project-date">{}</p>

                    <div className="project-content">
                        <div className="scrollbar-inner">
                            <ul className="award-block">
                                {
                                    project?.["award"]?.map((string, index) => {
                                        return (
                                            <li key={index}><i className="icon-award"></i>{string}</li>
                                        )
                                    })
                                }
                            </ul>
                            {
                                project?.["img-intro"]?.map((string, index) => {                                    
                                    return (
                                        <div key={index} className="img-block">
                                            <img src={`assets/resource/project/${string}.png`} alt="" />
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <a href={project?.["url"]} target="_blank" className="project-link" onClick={() => GA('click',`project-${project?.["name"]}-link`)}>LINK</a>
                    </div>
                </div>
            </>
        )
    }
    
    return (
        <div id="project-module" className={isActive ? 'active' : ''}>
            
            <a>
                <i id="project-close" className="icon-close project-close-btn" data-click onClick={() => closeProjectModule()}></i>
            </a>
            <div className="project-close project-close-btn d-none d-lg-block" onClick={() => closeProjectModule()}></div>

            {createContent(project)}
    
        </div>
    )
}

export default ProjectView;