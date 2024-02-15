import React from "react";
import { Link } from "react-router-dom";

const Sider = () => {
  const selectedUser = JSON.parse(localStorage.getItem("userType")) || [];
  return (
    <div className="flex flex-col bg-gray-800 text-white h-screen w-1/6 p-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">Agile Task</h2>
        <ul>
          <li className="mb-2">
            {selectedUser === "man" ? (
              <Link
                to="/addproject"
                className="block p-2  hover:bg-gray-700"
              >
                Assign Project
              </Link>
            ) : (
              <Link
                to="/updatetask"
                className="block p-2 rounded hover:bg-gray-700"
              >
                Update Tasks
              </Link>
            )}
          </li>
          <li className="mb-2">
            <Link
              to="/completedtask"
              className="block p-2 rounded hover:bg-gray-700"
            >
              Completed Tasks
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sider;
