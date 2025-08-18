"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  to: string;
  message: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [to, setTo] = useState(""); // New field
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("/api/announcements");
      const data = await res.json();
      if (Array.isArray(data)) setAnnouncements(data);
      else setAnnouncements([]);
    } catch {
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !to.trim() || !message.trim()) {
      setError("Title, To, and Message are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), to: `${to.trim()}@esx.com`, message: message.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create announcement");

      setTitle("");
      setTo("");
      setMessage("");
      fetchAnnouncements(); // refresh list

      // SUCCESS TOAST
      toast.success("Announcement posted successfully!", {
        description: `${title.trim()} has been announced to ${to.trim()}.`,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to post announcement", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Announcements
      </h1>

      {/* Post Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Post New Announcement</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="To (recipient or group)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? "Posting..." : "Post Announcement"}
        </button>
      </form>

      {/* List of Announcements */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <h3 className="font-semibold text-blue-700">{a.title}</h3>
            <p className="text-gray-500 text-sm mb-1"><span className="font-semibold">To:</span> {a.to}</p>
            <p className="text-gray-700">{a.message}</p>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(a.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
