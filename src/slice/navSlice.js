import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    map: false
};
  
const navSlice = createSlice({
    name: 'nav',
    initialState,
    reducers: {
      setMapState(state, action){
        state.map = action.payload;

        const el = document.getElementById('nav-utility-map');
        el.className = `icon-map-${action.payload ? "on" : "off"}`;
      },
    },
});


export const { setMapState } = navSlice.actions;
export default navSlice.reducer;