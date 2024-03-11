import React, { useState } from "react";
import Modal from "react-modal";
import { IoIosSave } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdSecurityUpdateGood, MdDelete } from "react-icons/md";

Modal.setAppElement("#root");

const AddTaskHourModal = ({
  isModalOpen,
  closeModal,
  handleSaveModal,
  handleUpdateModal,
  handleDeleteModal,
  isTaskExists,
  hours,
  setSelectedDate,
  comments,
  setComments,
  selectedModalProject,
  setSelectedModalProject,
  projects,
  selectedDate,
   handleHoursChange, 
  invalidHours,
}) => {
  return (
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
  );
};

export default AddTaskHourModal;
