import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import toast from 'react-hot-toast'
import { useEffect } from 'react';

const UpdateTask = () => {
  const [formData, setFormData] = useState({
    project: '',
    tasksDone: '',
    startTime: '',
    endTime: '',
    date: new Date()
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      date: date.toLocaleDateString()
    }));
  };

  const handleTimeChange = (name, time) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: time,
    }));
  };
  useEffect(() => {
    localStorage.setItem('dataKey', JSON.stringify(formData));
  }, [formData]);
  const handleSubmit = (e) => {
    e.preventDefault();
   //console.log("Added", data)

  };
  

  const projects = ['RH', 'Project B', 'Project C']; 

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Update your daily Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-4">
          <div className="mr-4">
            <label htmlFor="project" className="block text-sm font-semibold mb-2">
              Project:
            </label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-48 p-2 border rounded"
              required
            >
              <option value="" disabled>Select a project</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-semibold mb-2">
              Date:
            </label>
            <DatePicker
              id="date"
              selected={formData.date}
              onChange={handleDateChange}
              className="w-48 p-2 border rounded"
              dateFormat="MM/dd/yyyy"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="tasksDone" className="block text-sm font-semibold mb-2">
            Tasks done:
          </label>
          <textarea
            type="text"
            id="tasksDone"
            name="tasksDone"
            value={formData.tasksDone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="startTime" className="block text-sm font-semibold mb-2">
            Start time:
          </label>
          <TimePicker
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={(time) => handleTimeChange('startTime', time)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endTime" className="block text-sm font-semibold mb-2">
            End time:
          </label>
          <TimePicker
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={(time) => handleTimeChange('endTime', time)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-100 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          onClick={()=>toast.success("Updated Successfully")}
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;