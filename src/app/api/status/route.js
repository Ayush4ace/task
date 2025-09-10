import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Task from "@/lib/models/Task";
import { createResponse, createErrorResponse } from "@/lib/api-utils";

// GET /api/status - Get tasks grouped by status
export async function GET() {
  try {
    await dbConnect();

    const tasksByStatus = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          tasks: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          tasks: 1,
          _id: 0,
        },
      },
      {
        $sort: { status: 1 },
      },
    ]);

    return createResponse(tasksByStatus);
  } catch (error) {
    return createErrorResponse("Failed to fetch status data", 500);
  }
}

// POST /api/status - Update task status (for drag and drop)
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const error = validateRequiredFields(body, [
      "taskId",
      "newStatus",
      "newColumnId",
    ]);

    if (error) {
      return createErrorResponse(error, 400);
    }

    const { taskId, newStatus, newColumnId, newOrder } = body;

    // Find the task
    const task = await Task.findById(taskId);

    if (!task) {
      return createErrorResponse("Task not found", 404);
    }

    // If moving to a different column, update column references
    if (newColumnId && newColumnId !== task.columnId.toString()) {
      // Remove from old column
      await Column.findByIdAndUpdate(task.columnId, {
        $pull: { tasks: taskId },
      });

      // Add to new column
      await Column.findByIdAndUpdate(newColumnId, { $push: { tasks: taskId } });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        status: newStatus,
        columnId: newColumnId || task.columnId,
        order: newOrder !== undefined ? newOrder : task.order,
      },
      { new: true }
    );

    return createResponse(updatedTask);
  } catch (error) {
    return createErrorResponse("Failed to update task status", 500);
  }
}
