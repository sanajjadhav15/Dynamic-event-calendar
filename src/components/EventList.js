import React, { useState, useEffect } from "react";
import "../styles/eventList.css";

const EventList = ({ selectedDay, events, setEvents }) => {
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || {};
    setEvents(storedEvents);
  }, [setEvents]);

  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    name: "",
    startTime: "",
    endTime: "",
    description: "",
  });
  const [filterKeyword, setFilterKeyword] = useState("");
  const [overlapError, setOverlapError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    setFilterKeyword(e.target.value);
  };

  const saveEvent = () => {
    const newStartTime = new Date(`${selectedDay} ${currentEvent.startTime}`);
    const newEndTime = new Date(`${selectedDay} ${currentEvent.endTime}`);
    
    const existingEvents = events[selectedDay] || [];
    
    const isOverlapping = existingEvents.some((event) => {
      const existingStartTime = new Date(`${selectedDay} ${event.startTime}`);
      const existingEndTime = new Date(`${selectedDay} ${event.endTime}`);
      return (
        (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
        (newEndTime > existingStartTime && newEndTime <= existingEndTime)
      );
    });

    if (isOverlapping) {
      setOverlapError("Event overlaps with another event. Please choose a different time.");
      return;
    } else {
      setOverlapError("");
    }

    setEvents((prev) => {
      const dayEvents = prev[selectedDay] || [];
      const updatedEvents = { ...prev, [selectedDay]: [...dayEvents, currentEvent] };
      return updatedEvents;
    });
    setShowModal(false);
    setCurrentEvent({ name: "", startTime: "", endTime: "", description: "" });
  };

  const deleteEvent = (index) => {
    setEvents((prev) => {
      const updatedDayEvents = (prev[selectedDay] || []).filter((_, i) => i !== index);
      if (updatedDayEvents.length === 0) {
        const { [selectedDay]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [selectedDay]: updatedDayEvents };
    });
  };

  const filteredEvents = (events[selectedDay] || []).filter((event) =>
    event.name.toLowerCase().includes(filterKeyword.toLowerCase()) ||
    event.description.toLowerCase().includes(filterKeyword.toLowerCase())
  );

  return (
    <div className="event-list-container">
      <h2 className="event-list-title">Events for {selectedDay}</h2>
      
      <input
        type="text"
        placeholder="Filter events..."
        value={filterKeyword}
        onChange={handleFilterChange}
        className="filter-input"
      />
      
      <button className="add-event-btn" onClick={() => setShowModal(true)}>
        Add Event
      </button>

      {overlapError && <div className="error-message">{overlapError}</div>}
      
      <ul className="event-list">
        {filteredEvents.map((event, index) => (
          <li key={index} className="event-item">
            <div className="event-details">
              <strong>{event.name}</strong>
              <span>
                {event.startTime} - {event.endTime}
              </span>
              <p>{event.description}</p>
            </div>
            <button className="delete-event-btn" onClick={() => deleteEvent(index)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Event</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={currentEvent.name}
                onChange={handleInputChange}
                className="input-field"
              />
              <input
                type="time"
                name="startTime"
                value={currentEvent.startTime}
                onChange={handleInputChange}
                className="input-field"
              />
              <input
                type="time"
                name="endTime"
                value={currentEvent.endTime}
                onChange={handleInputChange}
                className="input-field"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={currentEvent.description}
                onChange={handleInputChange}
                className="input-field textarea"
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="save-btn" onClick={saveEvent}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventList;
