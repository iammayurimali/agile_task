import { FaCircleUser } from "react-icons/fa6";
import { useState } from "react";

export default function Header() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const handleDropdownToggle = () => {
        setDropdownOpen(!isDropdownOpen);
      };

      const handleLogout = () => {
        console.log("Logging out...");
      };
    return (
      <div className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
            <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
                <ui className="flex items-center gap-2 2xsm:gap-4">
                <FaCircleUser className="h-8 w-12 rounded-full cursor-pointer" onClick={handleDropdownToggle}/>
                {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border rounded shadow-lg">
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                  {/* Add more dropdown items as needed */}
                </div>
              )}
                </ui>
            </div>
        </div>
      </div>
    );
  }
  