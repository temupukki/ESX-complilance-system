"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define document types
const DOCUMENT_TYPES = [
  "annual report",
  "semi annual report",
  "insider trading policy",
  "board meeting disclosure",
  "share holder meeting disclosure",
  "confidential information",
] as const;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [documentType, setDocumentType] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/session");
        if (!res.ok) throw new Error("Failed to fetch session");
        const session = await res.json();
        setRole(session?.user?.role || "USER");
        setUserEmail(session?.user?.email || "");
      } catch (err) {
        console.error("Session fetch error:", err);
      }
    }
    fetchSession();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first");
      return;
    }

    if (!documentType) {
      setMessage("Please select a document type");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const bucketName = "document";
      const filePath = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const finalCompanyName = role === "ADMIN" 
        ? `${companyName.trim().toLowerCase()}@esx.com`
        : "esx1@esx.com";

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl: publicUrlData.publicUrl,
          userId: userEmail || "unknown-user",
          companyName: finalCompanyName,
          from: userEmail,
          type: documentType,
        }),
      });

      if (!res.ok) throw new Error("Failed to save metadata");

      setMessage("File uploaded successfully!");
      setFile(null);
      setCompanyName("");
      setDocumentType("");
    } catch (err: any) {
      console.error(err);
      setMessage(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-600">
            Document Upload
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {role === "ADMIN" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Bank Code
              </label>
              <Input
                placeholder="Enter bank code"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Document Type
            </label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Document File
            </label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>

          {message && (
            <p className={`text-center text-sm p-3 rounded-md ${
              message.startsWith("Upload failed") 
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}