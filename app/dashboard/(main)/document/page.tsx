// app/dashboard/documents/page.tsx
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { format } from "date-fns";

export default async function DocumentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  // Fetch documents for this user
  const docs = await prisma.document.findMany({
    where: { companyName: session.user.email },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="font-bold text-2xl mb-6 text-center text-blue-700">
        My Documents
      </h1>

      {docs.length === 0 ? (
        <p className="text-center text-gray-500">
          No documents available for your account.
        </p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
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
              {docs.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-100 transition-colors">
                  <td className="px-6 py-4 whitespace-normal text-gray-800 font-medium">
                    {doc.title}
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