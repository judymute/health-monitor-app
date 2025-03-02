import React from 'react';

const DaySelector = ({ activeDay, setActiveDay }) => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDay + i);
    const dayNum = date.getDate();

    days.push(
      <button 
        key={i} 
        className={`btn ${activeDay === dayNum ? 'btn-primary' : 'btn-light'}`} 
        onClick={() => setActiveDay(dayNum)}
      >
        {dayNum}
      </button>
    );
  }

  return <div className="d-flex gap-2 mb-4 justify-content-center">{days}</div>;
};

export default DaySelector;
