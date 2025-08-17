// app/dashboard/companies/page.tsx
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CompaniesPage() {
  // Fetch all users from the user table
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

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
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
            
             
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, idx) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
