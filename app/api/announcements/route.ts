import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure prisma client is setup
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
       headers: await headers(),
     });

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    // Fetch announcements for this user or for "all"
    const announcements = await prisma.announcement.findMany({
      where: {
        OR: [
          { to: userEmail },
          { to: "all@esx.com" }
        ]
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(announcements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, message ,to} = await req.json();

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message required" }, { status: 400 });
    }

    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        message,
        to,
      },
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
