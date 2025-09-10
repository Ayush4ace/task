# Kanban Board Project

A full-featured Kanban board built with Next.js, MongoDB, Redux Toolkit, Socket.io, and react-beautiful-dnd. Supports real-time collaboration, drag-and-drop, optimistic UI, and CRUD for boards, columns, and tasks.

---

## Features

- **CRUD Operations** for Boards, Columns, and Tasks
- **Drag & Drop** between columns (react-beautiful-dnd)
- **Optimistic UI** for instant feedback and rollback on errors
- **Real-time Updates** via Socket.io (WebSockets)
- **Redux State Management** for scalable global state
- **Accessibility**: ARIA labels, keyboard navigation, high contrast mode
- **User Assignment**: Assign users to tasks, avatar display
- **Filtering & Search**: Search and filter tasks by multiple criteria
- **Performance Optimizations**: Code splitting, memoization, virtualized lists

---

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- MongoDB instance (local or cloud)

---

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayush4ace/task.git

   or 
    ssh:
   git clone git@github.com:Ayush4ace/task.git
   cd assigned-mern-todo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the example file and edit your MongoDB and Socket.io URLs:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
   ```

---

## Running the App Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

2. **(Optional) Start the Socket.io backend for real-time updates:**

   If using a custom backend for Socket.io, start it separately:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The backend runs on port `3001` by default.

---

## Project Structure

```
src/
  app/           # Next.js app router and API routes
  components/    # React components (Board, Column, Task, etc.)
  lib/           # MongoDB models, socket client, utilities
  store/         # Redux slices and store setup
public/          # Static assets
.env.local       # Environment variables
```

---

## API Endpoints

- `POST /api/board` - Create board
- `GET /api/board` - Get all boards
- `PUT /api/board/:id` - Update board
- `DELETE /api/board/:id` - Delete board

- `POST /api/column` - Create column
- `PUT /api/column/:id` - Update column
- `DELETE /api/column/:id` - Delete column

- `POST /api/task` - Create task
- `PUT /api/task/:id` - Update task
- `DELETE /api/task/:id` - Delete task

---

## Real-time Collaboration

- Changes (add/edit/move tasks) are broadcast to all connected clients via Socket.io.
- UI updates instantly (optimistic), then confirms with server.
- Rollback and error notifications if server rejects changes.

---

## Testing

- **Run all tests:**
  ```bash
  npm test
  ```
- **Coverage report:**
  ```bash
  npm test -- --coverage --watchAll=false
  ```
- Tests use Jest and React Testing Library.

---

## Accessibility

- Full keyboard navigation
- ARIA labels and roles
- High contrast mode
- Screen reader compatibility

---

## Production Build

To build for production:
```bash
npm run build
npm start
```

---

## Troubleshooting

- Ensure MongoDB URI is correct and accessible.
- If using real-time features, make sure Socket.io backend is running.
- For any issues, check logs in the terminal and browser console.

---

## License

MIT

---

## Contributing

Pull requests and issues are welcome!