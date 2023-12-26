// React
import { Component, Suspense, lazy, useEffect, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Plugin
import flashCSS from "html-flash-css";

// Component
import ThreeScene from './components/ThreeScene';
import ProjectView from './components/ProjectView';
import Personal from './components/Personal';

// Utils
import setMouseStyle from "./utils/setMouseStyle";


const App = () => {

  const location = useLocation();

  // flashCSS init
  useLayoutEffect(() => {
    const css = new flashCSS({
        observeDOM: true,
    });
  },[])

  // set Mouse cursor style
  useEffect(() => {    
    const mouse = setMouseStyle();
  },[location.pathname])  

  return (
    <>
      <Routes>
        {/* THREE.js 主體 */}
        <Route path='/' element={<ThreeScene/>}>
          {/* 個人頁 */}
          <Route path='personal' element={<Personal/>}></Route>
          {/* 作品頁 */}
          <Route path='project/:id' element={<ProjectView/>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
