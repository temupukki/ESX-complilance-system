// app/dashboard/documents/page.tsx
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DocumentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("User not authenticated");
  }

  // Fetch documents directly from DB
  const docs = await prisma.document.findMany({
    where: { companyName: session.user.email},
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="font-bold text-2xl mb-6 text-center text-blue-700">
        My Documents
      </h1>

      {docs.length === 0 ? (
        <p className="text-center text-gray-500">No documents available for your account.</p>
      ) : (
        <ul className="space-y-4">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-3 rounded"
            >
              <div>
                <p className="font-medium">{doc.title}</p>
                {doc.companyName && (
                  <p className="text-sm text-gray-600">Company: {doc.companyName}</p>
                )}
              </div>
              <a
                href={doc.fileUrl}
                target="_blank"
                className="mt-2 sm:mt-0 text-blue-600 underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
