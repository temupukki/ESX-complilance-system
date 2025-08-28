// app/api/users/[id]/role/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ await params
  const body = await request.json();
  const { role } = body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role.trim() }, // sanitize role input
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 400 });
  }
}
