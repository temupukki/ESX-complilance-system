"use client";
import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = {
  main: [
    { href: "/", label: "Home" },
    { href: "/document", label: "View Document" },
    { href: "/upload", label: "Upload Document" },
    { href: "/company", label: "Companies Management" },
  ],
};

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className="w-full bg-blue-700 sticky top-0 z-50 m-auto p-4">
      <div className="flex justify-between items-center h-16 px-0">
        <Link href="/" className="flex items-center gap-2 ml-4">
          <img
            src="/esx-logo-white-small.webp"
            alt="ESX Logo"
            className="w-60 h-26 rounded-full"
          />
        </Link>

        {/* Navigation - right aligned */}
        <div className="flex items-center h-full">
          {NAV_LINKS.main.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:bg-blue-600 px-6 py-5 h-full flex items-center transition-colors border-l border-blue-600"
            >
              {link.label}
            </Link>
          ))}
          {/* Get Started Button */}
          <Link
            href="/sign-up"
            className="ml-6 bg-white text-blue-700 hover:bg-gray-100 font-medium rounded-lg px-5 py-2.5 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}