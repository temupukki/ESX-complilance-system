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
      <section className="py-20 bg-gradient-to-r from-blue-700 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to ESX Document Manager</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Streamline your document workflow with our secure, efficient management system
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link href="/dashboard/upload">Upload Documents</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/dashboard/document">View Documents</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4 text-4xl">📄</div>
            <h3 className="text-xl font-semibold mb-3">Document Management</h3>
            <p className="text-gray-600">
              Easily upload, organize, and track all your important documents in one secure location.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4 text-4xl">🏢</div>
            <h3 className="text-xl font-semibold mb-3">Company Portal</h3>
            <p className="text-gray-600">
              Manage multiple companies and their documents from a single dashboard.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-blue-600 mb-4 text-4xl">🔒</div>
            <h3 className="text-xl font-semibold mb-3">Secure Storage</h3>
            <p className="text-gray-600">
              Enterprise-grade security protecting your sensitive business documents.
            </p>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link href="/dashboard/upload">
                <span className="text-2xl">📤</span>
                Upload
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link href="/dashboard/document">
                <span className="text-2xl">🔍</span>
                Search
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link href="/dashboard/company">
                <span className="text-2xl">🏢</span>
                Companies
              </Link>
            </Button>
         
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-500">
            Your recent documents and activities will appear here
          </p>
          {/* You would map through real activity data here */}
        </div>
      </section>
    </div>
  );
}