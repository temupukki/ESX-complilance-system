"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file first");
      return;
    }
    if (!companyName.trim()) {
      setMessage("❌ Please enter bank code");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Correct bucket name
      const bucketName = "document";
      const filePath = `${Date.now()}-${file.name}`;

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Save metadata in your DB
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl: publicUrlData.publicUrl,
          userId: "test-user-1", // replace with real logged-in user later
          companyName: `${companyName.trim().toLowerCase()}@esx.com`,

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

      <input
        type="text"
        placeholder="Enter Bank code"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

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
