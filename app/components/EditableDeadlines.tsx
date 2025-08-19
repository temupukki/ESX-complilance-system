// app/components/EditableDeadlines.tsx
"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { Calendar, Edit, Save, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Deadline {
  id: string;
  type: string;
  deadline: Date;
  description: string;
  isEditing?: boolean;
  tempDate?: string;
}

interface Session {
  user: {
    role: string;
    email: string;
    name?: string;
  };
}

export default function EditableDeadlines() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/session");
        if (response.ok) {
          const sessionData = await response.json();
          setSession(sessionData);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    }

    fetchSession();
  }, []);

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const response = await fetch("/api/deadlines");
      if (response.ok) {
        const data = await response.json();
        setDeadlines(data);
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Exit edit mode
      setDeadlines(prev => prev.map(d => ({ ...d, isEditing: false, tempDate: undefined })));
    } else {
      // Enter edit mode
      setDeadlines(prev => prev.map(d => ({
        ...d,
        isEditing: true,
        tempDate: format(new Date(d.deadline), "yyyy-MM-dd")
      })));
    }
    setIsEditing(!isEditing);
  };

  const updateDeadlineDate = (id: string, newDate: string) => {
    setDeadlines(prev => prev.map(d => 
      d.id === id ? { ...d, tempDate: newDate } : d
    ));
  };

  const saveDeadline = async (id: string) => {
    const deadlineToUpdate = deadlines.find(d => d.id === id);
    if (!deadlineToUpdate || !deadlineToUpdate.tempDate) return;

    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deadline: deadlineToUpdate.tempDate,
        }),
      });

      if (response.ok) {
        await fetchDeadlines(); // Refresh deadlines
      }
    } catch (error) {
      console.error("Error updating deadline:", error);
    }
  };

  const cancelEdit = (id: string) => {
    setDeadlines(prev => prev.map(d => 
      d.id === id ? { ...d, isEditing: false, tempDate: undefined } : d
    ));
  };

  const cancelAllEdits = () => {
    setDeadlines(prev => prev.map(d => ({
      ...d,
      isEditing: false,
      tempDate: undefined
    })));
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center justify-center min-h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  const isAdmin = session?.user.role === "ADMIN";

  return (
    <Card className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Upcoming Deadlines
        </h3>
        <div className="flex items-center gap-2">
          {isAdmin && isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={cancelAllEdits}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : isAdmin ? (
            <Button
              size="sm"
              variant="outline"
              onClick={toggleEdit}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit Deadlines
            </Button>
          ) : null}
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        {deadlines.slice(0, 3).map((deadline) => {
          const daysLeft = differenceInDays(new Date(deadline.deadline), new Date());
          
          return (
            <div
              key={deadline.id}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {deadline.type}
                </p>
                
                {isAdmin && deadline.isEditing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="date"
                      value={deadline.tempDate}
                      onChange={(e) => updateDeadlineDate(deadline.id, e.target.value)}
                      className="w-40"
                    />
                    <Button
                      size="sm"
                      onClick={() => saveDeadline(deadline.id)}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelEdit(deadline.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    {format(new Date(deadline.deadline), "MMMM dd, yyyy")}
                  </p>
                )}
                
                <p className="text-xs text-gray-500 mt-1">
                  {deadline.description}
                </p>
              </div>
              
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  daysLeft <= 15
                    ? "bg-red-100 text-red-800"
                    : daysLeft <= 30
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {daysLeft === 0
                  ? "Today"
                  : daysLeft < 0
                  ? `${Math.abs(daysLeft)} days overdue`
                  : `${daysLeft} days left`}
              </div>
            </div>
          );
        })}
        
        {deadlines.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No upcoming deadlines
          </p>
        )}
      </div>

      {isAdmin && isEditing && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 You are editing deadline dates. Changes will be saved to the database.
          </p>
        </div>
      )}
    </Card>
  );
}