import { useEffect } from 'react'
import { useTaskStore } from './store/taskStore'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import { NotificationBanner } from './components/NotificationBanner'

export default function App() {
  const hydrate = useTaskStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-lg mx-auto space-y-4">
        <header className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            My Tasks
          </h1>
        </header>

        <NotificationBanner />
        <TaskForm />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <FilterBar />
          <TaskList />
        </div>
      </div>
    </div>
  )
}
