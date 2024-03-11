import React, { useState } from "react";
import Modal from "react-modal";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ProjectHoursModal = ({ isOpen, onRequestClose, projectTotalHours, viewer }) => {
  const [selectedView, setSelectedView] = useState("bar");
  
    const chartData = viewer === "Developer"
      ? {
          labels: Object.values(projectTotalHours).map((project) => project.projectName),
          datasets: [
            {
              label: "Total Hours",
              data: Object.values(projectTotalHours).map((project) => project.hours),
              backgroundColor: selectedView === "pie"
                ? ["rgba(75, 192, 192, 0.4)", "rgba(255, 99, 132, 0.4)", "rgba(255, 205, 86, 0.4)"]
                : "rgba(75, 192, 192, 0.4)",
              borderColor: selectedView === "pie"
                ? ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 205, 86, 1)"]
                : "rgba(75, 192, 192, 1)",
            },
          ],
        }
      : {
          labels: Object.keys(projectTotalHours),
          datasets: [
            {
              label: "Total Hours",
              data: Object.values(projectTotalHours),
              backgroundColor: selectedView === "pie"
                ? ["rgba(75, 192, 192, 0.4)", "rgba(255, 99, 132, 0.4)", "rgba(255, 205, 86, 0.4)"]
                : "rgba(75, 192, 192, 0.4)",
              borderColor: selectedView === "pie"
                ? ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(255, 205, 86, 1)"]
                : "rgba(75, 192, 192, 1)",
            },
          ],
        };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  const renderChart = () => {
    switch (selectedView) {
      case "pie":
        return <Pie data={chartData} options={chartOptions} />;
      case "bar":
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Project Wise Hours Modal"
      style={{
        content: {
          width: "600px",
          height: "500px",
          margin: "auto",
          overflow: "auto",
          boxShadow: "2xl",
          padding: "2rem",
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <div className="modal-content">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-l font-semibold">Project Wise Hours</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold">View:</span>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              {/* Add more chart options as needed */}
            </select>
          </div>
        </div>
        <div className="chart-container">{renderChart()}</div>
      </div>
      <button
        onClick={onRequestClose}
        className="mt-4 bg-blue-500 text-white font-bold py-2 px-2 rounded text-sm hover:bg-blue-400"
      >
        Close
      </button>
    </Modal>
  );
};

export default ProjectHoursModal;
