import { useState, type FormEvent } from 'react'
import { useTaskStore } from '../store/taskStore'

export function TaskForm() {
  const addTask = useTaskStore((s) => s.addTask)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [reminderAt, setReminderAt] = useState('')
  const [expanded, setExpanded] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    await addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      reminderAt: reminderAt || undefined,
    })
    setTitle('')
    setDescription('')
    setDueDate('')
    setReminderAt('')
    setExpanded(false)
  }

  return (
    <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Add a task…"
          className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium disabled:opacity-40 hover:bg-indigo-600 transition-colors"
        >
          Add
        </button>
      </div>

      {expanded && (
        <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 outline-none resize-none"
          />
          <div className="flex gap-2 flex-wrap">
            <label className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
              Due date
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1.5 text-gray-800 dark:text-gray-200 outline-none text-xs"
              />
            </label>
            <label className="flex flex-col gap-0.5 text-xs text-gray-500 dark:text-gray-400">
              Reminder
              <input
                type="datetime-local"
                value={reminderAt}
                onChange={(e) => setReminderAt(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg px-2 py-1.5 text-gray-800 dark:text-gray-200 outline-none text-xs"
              />
            </label>
          </div>
        </div>
      )}
    </form>
  )
}
