import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CompletedTask = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectDate = selectedDate.toLocaleDateString()
  const storedData = JSON.parse(localStorage.getItem('dataKey')) || {};
  const storeDate = storedData.date
 
  const handleDateChange = (date) => {
    setSelectedDate(date);

  };

  const displayFormData = () => {
    
   if (selectDate === storeDate) {
    return (
      <div className="flex justify-center items-center">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Start Time</th>
              <th className="py-2 px-4 border-b">End Time</th>
              <th className="py-2 px-4 border-b">Project</th>
              <th className="py-2 px-4 border-b">Tasks Done</th>
            
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">{storedData.date}</td>
              <td className="py-2 px-4 border-b">{storedData.startTime}</td>
              <td className="py-2 px-4 border-b">{storedData.endTime}</td>
              <td className="py-2 px-4 border-b">{storedData.project}</td>
              <td className="py-2 px-4 border-b">{storedData.tasksDone}</td>
             <button id = "edit" type = "button" className="py-2 px-1 border-b rounded-lg">Edit </button>
              <button id = "save" type = "button" className="py-2 px-1 border-b rounded-lg">Save </button> 
            </tr>
          </tbody>
        </table>
      </div>
    );
  } else {
    return <p className="text-center">No data available for the selected date.</p>;
  }
  
  
  };

  return (
    <div>
      <label>Select Date:</label>
      <DatePicker selected={selectedDate} onChange={handleDateChange} />
      {displayFormData()}
    </div>
  );
};

export default CompletedTask;
