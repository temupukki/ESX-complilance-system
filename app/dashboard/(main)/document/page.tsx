"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

interface Document {
  id: string;
  title: string;
  type: string | null;
  from: string | null;
  companyName: string;
  fileUrl: string;
  createdAt: Date;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user email from session
    async function getUserEmail() {
      try {
        const response = await fetch("/api/session");
        if (response.ok) {
          const session = await response.json();
          setUserEmail(session?.user?.email || "");
        }
      } catch (err) {
        console.error("Failed to get user email:", err);
      }
    }

    getUserEmail();
  }, []);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/documents");
        if (!response.ok) throw new Error("Failed to fetch documents");
        const data = await response.json();
        setDocuments(data);
        
        // Filter documents where companyName matches user email
        const userDocuments = data.filter((doc: Document) => 
          doc.companyName.toLowerCase() === userEmail.toLowerCase()
        );
        setFilteredDocuments(userDocuments);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (userEmail) {
      fetchDocuments();
    }
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;

    // First filter by user email, then by document type
    const userDocuments = documents.filter(doc => 
      doc.companyName.toLowerCase() === userEmail.toLowerCase()
    );

    if (selectedType === "all") {
      setFilteredDocuments(userDocuments);
    } else {
      setFilteredDocuments(
        userDocuments.filter((doc) => doc.type === selectedType)
      );
    }
  }, [selectedType, documents, userEmail]);

  // Get unique document types from user's documents only
  const userDocuments = documents.filter(doc => 
    doc.companyName.toLowerCase() === userEmail.toLowerCase()
  );
  
  const documentTypes = Array.from(
    new Set(userDocuments.map((doc) => doc.type).filter(Boolean))
  ) as string[];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="font-bold text-2xl mb-6 text-center text-blue-700">
        My Documents
      </h1>

      {/* Document Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-0">
            Filter Documents
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Documents
            </button>
            
            {documentTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {selectedType !== "all" && (
          <div className="mt-3 flex items-center">
            <span className="text-sm text-gray-600">
              Filtering by: <span className="font-medium capitalize">{selectedType}</span>
            </span>
            <button
              onClick={() => setSelectedType("all")}
              className="ml-3 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">
            {selectedType === "all" 
              ? "No documents available for your account." 
              : `No documents found for type "${selectedType}".`}
          </p>
          {selectedType !== "all" && (
            <button
              onClick={() => setSelectedType("all")}
              className="text-blue-600 hover:text-blue-800 underline mt-2"
            >
              View all documents
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-normal text-gray-800 font-medium">
                    {doc.title}
                  </td>
                  <td className="px-6 py-4 whitespace-normal">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {doc.type || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-gray-700">
                    {doc.from || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-normal text-gray-700">
                    {doc.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {format(new Date(doc.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      Download
                    </a>
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