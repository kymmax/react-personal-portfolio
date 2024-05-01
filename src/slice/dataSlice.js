// Redux
import { createSlice } from "@reduxjs/toolkit";

// Data
import data from "../assets/data/project.json";


// 添加 id 的方法
const addIdToData = (data) => {

    let idNum = 0;

    const newData = data.map(item => {

      const newProjects = item.project.map(projectItem => {
        // 生成新的 id
        const newId = idNum;

        idNum++;
  
        // 返回一个包含新的 id 的新對象
        return { id: newId, ...projectItem };
      });
  
      // 返回一个包含新的 project 新對象
      return { ...item, project: newProjects };
    });
  
    return {data: newData, length: idNum};
  };
  
// 使用 addIdToData 函数添加 id
const dataMerge = addIdToData(data);


// Slice Part
const initialState = {
    data: dataMerge.data,
    length: dataMerge.length
};
  
const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {

    },
});

export default dataSlice.reducer;