import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "./App.css";
//import Dashboard from "./Pages/Dashboard";
import { useState } from "react";

import AddTaskHours from "./Pages/AddTaskHours";
import AssignProject from "./Pages/AssignProject";
import ViewTimeSheet from "./Pages/ViewTimeSheet";
import Sider from "./Components/Sider";
import Header from "./Components/Header";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const navigate=useNavigate()
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     navigate("/signup");
  //   }
  // }, [isLoggedIn, navigate]);

console.log(isLoggedIn)

  return (
    <div className="App">
      {/* <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Navbar> */}
      {!isLoggedIn? (  
      <Routes>
        <Route path = "/"
        element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
      ):(
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
      )}
    </div>
  );
}

export default App;
