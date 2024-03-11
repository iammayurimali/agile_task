import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import {
  ADDTASKHOURS,
  UPDATETASKHOUR,
  DELETETASKHOUR,
} from "../GraphQl/Mutation";
import Modal from "react-modal";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { jwtDecode } from "jwt-decode";
import AddTaskHourModal from "./SubComponent/AddTaskHourModal";
import TimeSheetTables from "./SubComponent/TimeSheetTables";

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

  const token = JSON.parse(localStorage.getItem("token"));
  const decoded = jwtDecode(token);
  const userID = decoded.id;

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
      toast.error("Error adding task hours");
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
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

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

        <AddTaskHourModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleSaveModal={handleSaveModal}
          handleUpdateModal={handleUpdateModal}
          handleDeleteModal={handleDeleteModal}
          isTaskExists={isTaskExists}
          hours={hours}
          comments={comments}
          setComments={setComments}
          setSelectedDate = {setSelectedDate}
          selectedModalProject={selectedModalProject}
          setSelectedModalProject={setSelectedModalProject}
          projects={projects}
          selectedDate={selectedDate}
          selectedProjectDetails={selectedProjectDetails}
          handleHoursChange = {handleHoursChange}
          invalidHours={invalidHours}
        />

       {/* TimeSheetTables component */}
       <TimeSheetTables
          projects={projects}
          taskHours={taskHours}
          totalWeekHours={totalWeekHours}
          selectedProject={selectedProject}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          selectedProjectDetails={selectedProjectDetails}
          handleDayChange={handleDayChange}
          handleProjectSelectChange={handleProjectSelectChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          filterDates={filterDates}
          isToday={isToday}
          editableTask={editableTask}
          setEditableTask={setEditableTask}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          handleEdit={handleEdit}
          days = {days}
        />
      </div>
    </div>
  );
}
