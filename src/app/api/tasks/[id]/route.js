import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongo";
import Task from "@/lib/models/Task";
import Column from "@/lib/models/Column";
import { createResponse, createErrorResponse } from "@/lib/api-utils";

// GET /api/tasks/[id] - Get a specific task
export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const task = await Task.findById(id);

    if (!task) {
      return createErrorResponse("Task not found", 404);
    }

    return createResponse(task);
  } catch (error) {
    return createErrorResponse("Failed to fetch task", 500);
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    // If moving task to a different column, update both columns
    if (body.columnId) {
      const task = await Task.findById(id);

      if (!task) {
        return createErrorResponse("Task not found", 404);
      }

      // Remove task from old column
      await Column.findByIdAndUpdate(task.columnId, { $pull: { tasks: id } });

      // Add task to new column
      await Column.findByIdAndUpdate(body.columnId, { $push: { tasks: id } });
    }

    const updateData = { ...body };

    const task = await Task.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return createErrorResponse("Task not found", 404);
    }

    return createResponse(task);
  } catch (error) {
    return createErrorResponse("Failed to update task", 500);
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const task = await Task.findById(id);

    if (!task) {
      return createErrorResponse("Task not found", 404);
    }

    // Remove the task from its column
    await Column.findByIdAndUpdate(task.columnId, { $pull: { tasks: id } });

    // Delete the task
    await Task.findByIdAndDelete(id);

    return createResponse({ message: "Task deleted successfully" });
  } catch (error) {
    return createErrorResponse("Failed to delete task", 500);
  }
}
