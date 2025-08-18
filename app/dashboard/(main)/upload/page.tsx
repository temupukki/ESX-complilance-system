"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [userEmail, setUserEmail] = useState(""); // Add state for user email

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) throw new Error("Failed to fetch session");
        const session = await res.json();
        setRole(session?.user?.role || "USER");
        setUserEmail(session?.user?.email || ""); // Set user email from session
      } catch (err) {
        console.error("Session fetch error:", err);
      }
    }
    fetchSession();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const bucketName = "document";
      const filePath = `${Date.now()}-${file.name}`;

      // Upload file to Supabase
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Determine company name based on role
      const finalCompanyName = role === "ADMIN" 
        ? `${companyName.trim().toLowerCase()}@esx.com`
        : "esx1@esx.com";

      // Save metadata in DB
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl: publicUrlData.publicUrl,
          userId: userEmail || "unknown-user", // Use user email as userId
          companyName: finalCompanyName,
          from: userEmail, // Add from field with user's email
        }),
      });

      if (!res.ok) throw new Error("Failed to save metadata");

      setMessage("✅ File uploaded successfully!");
      setFile(null);
      setCompanyName("");
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Upload Document
      </h1>

      {/* Only show company input for ADMIN users */}
      {role === "ADMIN" && (
        <input
          type="text"
          placeholder="Enter Bank code"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 w-full"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}