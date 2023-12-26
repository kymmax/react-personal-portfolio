// React
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";


const Personal = () => {

    const [isActive, setIsActive] = useState(false);
    const three = useSelector((state) => state.three);

    useEffect(()=> {
        const timeoutId = setTimeout(() => {
            setIsActive((three.status === "PERSONAL") ? true : false);
          }, 0);
        
        return () => clearTimeout(timeoutId);
    },[three.status])

    return (
        <div id="personal-block" className={isActive ? 'active' : ''}>
            <p className="person-name">JASON KUO</p>
            <p className="person-position">Front-End Developer</p>
            <a href="mailto:kymmax0420@gmail.com" className="person-mail" onClick={()=> GA('click','personal-mail') }>kymmax0420@gmail.com</a>
        </div>
    )
}

export default Personal;