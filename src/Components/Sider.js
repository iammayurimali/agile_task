import { PiTimerFill } from "react-icons/pi";
import { BsPencilSquare } from "react-icons/bs";
import { CiViewTimeline } from "react-icons/ci";
import { Link } from "react-router-dom";
import { SiTask } from "react-icons/si";

export default function Sider({ setIsLoggedIn }) {
  const selectedUser = JSON.parse(localStorage.getItem("accountType")) || [];

  return (
    <div className="absolute left-0 top-0 z-9999 flex flex-col h-screen w-72.5 overflow-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:relative lg:translate-x-0">
      <div className="flex items-center justify-between px-6 py-5.5 lg:py-6.5">
        <p className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out">
          <SiTask />
          Agile Task
        </p>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto duration-300 ease-linear">
        <nav className="px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-medium text-bodydark2">
              MENU
            </h3>
          </div>
          <ul className="flex flex-col gap-1.5">
            {selectedUser === "Manager" ? (
              <Link to="/assignProject">
                <li className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                  <BsPencilSquare />
                  Assign Project
                </li>
              </Link>
            ) : (
              <Link to="/addTaskHours">
                <li className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                  <PiTimerFill />
                  Add Task Hours
                </li>
              </Link>
            )}

            <Link to="/viewTimeSheet">
              <li className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4">
                <CiViewTimeline />
                View Time sheet
              </li>
            </Link>
          </ul>
        </nav>
      </div>
    </div>
  );
}
