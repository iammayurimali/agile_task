import { getAllDevelopers, getUserById } from "../GraphQl/Query";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CiSearch } from "react-icons/ci";


export default function ViewDeveloperTimeSheet() {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedDeveloper, setSelectedDeveloper] = useState("");
  const [searchText, setSearchText] = useState("");
  const [developers, setDevelopers] = useState([]);
  const [taskHoursData, setTaskHoursData] = useState([]);

  const { data: developersData } = useQuery(getAllDevelopers);

  const { data, loading, error } = useQuery(getUserById, {
    variables: { getUserByIdId: selectedDeveloper },
    skip: !selectedDeveloper,
  });

  useEffect(() => {
    if (data && data.getUserByID) {
      const allTaskHours =
        data.getUserByID.assignProject?.flatMap((project) =>
          (project.addTaskHours || []).map((task) => ({
            ...task,
            projectName: project.projectName,
          }))
        ) || [];
      const filteredTaskHours = allTaskHours
        .filter((task) => {
          const taskDate = new Date(task.date);
          taskDate.setHours(0, 0, 0, 0);
          selectedStartDate.setHours(0, 0, 0, 0);
          selectedEndDate.setHours(0, 0, 0, 0);
          const isWithinSelectedMonth =
              taskDate >= selectedStartDate && taskDate <= selectedEndDate;
            const includesSearchText = task.comments
              .toLowerCase()
              .includes(searchText.toLowerCase());

            return isWithinSelectedMonth && includesSearchText;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setTaskHoursData(filteredTaskHours);
    }
  }, [data, selectedEndDate, selectedStartDate, searchText]);

  useEffect(() => {
    if (developersData && developersData.getAllDevelopers) {
      setDevelopers(developersData.getAllDevelopers);
    }
  }, [developersData]);

  const handleStartDateChange = (date) => {
    if (date <= new Date()) {
      setSelectedStartDate(date);
    } else {
      toast.error("Start date cannot be greater than today's date");
    }
  };

  const handleEndDateChange = (date) => {
    if (date <= new Date()) {
      setSelectedEndDate(date);
    } else {
      toast.error("End date cannot be greater than today's date");
    }
  };

  const handleDeveloperChange = (e) => {
    setSelectedDeveloper(e.target.value);
  };
  const highlightSearchedWord = (text) => {
    const regex = new RegExp(`(${searchText})`, "gi");
    return text.replace(
      regex,
      (match) => `<span style="background-color: yellow">${match}</span>`
    );
  };
  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            View Time Sheet
          </h2>
        </div>

        <div className="flex gap-4 mb-4">
          {/* Developers dropdown */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Developers
            </span>
            <select
              value={selectedDeveloper}
              onChange={handleDeveloperChange}
              className="border p-2 rounded"
            >
              <option value="" disabled>
                Select Developer
              </option>
              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {`${developer.firstname} ${developer.lastname}`}
                </option>
              ))}
            </select>
          </div>

          {/* start and end date */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Start Date
            </span>
            <DatePicker
              selected={new Date(selectedStartDate)}
              onChange={(date) => handleStartDateChange(date)}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              End Date
            </span>
            <DatePicker
              selected={new Date(selectedEndDate)}
              onChange={(date) => handleEndDateChange(date)}
              minDate={new Date(selectedStartDate)}
              className="border p-2 rounded"
            />
          </div>
          {/* Search bar */}
          <div className="flex flex-col ml-auto">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Search
            </span>
            <div className="relative w-100">
      
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border p-2 rounded w-100"
              placeholder={`Search comments...`}
            />
            <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Table of developer Time Sheet */}
        <div className="flex items-center justify-center h-400px overflow-y: auto">
          {selectedDeveloper.length > 0 ? (
             <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
             <thead>
               <tr className="bg-blue-700 text-white">
                 <th>Project</th>
                 <th>Date</th>
                 <th>Hours</th>
                 <th>Comments</th>
               </tr>
             </thead>
 
             <tbody>
               {taskHoursData.length > 0 ? (
                 taskHoursData.map((task) => (
                   <tr key={task.id}>
                     <td className="text-center">{task.projectName}</td>
                     <td className="text-center">{task.date}</td>
                     <td className="text-center">{task.hours}</td>
                     <td className="text-center">
                         {searchText ? (
                           <span
                             dangerouslySetInnerHTML={{
                               __html: highlightSearchedWord(task.comments),
                             }}
                           />
                         ) : (
                           task.comments
                         )}
                       </td>
                   </tr>
                 ))
               ) : (
                 <tr>
                   <td colSpan="4" className="text-center">
                     No task hours found.
                   </td>
                 </tr>
               )}
             </tbody>
           </table>
          ) :(
            <p className="text-center text-gray-500 mt-4">
            Please select a developer to view completed time sheet.
          </p>
          )}
         
        </div>
      </div>
    </div>
  );
}
