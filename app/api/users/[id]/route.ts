import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    if (!id) {
      return NextResponse.json(
        {
          error: "The user id is required in ':id' params",
        },
        { status: 404 }
      );
    }
    await connectDB();

    const user = await Users.findById(id, { name: 1, email: 1, image: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
