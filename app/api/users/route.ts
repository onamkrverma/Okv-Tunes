import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const userEmail = request.nextUrl.searchParams.get("email");
  try {
    if (!userEmail) {
      return NextResponse.json(
        {
          error: "The user email is required in 'email' parameters",
        },
        { status: 404 }
      );
    }
    await connectDB();

    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not exists");
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
