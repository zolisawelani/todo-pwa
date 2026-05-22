import { useMemo } from 'react'
import { useTaskStore } from '../store/taskStore'
import { TaskItem } from './TaskItem'

export function TaskList() {
  const tasks = useTaskStore((s) => s.tasks)
  const filter = useTaskStore((s) => s.filter)
  const hydrated = useTaskStore((s) => s.hydrated)

  const filteredTasks = useMemo(() => {
    const sorted = [...tasks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    if (filter === 'active') return sorted.filter((t) => !t.completed)
    if (filter === 'completed') return sorted.filter((t) => t.completed)
    return sorted
  }, [tasks, filter])

  if (!hydrated) {
    return <p className="text-center text-sm text-gray-400 py-8">Loading…</p>
  }

  if (filteredTasks.length === 0) {
    const empty =
      filter === 'completed' ? 'No completed tasks'
      : filter === 'active' ? 'No active tasks'
      : 'No tasks yet — add one above'
    return <p className="text-center text-sm text-gray-400 py-8">{empty}</p>
  }

  return (
    <ul className="space-y-1">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
