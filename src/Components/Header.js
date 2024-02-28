import { FaCircleUser } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState, useRef, useEffect } from 'react'; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Header({setIsLoggedIn}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate()
  const handleUserIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {

    console.log("Logout clicked");
    localStorage.removeItem("token")
    localStorage.removeItem("userID")
    toast.success("Logged Out")
    setIsLoggedIn(false)
    navigate("/login")
    setShowDropdown(false); 
    window.location.reload();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
          <div className="relative group">
            <div
              onClick={handleUserIconClick}
              className="flex items-center gap-1 cursor-pointer"
            >
              <FaCircleUser className="h-6 w-6 rounded-full" /> {/* Adjust size */}
            </div>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 p-2 bg-white border rounded-md shadow-md dark:bg-boxdark text-gray-700 dark:text-gray-300"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm leading-5 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-boxdark dark:hover:text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
