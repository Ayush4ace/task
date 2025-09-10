import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Board from "@/lib/models/Board";
import Column from "@/lib/models/Column";
import Task from "@/lib/models/Task";
import { createResponse, createErrorResponse } from "@/lib/api-utils";

// GET /api/boards/[id] - Get a specific board
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const board = await Board.findById(id).populate({
      path: "columns",
      populate: {
        path: "tasks",
        model: "Task",
      },
    });

    if (!board) {
      return createErrorResponse("Board not found", 404);
    }

    return createResponse(board);
  } catch (error) {
    return createErrorResponse("Failed to fetch board", 500);
  }
}

// PUT /api/boards/[id] - Update a board
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;
    const body = await request.json();

    const board = await Board.findByIdAndUpdate(
      id,
      { title: body.title },
      { new: true, runValidators: true }
    ).populate({
      path: "columns",
      populate: {
        path: "tasks",
        model: "Task",
      },
    });

    if (!board) {
      return createErrorResponse("Board not found", 404);
    }

    return createResponse(board);
  } catch (error) {
    return createErrorResponse("Failed to update board", 500);
  }
}

// DELETE /api/boards/[id] - Delete a board and its columns and tasks
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    const board = await Board.findById(id);

    if (!board) {
      return createErrorResponse("Board not found", 404);
    }

    // Delete all tasks in the board's columns
    await Task.deleteMany({ boardId: id });

    // Delete all columns in the board
    await Column.deleteMany({ boardId: id });

    // Delete the board
    await Board.findByIdAndDelete(id);

    return createResponse({ message: "Board deleted successfully" });
  } catch (error) {
    return createErrorResponse("Failed to delete board", 500);
  }
}
