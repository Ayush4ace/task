import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();

    const connectionState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return NextResponse.json({
      database: states[connectionState],
      connected: connectionState === 1,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        database: "error",
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
