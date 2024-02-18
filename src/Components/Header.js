import { FaCircleUser } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Header() {
  return (
    <div className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-3 2xsm:gap-7 ml-auto">
          <div className="flex items-center gap-1">
            <FaCircleUser className="h-8 w-12 rounded-full cursor-pointer" />
            <MdKeyboardArrowDown />
            {/* 
               take from navbar.jsx */}
          </div>
        </div>
      </div>
    </div>
  );
}
