import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ADMIN_LINKS = [
  { href: "/dashboard/company", label: "Companies Management" },
  { href: "/dashboard/post", label: "Announce Message" },
    { href: "/dashboard/admin/deadlines", label: "Manage Deadlines" },
];

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // Redirect if not logged in or not admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const userName = session.user.name || "Admin";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {userName}</h1>
      <p className="mb-8 text-gray-700">
        This is your admin dashboard. Click any link to manage the system.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="bg-blue-700 hover:bg-blue-600 text-white font-semibold text-center py-6 rounded-lg shadow-md transition-all duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
