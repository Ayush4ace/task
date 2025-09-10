import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Column from "@/lib/models/Column";
import Board from "@/lib/models/Board";
import Task from "@/lib/models/Task";
import { createResponse, createErrorResponse } from "@/lib/api-utils";

// GET /api/columns/[id] - Get a specific column
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const column = await Column.findById(id).populate("tasks");

    if (!column) {
      return createErrorResponse("Column not found", 404);
    }

    return createResponse(column);
  } catch (error) {
    return createErrorResponse("Failed to fetch column", 500);
  }
}

// PUT /api/columns/[id] - Update a column
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    const column = await Column.findByIdAndUpdate(
      id,
      { title: body.title },
      { new: true, runValidators: true }
    ).populate("tasks");

    if (!column) {
      return createErrorResponse("Column not found", 404);
    }

    return createResponse(column);
  } catch (error) {
    return createErrorResponse("Failed to update column", 500);
  }
}

// DELETE /api/columns/[id] - Delete a column and its tasks
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const column = await Column.findById(id);

    if (!column) {
      return createErrorResponse("Column not found", 404);
    }

    // Delete all tasks in the column
    await Task.deleteMany({ columnId: id });

    // Remove the column from the board's columns array
    await Board.findByIdAndUpdate(column.boardId, { $pull: { columns: id } });

    // Delete the column
    await Column.findByIdAndDelete(id);

    return createResponse({ message: "Column deleted successfully" });
  } catch (error) {
    return createErrorResponse("Failed to delete column", 500);
  }
}
