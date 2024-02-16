import React from "react";
import { useState } from "react";

export default function AddTaskHours() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "P1",
      sunday: 0,
      monday: 4,
      tuesday: 5,
      wednesday: 6,
      thursday: 7,
      friday: 8,
      saturday: 0
    },
    {
      id: 2,
      name: "P2",
      sunday: 0,
      monday: 2,
      tuesday: 3,
      wednesday: 4,
      thursday: 5,
      friday: 6,
      saturday:0
    },
  ]);
  const handleDayChange = (projectId, day, value) => {
    setProjects((prevProjects) => {
      return prevProjects.map((project) =>
        project.id === projectId ? { ...project, [day]: value } : project
      );
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

        {/* form*/}
        <div className="container mx-auto mt-8">
          <table className="w-full border rounded-lg overflow-hidden shadow-lg bg-gray-200">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="py-2">Project</th>
                <th className="py-2">Sunday</th>
                <th className="py-2">Monday</th>
                <th className="py-2">Tuesday</th>
                <th className="py-2">Wednesday</th>
                <th className="py-2">Thursday</th>
                <th className="py-2">Friday</th>
                <th className="py-2">Saturday</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border text-center">
                  <td className="py-1">{project.name}</td>
                  <td className="py-1">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.sunday}
                      onChange={(e) => handleDayChange(project.id, 'sunday', e.target.value)}

                      disabled={new Date().getDay() !== 0}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.monday}
                      onChange={(e) => handleDayChange(project.id, 'monday', e.target.value)}

                      disabled={new Date().getDay() !== 1}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.tuesday}
                      onChange={(e) => handleDayChange(project.id, 'tuesday', e.target.value)}

                      disabled={new Date().getDay() !== 2}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.wednesday}
                      onChange={(e) => handleDayChange(project.id, 'wednesday', e.target.value)}

                      disabled={new Date().getDay() !== 3}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.thursday}
                      onChange={(e) => handleDayChange(project.id, 'thursday', e.target.value)}

                      disabled={new Date().getDay() !== 4}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.friday}
                      onChange={(e) => handleDayChange(project.id, 'friday', e.target.value)}

                      disabled={new Date().getDay() !== 5}
                    />
                  </td>
                  <td className="py-2">
                    <input
                      className="w-full text-center"
                      type="number"
                      value={project.saturday}
                      onChange={(e) => handleDayChange(project.id, 'saturday', e.target.value)}

                      disabled={new Date().getDay() !== 6}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
