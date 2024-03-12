// TimeSheetTables.js
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegEdit } from "react-icons/fa";

const TimeSheetTables = ({
  projects,
  taskHours,
  totalWeekHours,
  selectedProject,
  selectedStartDate,
  selectedEndDate,
  selectedProjectDetails,
  handleDayChange,
  handleProjectSelectChange,
  handleStartDateChange,
  handleEndDateChange,
  filterDates,
  isToday,
  editableTask,
  setEditableTask,
  handleSaveEdit,
  handleCancelEdit,
  handleEdit,
  days
}) => {
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
    

  return (
    <div>
     
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
  );
};

export default TimeSheetTables;
