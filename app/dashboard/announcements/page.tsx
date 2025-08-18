"use client";

import { useEffect, useState } from "react";

interface Announcement {
  to: string;
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/announcements");
        const data = await res.json();
        if (Array.isArray(data)) setAnnouncements(data);
        else setAnnouncements([]);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Announcements
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <p className="text-center text-gray-500">No announcements yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {announcements.map((ann) => (
                <tr
                  key={ann.id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-normal text-gray-800 font-semibold">
                    {ann.title}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-gray-800 font-semibold">
                    {ann.to}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-gray-700">
                    {ann.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ann.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
