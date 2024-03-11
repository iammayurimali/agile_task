import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { CiSearch } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import { BsGraphUpArrow } from "react-icons/bs";
import ProjectHoursModal from "./SubComponent/ProjectHoursGraphModal";

export default function ViewTimeSheet() {
  const token = JSON.parse(localStorage.getItem("token"));
  const decoded = jwtDecode(token);
  const userID = decoded.id;

  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error } = useQuery(getAssignedProject, {
    variables: { getAssignedProjectId: userID },
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
      console.log("Projects: ", selectedProjects);
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

  const calculateProjectWiseHours = () => {
    const projectWiseHours = {};

    selectedProjectDetails.forEach((task) => {
      const projectId = task.assignProjectId;
      const projectLabel = data.getAssignedProject.find(
        (project) => project.id === projectId
      )?.projectName;

      if (!projectWiseHours[projectId]) {
        projectWiseHours[projectId] = { projectName: projectLabel, hours: 0 };
      }

      projectWiseHours[projectId].hours += parseFloat(task.hours) || 0;
    });

    return projectWiseHours;
  };

  const projectWiseHours = calculateProjectWiseHours();
  console.log("Function data: ", projectWiseHours);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
          {selectedProjects.length > 1 && (
            <div className="mt-7">
              <button
                onClick={openModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded"
              >
                <BsGraphUpArrow />
              </button>
            </div>
          )}

          {/* Modal for Project Wise Hours */}
          <ProjectHoursModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            projectTotalHours={projectWiseHours}
            viewer = "Developer"
          />
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
        {/* Display project-wise hours */}
        <div className="mt-4 flex items-left justify-start">
          {selectedProjects.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Total Hours
              </h3>
              {Object.entries(calculateProjectWiseHours()).map(
                ([projectId, { projectName, hours }]) => (
                  <div key={projectId} className="mb-2">
                    <span className="text-gray-700 font-semibold">
                      {projectName}:
                    </span>{" "}
                    {hours} hours
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
