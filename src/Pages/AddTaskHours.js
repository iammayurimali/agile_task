import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import { ADDTASKHOURS } from "../GraphQl/Mutation";
import { GET_INITIAL_TASK_HOURS } from "../GraphQl/Query";
//import { getUser } from "../GraphQl/Query";
import { UPDATETASKHOUR } from "../GraphQl/Mutation";
import toast from "react-hot-toast";

export default function AddTaskHours() {
  const [addTaskHours] = useMutation(ADDTASKHOURS);
  const [editAddedTask] = useMutation(UPDATETASKHOUR);
 
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [projects, setProjects] = useState([]);
  const [taskHours, setTaskHours] = useState([]);
  const [totalWeekHours, setTotalWeekHours] = useState(0);

  const handleSave = async () => {
    const startDate = getFormattedDate(0);
    const endDate = getFormattedDate(6);

    try {
      const formattedTaskHours = projects.map((project, projectIndex) => ({
        assignProjectId: project.id,
        hoursTaskData: taskHours[projectIndex].map((hours, dayIndex) => ({
          date: getFormattedDate(dayIndex),
          day: days[dayIndex],
          hours: hours,
        })),
      }));

      const { data } = await addTaskHours({
        variables: {
          userId: JSON.parse(localStorage.getItem("userID")),
          startdate: startDate,
          enddate: endDate,
          idHoursData: formattedTaskHours,
        },
      });
      toast.success("Saved Successfully");
      console.log("Task hours added successfully!", data);
    } catch (error) {
      console.error("Error adding task hours:", error.message);
      // handle errors as needed
    }
  };

  const userid = JSON.parse(localStorage.getItem("userID"));
  const { data } = useQuery(getAssignedProject, {
    variables: { getAssignedProjectId: userid },
  });

  useEffect(() => {
    if (data && data.getAssignedProject) {
      const updatedProjects = data.getAssignedProject.map((project) => {
        const projectTaskHours = project.addTaskHours[0]?.projectTaskHoursDetails[0]?.taskHours;
        
        // Check if taskHours data is available, if not, set hours to zero for each day
        const taskHours = projectTaskHours ? projectTaskHours.map(hour => hour.hours) : Array(7).fill(0);
  
        return {
          id: project.id,
          name: project.projectName,
          taskHours: taskHours,
        };
      });
  
      setProjects(updatedProjects);
  
      const initialTaskHours = updatedProjects.map(project => project.taskHours);
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

      try {
        const formattedTaskHours = projects.map((project, projectIndex) => ({
          assignProjectId: project.id,
          hoursTaskData: newTaskHours[projectIndex].map((hours, index) => ({
            date: getFormattedDate(index),
            day: days[index],
            hours: hours,
          })),
        }));

        editAddedTask({
          variables: {
            userId: JSON.parse(localStorage.getItem("userID")),
            idHoursData: formattedTaskHours,
          },
        });

        console.log("Task hours updated successfully!");
      } catch (error) {
        console.error("Error updating task hours:", error.message);
        // handle errors as needed
      }

      return newTaskHours;
    });
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">
            Time Sheet
          </h2>
        </div>

        <div className="container mx-auto mt-8">
          <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
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
                        max="10"
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

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSave}
        >
          Save Task Hours
        </button>
      </div>
    </div>
  );
}
