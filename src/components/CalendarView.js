import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EventList from "./EventList";
import '../styles/calendarView.css';

const CalendarView = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDayClick = (value) => {
    const selectedDate = value.toDateString();
    setSelectedDay(selectedDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const today = new Date().toDateString();
      const day = date.toDateString();

      if (day === today) return "highlight-today";
      if (day === selectedDay) return "highlight-selected";
      if (date.getDay() === 0 || date.getDay() === 6) return "highlight-weekend";
    }
    return null;
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Dynamic Event Calendar</h1>
      <Calendar
        onClickDay={handleDayClick}
        value={date}
        onActiveStartDateChange={({ activeStartDate }) => setDate(activeStartDate)}
        tileClassName={tileClassName}
      />
      {selectedDay && (
        <EventList
          selectedDay={selectedDay}
          events={events}
          setEvents={setEvents}
        />
      )}
    </div>
  );
};

export default CalendarView;
