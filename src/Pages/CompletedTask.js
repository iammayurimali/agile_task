import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CompletedTask = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  //console.log("Selected",selectedDate.toLocaleDateString())
  const selectDate = selectedDate.toLocaleDateString()
  const storedData = JSON.parse(localStorage.getItem('dataKey')) || {};
 // console.log("Stored",storedData.date)
  const storeDate = storedData.date
 
  const handleDateChange = (date) => {
    setSelectedDate(date);

  };

  const displayFormData = () => {
   // const formattedSelectedDate = selectedDate.toLocaleDateString();
   // const selectedData = storedData[formattedSelectedDate];
   // console.log("SSS",selectedData)
   console.log("In fun:", selectDate, storeDate)
    
    if (selectDate === storeDate) {
      return (
        <div>
          <p>Date: {storedData.date}</p>
          <p>Start Time: {storedData.startTime}</p>
          <p>End Time: {storedData.endTime}</p>
          <p>Project: {storedData.project}</p>
          <p>Tasks Done: {storedData.tasksDone}</p>
        </div>
      );
    } else {
      return <p>No data available for the selected date.</p>;
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
