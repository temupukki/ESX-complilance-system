// app/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { headers } from "next/headers";
import {
  Calendar,
  Bell,
  Upload,
  Users,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { format, differenceInDays } from "date-fns";
import EditableDeadlines from "../components/EditableDeadlines";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/");

  // Fetch real data from database
  const [documents, companies, users, dbDeadlines] = await Promise.all([
    prisma.document.findMany({
      where: { companyName: session.user.email },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.document.findMany({
      take: 5,
    }),
    prisma.user.findMany({
      take: 5,
    }),
    // Fetch deadlines from database
    prisma.deadline.findMany({
      orderBy: { deadline: "asc" },
    }),
  ]);

  // Calculate deadlines and alerts
  const now = new Date();

  // Calculate days remaining for each deadline from database
  const deadlines = dbDeadlines
    .map((deadline) => ({
      id: deadline.id,
      type: deadline.type,
      deadline: new Date(deadline.deadline),
      daysLeft: differenceInDays(new Date(deadline.deadline), now),
      description: deadline.description,
    }))
    .filter((deadline) => deadline.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  // Get urgent deadlines (within 15 days)
  const urgentDeadlines = deadlines.filter((d) => d.daysLeft <= 15);

  // Check for pending documents with deadlines
  const pendingDocuments = documents.filter((doc) => {
    const docDate = new Date(doc.createdAt);
    const daysSinceUpload = differenceInDays(now, docDate);

    // Different requirements based on document type
    switch (doc.type?.toLowerCase()) {
      case "insider trading policy":
        return daysSinceUpload >= 1; // Over 24 hours
      case "board meeting disclosure":
        return daysSinceUpload >= 5; // Over 5 days
      case "share holder meeting disclosure":
        return daysSinceUpload >= 7; // Over 7 days
      default:
        return false;
    }
  });



  // Stats calculations
  const totalDocuments = documents.length;
  const pendingCount = pendingDocuments.length;
  const urgentCount = urgentDeadlines.length;
  const completedCount = totalDocuments - pendingCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">
            ESX Document Manager
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-gray-200"
            >
              <div className="relative">
                <Bell className="h-4 w-4" />
                {urgentCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </div>
              Notifications {urgentCount > 0 && `(${urgentCount})`}
            </Button>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard/upload" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                New Upload
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {session.user?.name || session.user?.email}
          </h2>
          <p className="text-gray-600">
            Manage your documents and stay compliant with ESX requirements
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Documents</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalDocuments}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800">
                  {completedCount}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>


          <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Urgent</p>
                <p className="text-2xl font-bold text-gray-800">
                  {urgentCount}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Deadlines for USERS */}
            {session.user.role === "USER" && (
              <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Upcoming Deadlines
                  </h3>
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-4">
                  {deadlines.slice(0, 3).map((deadline, index) => (
                    <div
                      key={deadline.id}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {deadline.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {format(deadline.deadline, "MMMM dd, yyyy")}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {deadline.description}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          deadline.daysLeft <= 7
                            ? "bg-red-100 text-red-800"
                            : deadline.daysLeft <= 15
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {deadline.daysLeft === 0
                          ? "Today"
                          : deadline.daysLeft === 1
                          ? "Tomorrow"
                          : `${deadline.daysLeft} days left`}
                      </div>
                    </div>
                  ))}
                  {deadlines.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No upcoming deadlines
                    </p>
                  )}
                </div>
                {deadlines.length > 3 && (
                  <div className="mt-4 text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      View all <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </Card>
            )}

            {/* Editable Deadlines for ADMINS */}
            {session.user.role === "ADMIN" && <EditableDeadlines />}

            {/* Recent Activity - Now Full Width */}
            <Card className="p-6 bg-white rounded-xl shadow-sm border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/documents" className="text-blue-600 text-sm flex items-center">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {documents.slice(0, 5).map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activity</p>
                   
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="p-6 bg-white rounded-xl shadow-sm border-0 ">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Quick Actions
                </h3>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <Button asChild className="h-16 justify-start px-4 py-3 bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard/upload" className="flex items-center gap-3">
                    <Upload className="h-5 w-5" />
                    <span>Upload Document</span>
                  </Link>
                </Button>

                {session.user.role === "ADMIN" && (
                  <Button
                    asChild
                    className="h-16 justify-start px-4 py-3 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                  >
                    <Link href="/dashboard/company/add" className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>Add New User</span>
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  className="h-16 justify-start px-4 py-3 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                >
                  <Link href="/dashboard/documents" className="flex items-center gap-3">
                    <FileText className="h-5 w-5" />
                    <span>View Documents</span>
                  </Link>
                </Button>

                {session.user.role === "ADMIN" && (
                  <Button
                    asChild
                    className="h-16 justify-start px-4 py-3 bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                  >
                    <Link href="/dashboard/company" className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>Manage Companies</span>
                    </Link>
                  </Button>
                )}
              </div>
            </Card>

           
          </div>
        </div>
      </div>
    </div>
  );
}