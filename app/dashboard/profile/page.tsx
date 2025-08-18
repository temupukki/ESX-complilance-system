// app/dashboard/profile/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default async function ProfilePage() {
  // Fetch session data
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-red-500">
          You need to be logged in to view this page
        </p>
      </div>
    );
  }

  // User details from session
  const user = session.user;
  const currentTime = new Date();
  const accountCreated = new Date(user.createdAt);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Your Profile
      </h1>

      {/* User Details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-gray-500">Name</h2>
          <p className="text-lg font-semibold">{user.name || "Not provided"}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Email</h2>
          <p className="text-lg font-semibold">{user.email}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Role</h2>
          <p className="text-lg font-semibold capitalize">
            {user.role?.toLowerCase() || "user"}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500">Account Created</h2>
          <p className="text-lg font-semibold">
            {format(accountCreated, "MMM d, yyyy h:mm a")}
          </p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(accountCreated, { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="mt-6">
        <Link
          href="/dashboard/profile/change"
          className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-center"
        >
          Change Password
        </Link>
      </div>
    </div>
  );
}
