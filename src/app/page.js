"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Board from "@/components/Board";
import TaskForm from "@/components/TaskForm";
import BoardSelector from "@/components/BoardSelector";
import { useBoard } from "@/hooks/useBoard";
import { useUI } from "@/hooks/useUI";
export default function Home() {
  const { boards, loadBoards } = useBoard();
  const { isTaskFormOpen } = useUI();
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  useEffect(() => {
    loadBoards();
  }, [loadBoards]);

  useEffect(() => {
    if (boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0]._id);
    }
  }, [boards, selectedBoardId]);

  if (boards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Boards Found</h1>
          <p className="text-gray-600">
            Create your first board to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Task Management</h1>
            <BoardSelector
              boards={boards}
              selectedBoardId={selectedBoardId}
              onSelectBoard={setSelectedBoardId}
            />
          </div>
        </div>
      </div>

      {selectedBoardId && <Board boardId={selectedBoardId} />}
      {isTaskFormOpen && <TaskForm />}
    </main>
  );
}
