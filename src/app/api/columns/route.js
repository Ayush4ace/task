import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Column from "@/lib/models/Column";
import Board from "@/lib/models/Board";
import {
  createResponse,
  createErrorResponse,
  validateRequiredFields,
} from "@/lib/api-utils";

// GET /api/columns - Get all columns (optionally filtered by boardId query parameter)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");

    let query = {};
    if (boardId) {
      query.boardId = boardId;
    }

    const columns = await Column.find(query)
      .populate("tasks")
      .sort({ order: 1 });

    return createResponse(columns);
  } catch (error) {
    return createErrorResponse("Failed to fetch columns", 500);
  }
}

// POST /api/columns - Create a new column
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const error = validateRequiredFields(body, ["title", "boardId"]);

    if (error) {
      return createErrorResponse(error, 400);
    }

    // Get the highest order value for columns in this board
    const lastColumn = await Column.findOne({ boardId: body.boardId }).sort({
      order: -1,
    });

    const order = lastColumn ? lastColumn.order + 1 : 0;

    const column = await Column.create({
      title: body.title,
      boardId: body.boardId,
      order: order,
    });

    // Add the column to the board's columns array
    await Board.findByIdAndUpdate(body.boardId, {
      $push: { columns: column._id },
    });

    const populatedColumn = await Column.findById(column._id).populate("tasks");

    return createResponse(populatedColumn, 201);
  } catch (error) {
    return createErrorResponse("Failed to create column", 500);
  }
}
