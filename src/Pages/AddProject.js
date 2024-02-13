import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function AddProject() {
  const [formData, setFormData] = useState({
    project: "",
    employee: "",
 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };




  useEffect(() => {
    localStorage.setItem("assignProject", JSON.stringify(formData));
  }, [formData]);
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Added", data)
  };

  const projects = ["RH", "Project B", "Project C"];
  const employeeData = [
    {
      id: 1,
      name: "Sujit",
      mail: "sujit@rbm.com",
    },
    {
      id: 2,
      name: "Mayuri",
      mail: "sujit@rbm.com",
    },
    {
      id: 3,
      name: "Jyoti",
      mail: "sujit@rbm.com",
    },
  ];

  return (
    <div>
      <h2 className="flex justify-center text-2xl font-bold mb-4">
        Assign Project
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-4 ">
          <div className="mr-4">
            <label
              htmlFor="project"
              className="block text-sm font-semibold mb-2"
            >
              Projects:
            </label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="w-48 p-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          <div className="mr-4">
            <label
              htmlFor="project"
              className="block text-sm font-semibold mb-2"
            >
              Employee:
            </label>
            <select
              id="employee"
              name="employee"
              value={formData.project}
              onChange={handleChange}
              className="w-48 p-2 border rounded"
              required
            >
              <option value="" disabled>
                Select a user
              </option>
              {employeeData.map((employee) => (
                <option key={employee.id} value={employee.name}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-100 bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          onClick={() => toast.success("Assigned Successfully")}
        >
          Assign Task
        </button>
      </form>
    </div>
  );
}
