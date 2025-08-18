import { NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { title, fileUrl, userId,companyName,from } = await req.json();

    if (!title || !fileUrl || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const doc = await prisma.document.create({
      data: { title, fileUrl, userId,companyName,from },
    });

    return NextResponse.json(doc);
  } catch (err: any) {
    console.error("Error saving document:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save document" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    // Get all documents, newest first
    const docs = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(docs);
  } catch (err: any) {
    console.error("Error fetching documents:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch documents" },
      { status: 500 }
    );
  }
}