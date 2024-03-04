import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select"; // Import react-select

export default function ViewTimeSheet() {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const userid = JSON.parse(localStorage.getItem("userID"));

  const { data, loading, error } = useQuery(getAssignedProject, {
    variables: { getAssignedProjectId: userid },
  });
  useEffect(() => {
    if (data && data.getAssignedProject) {
      const projectData = data.getAssignedProject;
      setProjects(
        projectData.map((project) => ({
          value: project.id,
          label: project.projectName,
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    const filterTasks = () => {
      const selectedProjectIds = selectedProjects.map(
        (project) => project.value
      );

      const filteredTasks = data.getAssignedProject
        .filter((project) => selectedProjectIds.includes(project.id))
        .flatMap((project) =>
          project.addTaskHours.filter((task) => {
            const taskDate = new Date(task.date);
            const selectedMonthStart = new Date(
              selectedMonth.getFullYear(),
              selectedMonth.getMonth(),
              1
            );
            const selectedMonthEnd = new Date(
              selectedMonth.getFullYear(),
              selectedMonth.getMonth() + 1,
              0
            );

            const isWithinSelectedMonth =
              taskDate >= selectedMonthStart && taskDate <= selectedMonthEnd;
            const includesSearchText = task.comments
              .toLowerCase()
              .includes(searchText.toLowerCase());

            return isWithinSelectedMonth && includesSearchText;
          })
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setSelectedProjectDetails(filteredTasks);
    };

    filterTasks();
  }, [selectedProjects, selectedMonth, searchText, data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error fetching project:", error);
    return <p>Error fetching project data</p>;
  }

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

        {/* Assigned Project list */}
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Projects
            </span>
            <Select
              options={projects}
              isMulti
              value={selectedProjects}
              onChange={(selectedOptions) =>
                setSelectedProjects(selectedOptions)
              }
            />
          </div>

          {/* Month Picker */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Month
            </span>
            <DatePicker
              selected={selectedMonth}
              onChange={(date) => setSelectedMonth(date)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              className="border p-2 rounded"
            />
          </div>

          {/* Search Bar */}
          <div className="flex flex-col ml-auto">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Search
            </span>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border p-2 rounded w-100"
              placeholder="Enter text to search"
            />
          </div>
        </div>
        {/* Table displaying selected project details */}
        <div className="flex items-center justify-center h-400px overflow-y: auto">
          {selectedProjects.length > 0 ? (
            <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                {selectedProjectDetails.length > 0 ? (
                  selectedProjectDetails.map((task, index) => (
                    <tr key={index}>
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
                    <td colSpan="3" className="text-center">
                      No task hours found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              Please select a project to view completed time sheet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
