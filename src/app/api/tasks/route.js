import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Task from "@/lib/models/Task";
import Column from "@/lib/models/Column";
import {
  createResponse,
  createErrorResponse,
  validateRequiredFields,
} from "@/lib/api-utils";

// GET /api/tasks - Get all tasks (optionally filtered by columnId or boardId query parameters)
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const columnId = searchParams.get("columnId");
    const boardId = searchParams.get("boardId");

    let query = {};
    if (columnId) {
      query.columnId = columnId;
    } else if (boardId) {
      query.boardId = boardId;
    }

    const tasks = await Task.find(query).sort({ order: 1 });

    return createResponse(tasks);
  } catch (error) {
    return createErrorResponse("Failed to fetch tasks", 500);
  }
}

// POST /api/tasks - Create a new task
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const error = validateRequiredFields(body, [
      "title",
      "columnId",
      "boardId",
    ]);

    if (error) {
      return createErrorResponse(error, 400);
    }

    // Get the highest order value for tasks in this column
    const lastTask = await Task.findOne({ columnId: body.columnId }).sort({
      order: -1,
    });

    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title: body.title,
      description: body.description || "",
      assignedTo: body.assignedTo || null,
      status: body.status || "todo",
      columnId: body.columnId,
      boardId: body.boardId,
      order: order,
    });

    // Add the task to the column's tasks array
    await Column.findByIdAndUpdate(body.columnId, {
      $push: { tasks: task._id },
    });

    return createResponse(task, 201);
  } catch (error) {
    return createErrorResponse("Failed to create task", 500);
  }
}
