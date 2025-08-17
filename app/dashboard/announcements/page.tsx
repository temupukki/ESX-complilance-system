"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetch("/api/announcements")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAnnouncements(data);
        else setAnnouncements([]);
      })
      .catch(() => setAnnouncements([]));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Announcements
      </h1>

      {announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements yet.</p>
      ) : (
        <ul className="space-y-4">
          {announcements.map((ann) => (
            <li key={ann.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition-shadow">
              <h2 className="text-lg font-semibold text-gray-800">{ann.title}</h2>
              <p className="text-gray-700 mt-2">{ann.message}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(ann.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
