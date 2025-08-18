import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Welcome to ESX Document Manager
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Streamline your document workflow with our secure, efficient management system
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button asChild variant="secondary" size="lg" className="shadow-lg hover:shadow-xl">
              <Link href="/dashboard/upload">Upload Documents</Link>
            </Button>
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl">
              <Link href="/dashboard/document">View Documents</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="text-blue-600 mb-4 text-5xl text-center">📄</div>
            <h3 className="text-2xl font-semibold mb-3 text-center">Document Management</h3>
            <p className="text-gray-600 text-center">
              Easily upload, organize, and track all your important documents in one secure location.
            </p>
          </Card>

          <Card className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="text-blue-600 mb-4 text-5xl text-center">🏢</div>
            <h3 className="text-2xl font-semibold mb-3 text-center">Company Portal</h3>
            <p className="text-gray-600 text-center">
              Manage multiple companies and their documents from a single dashboard.
            </p>
          </Card>

          <Card className="p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
            <div className="text-blue-600 mb-4 text-5xl text-center">🔒</div>
            <h3 className="text-2xl font-semibold mb-3 text-center">Secure Storage</h3>
            <p className="text-gray-600 text-center">
              Enterprise-grade security protecting your sensitive business documents.
            </p>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Button asChild variant="outline" className="h-28 flex flex-col justify-center items-center gap-2 rounded-xl shadow hover:shadow-lg transition-all">
              <Link href="/dashboard/upload" className="text-center">
                <span className="text-3xl">📤</span>
                <p className="mt-1 font-semibold text-gray-700">Upload</p>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-28 flex flex-col justify-center items-center gap-2 rounded-xl shadow hover:shadow-lg transition-all">
              <Link href="/dashboard/document" className="text-center">
                <span className="text-3xl">🔍</span>
                <p className="mt-1 font-semibold text-gray-700">Search</p>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-28 flex flex-col justify-center items-center gap-2 rounded-xl shadow hover:shadow-lg transition-all">
              <Link href="/dashboard/company" className="text-center">
                <span className="text-3xl">🏢</span>
                <p className="mt-1 font-semibold text-gray-700">Companies</p>
              </Link>
            </Button>
          </div>
        </div>
      </section>

   
    </div>
  );
}
