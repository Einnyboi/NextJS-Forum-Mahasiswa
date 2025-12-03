"use client";
import React from "react";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#d0dfda] flex justify-center py-10 px-4">
      <div className="w-full max-w-xl flex justify-center">
        {/* Main Form Card */}
        <div className="bg-white rounded-2xl p-10 shadow-md w-full">
          <h1 className="text-3xl font-bold text-center mb-2">Create Your Own Events</h1>
          <h2 className="text-xl font-semibold text-center mb-1">Suggest an Event</h2>
          <p className="text-center text-gray-500 mb-8">Fill out the details below</p>

          <form className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Event Title</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Event Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Event Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Location</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none"
                placeholder="Enter location"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:opacity-80 transition"
            >
              Submit Event
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
