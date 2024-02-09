import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "./App.css";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import { useState } from "react";
import Sidebar from "./Components/Sidebar";
import UpdateTask from "./Pages/UpdateTask";
import CompletedTask from "./Pages/CompletedTask";
import AddProject from "./Pages/AddProject";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Navbar>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
      {isLoggedIn && (
        <div className="flex">
          <Sidebar />
          <div className="w-full max-w-xl mx-auto p-12 bg-white shadow-md rounded-md">
            <Routes>
              <Route path="/updatetask" element={<UpdateTask />} />
              <Route path="/completedtask" element={<CompletedTask />} />
              <Route path = "/addproject" element={<AddProject/>}/>
              <Route
                path="/dashboard"
                element={<Dashboard isLoggedIn={isLoggedIn} />}
              />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
