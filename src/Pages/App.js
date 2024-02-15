import "./App.css";
import React from "react";
import AddTaskHours from "./Pages/AddTaskHours";
import AssignProject from "./Pages/AssignProject";
import ViewTimeSheet from "./Pages/ViewTimeSheet";
import Sider from "./Component/Sider";
import Header from "./Component/Header";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sider></Sider>
      
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header></Header>
        <Routes>
          <Route path="/addTaskHours" element={<AddTaskHours />} />
          <Route path="/assignProject" element={<AssignProject />} />
          <Route path="/viewTimeSheet" element={<ViewTimeSheet />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
