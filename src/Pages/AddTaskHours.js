import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import { ADDTASKHOURS } from "../GraphQl/Mutation";
//import { getUser } from "../GraphQl/Query";
import Modal from "react-modal";
import { UPDATETASKHOUR } from "../GraphQl/Mutation";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

Modal.setAppElement("#root");
export default function AddTaskHours() {
  const [addTaskHours] = useMutation(ADDTASKHOURS);
  const [editAddedTask] = useMutation(UPDATETASKHOUR);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [hours, setHours] = useState(0); //modal hours
  const [comments, setComments] = useState("");
  const [invalidHours, setInvalidHours] = useState(false);
  const [projects, setProjects] = useState([]);
  const [taskHours, setTaskHours] = useState([]); //table hours
  const [totalWeekHours, setTotalWeekHours] = useState(0);

  const userid = JSON.parse(localStorage.getItem("userID"));
  const { data } = useQuery(getAssignedProject, {
    variables: { getAssignedProjectId: userid },
  });

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    if (data && data.getAssignedProject) {
      const updatedProjects = data.getAssignedProject.map((project) => ({
        id: project.id,
        name: project.projectName,
      }));
      setProjects(updatedProjects);

      // Initialize taskHours state based on the number of projects and days
      const initialTaskHours = Array.from({ length: updatedProjects.length }, () =>
        Array.from({ length: 7 }, () => 0)
      );
      setTaskHours(initialTaskHours);
    }
  }, [data]);

  useEffect(() => {
    const totalHours = taskHours.reduce(
      (acc, projectHours) =>
        acc + projectHours.reduce((dayAcc, hours) => dayAcc + hours, 0),
      0
    );

    setTotalWeekHours(totalHours);
  }, [taskHours]);

  const getFormattedDate = (dayIndex) => {
    const currentDate = new Date();
    const dayDifference = dayIndex - currentDate.getDay();
    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() + dayDifference);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = targetDate.toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const renderHeader = () => {
    return (
      <tr className="bg-blue-700 text-white">
        <th className="py-2">Project</th>
        {days.map((day, index) => (
          <th key={index} className="py-2">
            {getFormattedDate(index)}
            <br />
            {day}
          </th>
        ))}
        <th className="py-2">Total Week Hours</th>
      </tr>
    );
  };

  const handleDayChange = async (projectId, dayIndex, value) => {
    setTaskHours((prevTaskHours) => {
      const newTaskHours = [...prevTaskHours];
      newTaskHours[projectId][dayIndex] = parseFloat(value);
      return newTaskHours;
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = () => {
    console.log("date:", selectedDate);
    if (!hours || !comments || !selectedProject) {
      toast.error("Please fill all required fields");
      return;
    }
    closeModal();
    toast.success("Task hours added successfully");
  };

  const handleHoursChange = (value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 12) {
      setHours(parsedValue);
    } else {
      toast.error("Please enter a valid value between 0 and 12.");
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Time Sheet
          </h2>
        </div>
        {/* Add TaskHours Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{ float: "right" }}
          onClick={openModal}
        >
          Add Task Hours
        </button>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Task Hours Modal"
          style={{
            content: {
              width: "500px",
              height: "500px",
              margin: "auto",
              overflow: "auto",
              boxShadow: "2xl",
            },
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          }}
        >
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add Task Hours</h2>
            <div className="flex mb-4">
              {/* Date input field */}
              <div className="flex flex-col mr-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  disabled
                  className="w-48 p-2 border rounded"
                />
              </div>
              {/* Hours input field */}
              <div className="flex flex-col">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Hours<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={hours}
                  onChange={(e) => handleHoursChange(e.target.value)}
                  className={`w-48 p-2 border rounded ${
                    invalidHours ? "border-red-500" : ""
                  }`}
                  required
                />
              </div>
            </div>
            {/* Project dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Project<span className="text-red-500">*</span>
              </label>
              <select
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
              >
                <option>Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} id = {project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Comments input field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Comments<span className="text-red-500">*</span>
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Validation message */}

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Save Task Hours
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-600 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* First Table(Main Table) */}
        <div className="container mx-auto mt-8">
          <table
            className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200"
            style={{ marginTop: "80px" }}
          >
            <thead>{renderHeader()}</thead>
            <tbody>
              {projects.map((project, projectIndex) => (
                <tr
                  key={project.id}
                  id={project.id}
                  className="border text-center"
                >
                  <td id={project.id} className="py-1">
                    {project.name}
                  </td>
                  {taskHours[projectIndex].map((value, dayIndex) => (
                    <td key={dayIndex} className="py-2">
                      <input
                        className="w-full text-center"
                        type="number"
                        min="0"
                        max="12"
                        value={value}
                        onChange={(e) =>
                          handleDayChange(
                            projectIndex,
                            dayIndex,
                            e.target.value
                          )
                        }
                        disabled={new Date().getDay() !== dayIndex}
                      />
                    </td>
                  ))}
                  <td className="py-2">
                    {taskHours[projectIndex].reduce(
                      (acc, hours) => acc + hours,
                      0
                    )}
                  </td>
                </tr>
              ))}
              <br />
              <tr className="bg-blue-400 text-white text-center">
                <td className="py-2 text-center">Total</td>
                {Array.from({ length: 7 }, (_, dayIndex) => (
                  <td key={dayIndex} className="py-2">
                    {taskHours.reduce(
                      (acc, projectHours) => acc + projectHours[dayIndex],
                      0
                    )}
                  </td>
                ))}
                <td className="py-2 ">Total = {totalWeekHours}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginBottom: "20px" }} />

        {/* Project Name and select date*/}
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Project
            </span>
            <select className="border p-2 rounded">
              <option value="" disabled selected>
                Select Project
              </option>
              {projects.map((project) => (
                <option key={project.id} id = {project.id}value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">Date</span>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="border p-2 rounded"
              
            />
          </div>
        </div>

        {/* Second Table */}
        <div className="flex items-center justify-center">
          <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th>Date</th>
                <th>Hours</th>
                <th>Comments</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}
