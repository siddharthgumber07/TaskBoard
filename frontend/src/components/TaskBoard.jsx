import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';

const API_BASE = 'https://taskboard-backend-depu.onrender.com/tasks';

const TaskBoard = () => {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: 'To Do', tasks: [] },
    inprogress: { id: 'inprogress', title: 'In Progress', tasks: [] },
    done: { id: 'done', title: 'Done', tasks: [] },
  });

  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-all-tasks`);
      const tasks = res.data;
      const colData = {
        todo: { id: 'todo', title: 'To Do', tasks: [] },
        inprogress: { id: 'inprogress', title: 'In Progress', tasks: [] },
        done: { id: 'done', title: 'Done', tasks: [] },
      };
      tasks.forEach(task => {
        const key = task.status.toLowerCase().replace(/\s+/g, '');
        if (colData[key]) {
          colData[key].tasks.push(task);
        }
      });
      setColumns(colData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      alert('Failed to fetch tasks');
    }
    setLoading(false);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);

    if (source.droppableId === destination.droppableId) {
      const [movedTask] = sourceTasks.splice(source.index, 1);
      sourceTasks.splice(destination.index, 0, movedTask);

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: {
          ...sourceCol,
          tasks: sourceTasks,
        },
      }));
    } else {
      const [movedTask] = sourceTasks.splice(source.index, 1);

      try {
        await axios.put(`${API_BASE}/update/${movedTask._id}`, {
          status: destCol.title,
        });
        movedTask.status = destCol.title;
      } catch (err) {
        alert('Failed to update task status');
        return;
      }

      destTasks.splice(destination.index, 0, movedTask);

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: {
          ...sourceCol,
          tasks: sourceTasks,
        },
        [destination.droppableId]: {
          ...destCol,
          tasks: destTasks,
        },
      }));
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return alert('Task title is required');

    try {
      const res = await axios.post(`${API_BASE}/create`, {
        title: newTaskTitle,
        description: newTaskDesc,
        status: 'To Do',
      });
      const newTask = res.data;
      setColumns(prev => ({
        ...prev,
        todo: { ...prev.todo, tasks: [newTask, ...prev.todo.tasks] },
      }));
      setNewTaskTitle('');
      setNewTaskDesc('');
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;

    try {
      await axios.delete(`${API_BASE}/delete/${taskId}`);
      setColumns(prev => {
        const newCols = { ...prev };
        Object.keys(newCols).forEach(colKey => {
          newCols[colKey].tasks = newCols[colKey].tasks.filter(task => task._id !== taskId);
        });
        return newCols;
      });
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-700 dark:text-gray-300">Loading tasks...</div>;

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-500">
      {/* New Task Form */}
      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-lg shadow-lg transition-colors duration-500">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Create New Task
        </h2>
        <input
          type="text"
          placeholder="Title"
          className="
            border border-gray-300 dark:border-gray-600
            p-3 w-full mb-5 rounded-md
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition duration-300
          "
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          className="
            border border-gray-300 dark:border-gray-600
            p-3 w-full mb-5 rounded-md resize-none h-28
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition duration-300
          "
          value={newTaskDesc}
          onChange={e => setNewTaskDesc(e.target.value)}
        />
        <button
          onClick={handleCreateTask}
          className="
            bg-indigo-600 hover:bg-indigo-700
            text-white px-7 py-3 rounded-md font-semibold
            focus:outline-none focus:ring-4 focus:ring-indigo-300
            dark:focus:ring-indigo-700
            transition duration-300
          "
        >
          Add Task
        </button>
      </div>

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <Column
              key={columnId}
              columnId={columnId}
              title={column.title}
              tasks={column.tasks}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;
