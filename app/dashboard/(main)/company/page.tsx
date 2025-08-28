"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner"; // using sonner for nice toasts

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export default function CompaniesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedRoles, setEditedRoles] = useState<{ [key: string]: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  // Fetch users on mount
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = (id: string, newRole: string) => {
    setEditedRoles((prev) => ({ ...prev, [id]: newRole }));
  };

  const handleSaveRole = async (id: string) => {
    const newRole = editedRoles[id];
    if (!newRole) return;

    setSavingId(id);
    try {
      const res = await fetch(`/api/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Role updated successfully!");
      await loadUsers(); // reload fresh data
      setEditedRoles((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      toast.error("Error updating role");
    }
    setSavingId(null);
  };

  if (loading) return <p className="p-4">Loading users...</p>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">Registered Users</h1>

      {/* Add User Button */}
      <Link
        href="/dashboard/company/add"
        className="inline-block mb-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 transition"
      >
        + Add New User
      </Link>

      {users.length === 0 ? (
        <p className="text-gray-500 italic">No users registered yet.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Address / License</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Updated At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, idx) => {
                const currentRole = editedRoles[user.id] ?? user.role;
                const isEdited = editedRoles[user.id] !== undefined;
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.image}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <select
                        value={currentRole}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {isEdited ? (
                        <button
                          onClick={() => handleSaveRole(user.id)}
                          disabled={savingId === user.id}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 disabled:opacity-50"
                        >
                          {savingId === user.id ? "Saving..." : "Save"}
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No changes</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
