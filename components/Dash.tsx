import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "./ui/button";
import { headers } from "next/headers";

const NAV_LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/document", label: "View Document" },
  { href: "/dashboard/upload", label: "Upload Document" },
  { href: "/dashboard/company", label: "Companies Management" },
   { href: "/dashboard/post", label: "Announce Message" },
  { href: "/dashboard/announcements", label: "Announced Messages" },
];

export default async function Navbar() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/"); // redirect if not logged in
  }

  const userName = session.user.name || "User";

  return (
    <nav className="w-full bg-blue-700 sticky top-0 z-50 p-4">
      <div className="flex justify-between items-center h-16 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/esx-logo-white-small.webp"
            alt="ESX Logo"
            className="w-60 h-26 rounded-full"
          />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:bg-blue-600 px-4 py-2 rounded transition"
            >
              {link.label}
            </Link>
          ))}

          {/* Display User Name */}
          <span className="text-white font-semibold px-4 py-2">
            {userName}
          </span>

          {/* Sign Out */}
          <form
            action={async () => {
              "use server";
              await auth.api.signOut({ headers: await headers() });
              redirect("/");
            }}
          >
            <Button className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </nav>
  );
}
