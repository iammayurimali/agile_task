import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import { ADDTASKHOURS, UPDATETASKHOUR, DELETETASKHOUR} from "../GraphQl/Mutation";
import Modal from "react-modal";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdDelete } from "react-icons/md";
import { MdSecurityUpdateGood } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { format } from "date-fns";
import {jwtDecode} from "jwt-decode"
//import {userID, accountType} from "../constant/glob"

Modal.setAppElement("#root");
export default function AddTaskHours() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString()
  ); // modal date
  const [hours, setHours] = useState(0); //modal hours
  const [comments, setComments] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModalProject, setSelectedModalProject] = useState("");
  const [filteredTaskHours, setFilteredTaskHours] = useState([]);
  const [updateTaskHoursMutation] = useMutation(UPDATETASKHOUR);
  const [deleteTaskHourMutation] = useMutation(DELETETASKHOUR);

  const [selectedProject, setSelectedProject] = useState("");
  const [invalidHours, setInvalidHours] = useState(false);
  const [projects, setProjects] = useState([]);
  const [taskHours, setTaskHours] = useState([]); //table hours
  const [totalWeekHours, setTotalWeekHours] = useState(0);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
  const [addTaskHoursMutation] = useMutation(ADDTASKHOURS);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const token = JSON.parse(localStorage.getItem('token'));
  const decoded = jwtDecode(token);
  const userID = decoded.id

  const [editableTask, setEditableTask] = useState(null);
  const { data, refetch } = useQuery(getAssignedProject, {
    variables: { getAssignedProjectId: userID },
  });

  useEffect(() => {
    if (data && data.getAssignedProject) {
      const selectedProjectData = data.getAssignedProject.find(
        (project) => project.id === selectedModalProject
      );
      const filteredTaskHours = selectedProjectData
        ? selectedProjectData.addTaskHours.filter((task) => {
            const taskDate = new Date(task.date);
            const modalDate = new Date(selectedDate);
            return taskDate.getTime() === modalDate.getTime();
          })
        : [];
      setFilteredTaskHours(filteredTaskHours);
      if (filteredTaskHours.length > 0) {
        const [task] = filteredTaskHours;
        setComments(task.comments);
        setHours(task.hours);
      } else {
        setComments("");
        setHours(0);
      }
    }
  }, [data, selectedModalProject, selectedDate]);

  const isTaskExists = filteredTaskHours.length > 0;

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
      refetch();
      setProjects(updatedProjects);

      const initialTaskHours = Array.from(
        { length: updatedProjects.length },
        () => Array.from({ length: 7 }, () => 0)
      );

      const today = new Date();
      const currentWeekStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay()
      );
      const currentWeekEnd = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - today.getDay())
      );

      data.getAssignedProject.forEach((project) => {
        project.addTaskHours.forEach((taskHour) => {
          const taskDate = new Date(taskHour.date);
          if (taskDate >= currentWeekStart && taskDate <= currentWeekEnd) {
            const dayIndex = taskDate.getDay();
            const projectIndex = updatedProjects.findIndex(
              (p) => p.id === project.id
            );

            if (projectIndex !== -1 && dayIndex !== -1) {
              initialTaskHours[projectIndex][dayIndex] = taskHour.hours;
            }
          }
        });
      });

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
    const newTaskHours = [...taskHours];
    const oldValue = newTaskHours[projectId][dayIndex];

    if (oldValue === 0 && parseFloat(value) > 0) {
      toast.error("Please Add Task Hours before updating.");
      return;
    }

    if (oldValue !== 0 && parseFloat(value) === 0) {
      toast.error("Please add valid hours");
      return;
    }
    newTaskHours[projectId][dayIndex] = parseFloat(value);

    const totalHoursForDay = newTaskHours.reduce(
      (acc, projectHours) => acc + projectHours[dayIndex],
      0
    );

    if (totalHoursForDay <= 24) {
      setTaskHours(newTaskHours);

      const formattedDate = format(new Date(selectedDate), "M/d/yyyy");

      try {
        const projectData = data.getAssignedProject.find(
          (project) => project.id === projects[projectId].id
        );

        const comments =
          projectData.addTaskHours.find((task) => task.date === formattedDate)
            ?.comments || "";

        await updateTaskHoursMutation({
          variables: {
            userId: userID,
            assignProjectId: projects[projectId].id,
            comments: comments,
            date: formattedDate,
            day: days[dayIndex],
            hours: parseFloat(value),
          },
        });

        const updatedData = selectedProjectDetails.map((task) =>
          task.comments === comments
            ? { ...task, hours: parseFloat(value) }
            : task
        );
        refetch();
        setSelectedProjectDetails(updatedData);
        refetch();
        toast.success("Task hours updated successfully");
      } catch (error) {
        console.error("Error updating task hours", error);
        toast.error("Error updating task hours");
      }
    } else {
      toast.error("Total hours for the day cannot exceed 24.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = async () => {
    if (!hours || !comments || !selectedModalProject) {
      toast.error("Please fill all required fields");
      return;
    }

    if (comments.length < 10) {
      toast.error("Please enter at least 10 characters in the Comments field");
      return;
    }

    try {
      const result = await addTaskHoursMutation({
        variables: {
          userId: userID,
          assignProjectId: selectedModalProject,
          comments: comments,
          date: selectedDate,
          day: days[new Date(selectedDate).getDay()],
          hours: parseFloat(hours),
        },
      });

      refetch();
      closeModal();
      toast.success("Task hours added successfully");
    } catch (error) {
      console.error("Error adding task hours", error);
      toast.error("Project Task Already added");
    }

    // Resetting states
    setIsModalOpen(false);
    setSelectedModalProject("");
    setHours(0);
    setComments("");
  };

  const handleHoursChange = (value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 12) {
      setHours(parsedValue);
    } else {
      toast.error("Please enter a valid value between 0 and 12.");
    }
  };

  const handleProjectSelectChange = (value) => {
    setSelectedProject(value);

    const selectedProjectData = data.getAssignedProject.find(
      (project) => project.id === value
    );
    // refetch()
    const filteredTaskHours = selectedProjectData
      ? selectedProjectData.addTaskHours
          .filter((task) => {
            const taskDate = new Date(task.date);
            const startDate = new Date(selectedStartDate);
            const endDate = new Date(selectedEndDate);
            taskDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            return taskDate >= startDate && taskDate <= endDate;
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      : [];
    setSelectedProjectDetails(filteredTaskHours);
  };

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

  const filterDates = (date) => {
    const currentMonth = new Date().getMonth();
    return date.getMonth() === currentMonth;
  };

  const handleUpdateModal = async () => {
    if (comments.length < 10) {
      toast.error("Please enter atleast 10 characters in the comment field");
      return;
    }
    try {
      const result = await updateTaskHoursMutation({
        variables: {
          userId: userID,
          assignProjectId: selectedModalProject,
          comments: comments,
          date: selectedDate,
          day: days[new Date(selectedDate).getDay()],
          hours: hours,
        },
      });
      const updatedData = selectedProjectDetails.map((task) =>
        task.date === selectedDate ? { ...task, comments, hours } : task
      );
      refetch();
      setSelectedProjectDetails(updatedData);
      closeModal();
      toast.success("Task hours updated successfully");
    } catch (error) {
      console.error("Error updating task hours", error);
      toast.error("Error updating task hours");
    }

    // Resetting states
    setIsModalOpen(false);
    setSelectedModalProject("");
    setHours(0);
    setComments("");
  };

  const handleDeleteModal = async () => {
    const isConfirmed = window.confirm("Are you sure you want to delete this task?");
  
    if (isConfirmed) {
      try {
        const result = await deleteTaskHourMutation({
          variables: {
            assignProjectId: selectedModalProject,
            comments: comments,
            date: selectedDate,
            day: days[new Date(selectedDate).getDay()],
            hours: hours,
          },
        });
  
        refetch();
        closeModal();
        toast.success("Task hours deleted successfully");
      } catch (error) {
        console.error("Error deleting task hours", error);
        toast.error("Error deleting task hours");
      }
      setIsModalOpen(false);
      setSelectedModalProject("");
      setHours(0);
      setComments("");
    }
  };

  const handleEdit = (task) => {
    // Set the task to be edited
    setEditableTask({ ...task });
  };

  const handleSaveEdit = async () => {
    try {
      await updateTaskHoursMutation({
        variables: {
          userId: userID,
          assignProjectId: selectedProject,
          comments: editableTask.comments,
          date: editableTask.date,
          day: days[new Date(editableTask.date).getDay()],
          hours: editableTask.hours,
        },
      });
      const updatedSelectedProjectDetails = selectedProjectDetails.map((task) =>
        task.date === editableTask.date ? { ...task, ...editableTask } : task
      );
      refetch();
      setSelectedProjectDetails(updatedSelectedProjectDetails);
      setEditableTask(null);
      toast.success("Task hours updated successfully");
    } catch (error) {
      console.error("Error updating task hours", error);
      toast.error("Error updating task hours");
    }
  };

  const handleCancelEdit = () => {
    setEditableTask(null);
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-black active:border-black dark:border-form-strokedark dark:bg-form-input dark:focus:border-black"
                value={selectedModalProject}
                onChange={(e) => setSelectedModalProject(e.target.value)}
                required
                id="modalprojects"
              >
                <option>Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
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
                minLength="10"
                required
              />
            </div>
            {/* Validation message */}

            {/* Buttons */}
            <div className="flex justify-end">
              {isTaskExists ? (
                <div className="flex items-center">
                  <button
                    onClick={handleUpdateModal}
                    className="flex items-center border border-blue-500 hover:bg-blue-200 text-blue-500 font-bold py-2 px-4 rounded mr-2"
                  >
                    Update <MdSecurityUpdateGood className="ml-1" />
                  </button>
                  <button
                    onClick={handleDeleteModal}
                    className="flex items-center border border-red-500 hover:bg-red-200 text-red-500 font-bold py-2 px-4 rounded mr-2"
                  >
                    Delete <MdDelete className="ml-1" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <button
                    onClick={handleSaveModal}
                    className="flex items-center border border-blue-500 hover:bg-blue-200 text-blue-500 font-bold py-2 px-4 rounded mr-2"
                  >
                    Save <IoIosSave className="ml-1" />
                  </button>
                </div>
              )}
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
          {projects.length > 0 ? (
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
                          max="24"
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
          ) : (
            <p className="text-center text-gray-600 mt-4">
              No projects are assigned yet.
            </p>
          )}
        </div>
        <div style={{ marginBottom: "20px" }} />

        {/* Project Name and select start/end date*/}
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Project
            </span>
            <select
              className="border p-2 rounded"
              value={selectedProject}
              onChange={(e) => handleProjectSelectChange(e.target.value)}
            >
              <option value="" disabled>
                Select Project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-1">
              Start Date
            </span>
            <DatePicker
              selected={new Date(selectedStartDate)}
              onChange={(date) => handleStartDateChange(date)}
              filterDate={filterDates}
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
              filterDate={filterDates}
              minDate={new Date(selectedStartDate)}
              className="border p-2 rounded"
            />
          </div>
        </div>
        {/*second table*/}
        <div className="flex items-center justify-center">
          {selectedProject ? (
            <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th>Date</th>
                  <th>Hours</th>
                  <th>Comments</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProjectDetails.length > 0 ? (
                  selectedProjectDetails.map((task, index) => (
                    <tr key={index}>
                      <td className="text-center">{task.date}</td>
                      <td className="text-center">{task.hours}</td>
                      <td className="text-center">
                        {editableTask?.date === task.date ? (
                          <textarea
                            value={editableTask?.comments}
                            onChange={(e) =>
                              setEditableTask({
                                ...editableTask,
                                comments: e.target.value,
                              })
                            }
                          />
                        ) : (
                          task.comments
                        )}
                      </td>
                      <td className="text-center">
                        {isToday(new Date(task.date)) && (
                          <div>
                            {editableTask?.date === task.date ? (
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={handleSaveEdit}
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => handleEdit(task)}>
                                <FaRegEdit />
                              </button>
                            )}
                          </div>
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
