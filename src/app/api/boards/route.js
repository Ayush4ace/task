import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Board from "@/lib/models/Board";
import Column from "@/lib/models/Column";
import Task from "@/lib/models/Task";
import {
  createResponse,
  createErrorResponse,
  validateRequiredFields,
} from "@/lib/api-utils";

// GET /api/boards - Get all boards
export async function GET() {
  try {
    console.log("GET /api/boards - Connecting to database");
    await dbConnect();
    console.log("GET /api/boards - Database connected");

    const boards = await Board.find({})
      .populate({
        path: "columns",
        populate: {
          path: "tasks",
          model: "Task",
        },
      })
      .sort({ createdAt: -1 });

    console.log(`GET /api/boards - Found ${boards.length} boards`);
    return createResponse(boards);
  } catch (error) {
    console.error("GET /api/boards - Error:", error);
    return createErrorResponse("Failed to fetch boards: " + error.message, 500);
  }
}

// POST /api/boards - Create a new board
export async function POST(request) {
  try {
    console.log("POST /api/boards - Connecting to database");
    await dbConnect();
    console.log("POST /api/boards - Database connected");

    const body = await request.json();
    console.log("POST /api/boards - Request body:", body);

    const error = validateRequiredFields(body, ["title"]);

    if (error) {
      console.log("POST /api/boards - Validation error:", error);
      return createErrorResponse(error, 400);
    }

    // Create default columns for the board
    const defaultColumns = [
      { title: "To Do", order: 0 },
      { title: "In Progress", order: 1 },
      { title: "Done", order: 2 },
    ];

    console.log("POST /api/boards - Creating default columns");
    const createdColumns = await Column.insertMany(
      defaultColumns.map((col) => ({ ...col, boardId: null }))
    );

    // Update columns with board ID
    const columnIds = createdColumns.map((col) => col._id);
    await Column.updateMany(
      { _id: { $in: columnIds } },
      { $set: { boardId: null } } // Will be updated after board creation
    );

    // Create board with columns
    console.log("POST /api/boards - Creating board");
    const board = await Board.create({
      title: body.title,
      columns: columnIds,
    });

    // Update columns with the board ID
    await Column.updateMany(
      { _id: { $in: columnIds } },
      { $set: { boardId: board._id } }
    );

    const populatedBoard = await Board.findById(board._id).populate({
      path: "columns",
      populate: {
        path: "tasks",
        model: "Task",
      },
    });

    console.log(
      "POST /api/boards - Board created successfully:",
      populatedBoard._id
    );
    return createResponse(populatedBoard, 201);
  } catch (error) {
    console.error("POST /api/boards - Error:", error);
    return createErrorResponse("Failed to create board: " + error.message, 500);
  }
}


