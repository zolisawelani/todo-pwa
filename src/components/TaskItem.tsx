import { useState } from 'react'
import { type Task } from '../db'
import { useTaskStore } from '../store/taskStore'

interface Props {
  task: Task
}

export function TaskItem({ task }: Props) {
  const { toggleTask, removeTask, updateTask } = useTaskStore()
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const saveEdit = async () => {
    if (editTitle.trim() && editTitle !== task.title) {
      await updateTask(task.id, { title: editTitle.trim() })
    }
    setEditing(false)
  }

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date()

  return (
    <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors">
      <button
        onClick={() => toggleTask(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
          task.completed
            ? 'bg-indigo-500 border-indigo-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
        }`}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed && (
          <svg viewBox="0 0 12 12" className="w-full h-full text-white p-0.5">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false) }}
            className="w-full bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 border-b border-indigo-400"
          />
        ) : (
          <p
            onDoubleClick={() => { setEditing(true); setEditTitle(task.title) }}
            className={`text-sm leading-snug ${task.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}
          >
            {task.title}
          </p>
        )}

        {task.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{task.description}</p>
        )}

        {task.dueDate && (
          <p className={`text-xs mt-0.5 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`}>
            {isOverdue ? '⚠ ' : ''}Due {formatDate(task.dueDate)}
          </p>
        )}

        {task.reminderAt && !task.completed && (
          <p className="text-xs text-indigo-400 mt-0.5">
            🔔 {formatDate(task.reminderAt)}
          </p>
        )}
      </div>

      <button
        onClick={() => removeTask(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
        aria-label="Delete task"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor">
          <path d="M6 2a1 1 0 0 0-1 1H3a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2h-2a1 1 0 0 0-1-1H6zM4 6h8l-.8 7H4.8L4 6z" />
        </svg>
      </button>
    </li>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
