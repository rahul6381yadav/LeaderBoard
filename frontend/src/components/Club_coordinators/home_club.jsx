import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
} from "date-fns";
import {jwtDecode} from "jwt-decode";

const HomeClub = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchRating();
  }, [currentMonth]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }

      const response = await axios.get("http://localhost:4000/api/v1/club/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.events) {
        const formattedEvents = response.data.events.map((event) => ({
          ...event,
          date: new Date(event.date).toISOString().split("T")[0],
        }));
        setEvents(formattedEvents);
      }
    } catch (err) {
      console.error("Error fetching events:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }

      const decoded = jwtDecode(token);
      const { clubId } = decoded; 

      const response = await axios.get(`http://localhost:4000/api/v1/club?id=${clubId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.club.overallRating !== undefined) {
        setRating(response.data.club.overallRating);
      }
    } catch (err) {
      console.error("Error fetching rating:", err.response || err.message);
    }
  };

  const getEventsForDate = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return events.filter((event) => event.date === formattedDate);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-5 dark:text-white">
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
      >
        {"<"}
      </button>
      <h3 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h3>
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
      >
        {">"}
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 text-center font-bold mb-2 dark:text-gray-300">
        {days.map((day, index) => (
          <div key={index} className="py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let currentDay = new Date(startDate);

    while (currentDay <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isOutsideMonth = !isSameMonth(currentDay, currentMonth);
        const eventsForDay = getEventsForDate(currentDay);

        days.push(
          <div
            key={currentDay}
            className={`h-16 flex flex-col justify-center items-center rounded-lg transition transform hover:scale-110 cursor-pointer ${
              isSameDay(currentDay, selectedDate) ? "bg-blue-500 text-white dark:bg-blue-700" : ""
            } ${isOutsideMonth ? "text-gray-400 dark:text-gray-600" : "hover:bg-blue-200 dark:hover:bg-blue-900"}`}
            onClick={() => {
              if (!isOutsideMonth) {
                setSelectedDate(new Date(currentDay));
              }
            }}
          >
            <span>{format(currentDay, "d")}</span>
            {eventsForDay.length > 0 && (
              <span className="block mt-1 w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </div>
        );
        currentDay = addDays(currentDay, 1);
      }

      rows.push(
        <div className="grid grid-cols-7 gap-2 mb-2" key={currentDay}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const renderSidePanel = () => {
    if (!selectedDate) return null;

    const eventsForDay = getEventsForDate(selectedDate);

    return (
      <div className="bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg p-5 shadow-md">
        <h3 className="font-bold mb-3">
          Events for {format(selectedDate, "MMMM dd, yyyy")}
        </h3>
        <ul className="list-disc pl-5">
          {eventsForDay.length > 0 ? (
            eventsForDay.map((event, index) => <li key={index}>{event.name}</li>)
          ) : (
            <li>No events scheduled.</li>
          )}
        </ul>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          onClick={() => setSelectedDate(null)}
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="p-5 max-w-6xl mx-auto dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex-1">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          {selectedDate && renderSidePanel()}
        </div>

        {/* Club Rating Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full lg:w-1/3">
          <h3 className="text-lg font-bold mb-3 dark:text-white">Club Rating</h3>
          {rating !== null ? (
            <p className="text-2xl font-bold text-blue-500">{rating}</p>
          ) : (
            <p className="text-gray-500">Loading rating...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeClub;
