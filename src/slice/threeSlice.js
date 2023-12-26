// React
import { createSlice } from "@reduxjs/toolkit";


// Slice Part
const initialState = {
    status: "INIT", // 網頁整體狀態
    scene: null,  // OBJ 整體場景
    helix: null,  // OBJ 螺旋結構
    planeCurrent: 0,  // Current Plane
    map: false,   // 地圖 on/off 
    light: false    // 光暗模式
};
  
const threeSlice = createSlice({
    name: 'three',
    initialState,
    reducers: {
      setStatus(state, action){
        state.status = action.payload;
      },
      setRefObj(state, action){
        return {...state, ...action.payload}
      },
      setPlaneCurrent(state, action){
        state.planeCurrent = action.payload;
      },
      setLightState(state, action){
        state.light = action.payload;
      },
      setMapState(state, action){
        state.map = action.payload;

        const el = document.getElementById('nav-utility-map');
        el.className = `icon-map-${action.payload ? "on" : "off"}`;
      },
    },
});


export const { setStatus, setRefObj, setPlaneCurrent, setMapState, setLightState } = threeSlice.actions;
export default threeSlice.reducer;