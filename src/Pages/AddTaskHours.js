import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { getAssignedProject } from "../GraphQl/Query";
import { ADDTASKHOURS } from "../GraphQl/Mutation";

export default function AddTaskHours() {
  const [addTaskHours] = useMutation(ADDTASKHOURS);
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const [projects, setProjects] = useState([]);
  const [taskHours, setTaskHours] = useState([]);

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

      console.log("Task hours added successfully!", data);
    } catch (error) {
      console.error("Error adding task hours:", error.message);
      // handle errors as needed
    }
  };

  

  const userid = JSON.parse(localStorage.getItem("userID"));
  const { data, error, loading } = useQuery(getAssignedProject, {
    variables: { getAssignedProjectId: userid },
  });

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

  const getFormattedDate = (dayIndex) => {
    const currentDate = new Date();
    const dayDifference = dayIndex - currentDate.getDay();
    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() + dayDifference);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = targetDate.toLocaleDateString(undefined, options);
    //console.log(targetDate.toDateString())
    return formattedDate;
  };

  const renderHeader = () => {
   
    return (
      <tr className="bg-blue-700 text-white">
        <th className="py-2">Project</th>
        {days.map((day, index) => (
          <th key={index} className="py-2">
            {getFormattedDate(index)}<br/>
            {day}
          </th>
        ))}
      </tr>
    );
  };

  const handleDayChange = (projectId, dayIndex, value) => {
    setTaskHours((prevTaskHours) => {
      const newTaskHours = [...prevTaskHours];
      newTaskHours[projectId][dayIndex] = value;
      return newTaskHours;
    });
  };

  return (
    <div>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black dark:text-white">Time Sheet</h2>
        </div>

        <div className="container mx-auto mt-8">
          <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
            <thead>{renderHeader()}</thead>
            <tbody>
              {projects.map((project, projectIndex) => (
                <tr key={project.id} id={project.id} className="border text-center">
                  <td id={project.id} className="py-1">
                    {project.name}
                  </td>
                  {taskHours[projectIndex].map((value, dayIndex) => (
                    <td key={dayIndex} className="py-2">
                      <input
                        className="w-full text-center"
                        type="number"
                        value={value}
                        onChange={(e) => handleDayChange(projectIndex, dayIndex, e.target.value)}
                        disabled={new Date().getDay() !== dayIndex}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br/>
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
