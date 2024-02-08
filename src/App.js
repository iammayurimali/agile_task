import { Route, Routes } from "react-router-dom";
import Home from './Pages/Home'
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "./App.css";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import { useState } from "react";
import Sider from "./Components/Sider";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Navbar>
      <Routes>
        <Route path = "/" element={<Home/>}></Route>
        <Route path = "/login" element = {<Login setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path = "/signup" element = {<Signup setIsLoggedIn={setIsLoggedIn}/>}/>
        <Route path = '/dashboard' element = {<Dashboard/>}/>

      </Routes>
      <Sider isLoggedIn={isLoggedIn}></Sider>
    </div>

  );
}

export default App;
