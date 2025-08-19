// app/admin/deadlines/page.tsx
"use client";

import { useState, useEffect } from "react";
import { format, differenceInDays } from "date-fns";
import { Plus, Edit, Save, X, Trash2 } from "lucide-react";
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
  tempType?: string;
  tempDescription?: string;
}

export default function AdminDeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [newDeadline, setNewDeadline] = useState({
    type: "",
    deadline: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);

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

  const createDeadline = async () => {
    try {
      const response = await fetch("/api/deadlines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeadline),
      });

      if (response.ok) {
        setNewDeadline({ type: "", deadline: "", description: "" });
        await fetchDeadlines();
      }
    } catch (error) {
      console.error("Error creating deadline:", error);
    }
  };

  const updateDeadline = async (id: string, field: string, value: string) => {
    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        await fetchDeadlines();
      }
    } catch (error) {
      console.error("Error updating deadline:", error);
    }
  };

  const deleteDeadline = async (id: string) => {
    try {
      const response = await fetch(`/api/deadlines/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchDeadlines();
      }
    } catch (error) {
      console.error("Error deleting deadline:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Deadlines</h1>
      
      {/* Add new deadline form */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Add New Deadline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Type (e.g., Annual Report)"
            value={newDeadline.type}
            onChange={(e) => setNewDeadline({ ...newDeadline, type: e.target.value })}
          />
          <Input
            type="date"
            value={newDeadline.deadline}
            onChange={(e) => setNewDeadline({ ...newDeadline, deadline: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={newDeadline.description}
            onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
          />
        </div>
        <Button onClick={createDeadline} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Deadline
        </Button>
      </Card>

      {/* Deadlines list */}
      <div className="space-y-4">
        {deadlines.map((deadline) => {
          const daysLeft = differenceInDays(new Date(deadline.deadline), new Date());
          
          return (
            <Card key={deadline.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={deadline.type}
                    onChange={(e) => updateDeadline(deadline.id, "type", e.target.value)}
                  />
                  <Input
                    type="date"
                    value={format(new Date(deadline.deadline), "yyyy-MM-dd")}
                    onChange={(e) => updateDeadline(deadline.id, "deadline", e.target.value)}
                  />
                  <Input
                    value={deadline.description}
                    onChange={(e) => updateDeadline(deadline.id, "description", e.target.value)}
                  />
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    daysLeft <= 15 ? "bg-red-100 text-red-800" :
                    daysLeft <= 30 ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {daysLeft}d left
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteDeadline(deadline.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}