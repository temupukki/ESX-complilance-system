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
import { Textarea } from "@/components/ui/textarea";

const ANNUAL_REPORT_DATES = ["June 30", "July 7", "December 31"];
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
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [customDocumentType, setCustomDocumentType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [userEmail, setUserEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [timeline, settimeline] = useState("");
  const [mettype, setmettype] = useState("");
  const [responsibleUnit, setResponsibleUnit] = useState("");
  const [remark, setRemark] = useState("");

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

    // Document type is now optional, so we remove the validation for it

    // Additional validation for annual reports (only if document type is selected)
    if (documentType === "annual report") {
      if (!selectedDate) {
        setMessage("Please select a reporting date for the annual report");
        return;
      }
      if (!responsibleUnit) {
        setMessage("Please enter a responsible unit for the annual report");
        return;
      }
    }

    // Validation for other document types with required fields (only if document type is selected)
    if (documentType && 
        (documentType === "semi annual report" || 
        documentType === "insider trading policy" || 
        documentType === "share holder meeting disclosure" || 
        documentType === "confidential information")) {
      if (!timeline) {
        setMessage("Please enter a time line");
        return;
      }
      if (!responsibleUnit) {
        setMessage("Please enter a responsible unit");
        return;
      }
    }

    // Validation for board meeting disclosure (only if document type is selected)
    if (documentType === "board meeting disclosure") {
      if (!mettype) {
        setMessage("Please enter a meeting type");
        return;
      }
      if (!timeline) {
        setMessage("Please enter a time line");
        return;
      }
      if (!responsibleUnit) {
        setMessage("Please enter a responsible unit");
        return;
      }
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

      const finalCompanyName =
        role === "ADMIN"
          ? `${companyName.trim().toLowerCase()}@esx.com`
          : "esx1@esx.com";

      // Prepare additional metadata for specific document types
      const additionalMetadata = documentType ? {
        ...(documentType === "annual report" && {
          reportingDate: selectedDate,
          responsibleUnit: responsibleUnit,
          remark: remark,
          timeLine: timeline
        }),
        ...((documentType === "semi annual report" || 
            documentType === "insider trading policy" || 
            documentType === "share holder meeting disclosure" || 
            documentType === "confidential information") && {
          timeLine: timeline,
          responsibleUnit: responsibleUnit,
          remark: remark,
        }),
        ...(documentType === "board meeting disclosure" && {
          meetingType: mettype,
          timeLine: timeline,
          responsibleUnit: responsibleUnit,
          remark: remark,
        })
      } : {};

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl: publicUrlData.publicUrl,
          userId: userEmail || "unknown-user",
          companyName: finalCompanyName,
          from: userEmail,
          type: documentType || "other", // Use "other" if no document type is selected
          ...additionalMetadata,
        }),
      });

      if (!res.ok) throw new Error("Failed to save metadata");

      setMessage("File uploaded successfully!");
      setFile(null);
      setCompanyName("");
      setDocumentType(null);
      setCustomDocumentType("");
      setSelectedDate("");
      setResponsibleUnit("");
      setRemark("");
      settimeline("");
      setmettype("");
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
                Issuer Code
              </label>
              <Input
                placeholder="Enter issuer code"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}
          
          {/* Show document type selection only for USERS, not ADMINS */}
          {role === "USER" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Document Type (Optional)
              </label>
              <Select value={documentType || ""} onValueChange={(value) => setDocumentType(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type (optional)" />
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
          )}

          {documentType === "annual report" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reporting Date
                </label>
                <div className="space-y-2">
                  {ANNUAL_REPORT_DATES.map((date) => (
                    <div key={date} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={date}
                        name="reportingDate"
                        value={date}
                        checked={selectedDate === date}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        required
                      />
                      <label htmlFor={date} className="text-sm text-gray-700">
                        {date}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Responsible Unit
                </label>
                <Input
                  placeholder="Enter responsible unit"
                  value={responsibleUnit}
                  onChange={(e) => setResponsibleUnit(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Time Line
                </label>
                <Input
                  placeholder="Enter time line"
                  value={timeline}
                  onChange={(e) => settimeline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Remark
                </label>
                <Textarea
                  placeholder="Enter any additional remarks"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          {(documentType === "semi annual report" ||
            documentType === "insider trading policy" ||
            documentType === "share holder meeting disclosure" ||
            documentType === "confidential information") && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Time Line
                </label>
                <Input
                  placeholder="Enter time line"
                  value={timeline}
                  onChange={(e) => settimeline(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Responsible Unit
                </label>
                <Input
                  placeholder="Enter responsible unit"
                  value={responsibleUnit}
                  onChange={(e) => setResponsibleUnit(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Remark
                </label>
                <Textarea
                  placeholder="Enter any additional remarks"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
          
          {documentType === "board meeting disclosure" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Meeting Type
                </label>
                <Input
                  placeholder="Enter meeting type"
                  value={mettype}
                  onChange={(e) => setmettype(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Time Line
                </label>
                <Input
                  placeholder="Enter time line"
                  value={timeline}
                  onChange={(e) => settimeline(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Responsible Unit
                </label>
                <Input
                  placeholder="Enter responsible unit"
                  value={responsibleUnit}
                  onChange={(e) => setResponsibleUnit(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Remark
                </label>
                <Textarea
                  placeholder="Enter any additional remarks"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Document File
            </label>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button onClick={handleUpload} disabled={loading} className="w-full">
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
            <p
              className={`text-center text-sm p-3 rounded-md ${
                message.startsWith("Upload failed")
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}